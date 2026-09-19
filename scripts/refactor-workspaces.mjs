import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';

const config = ts.readConfigFile('tsconfig.app.json', ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd());
const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();

const plans = {
  PreOpDetails: [
    ['PreOpHistoryPanel', 1880], ['PreOpTestsPanel', 2085],
    ['AnesthesiaPanel', 2324], ['IntraOpPanel', 2958], ['PreOpWorkflowTabs', 1725],
  ],
  PostOpDetails: [
    ['PostOpMedicationsCard', 1647], ['PostOpOrdersCard', 1755],
    ['PostOpLifestyleCard', 1872], ['PostOpVisitsCard', 2092],
    ['PostOpReportEditor', 2529], ['PostOpExpandedList', 2750],
  ],
  Recovery: [['RecoveryQueue', 1259], ['RecoveryObservations', 2191], ['RecoveryReport', 2471]],
  ReceptionDetails: [['ReceptionAdmissionForm', 1646], ['ReceptionPrintCenter', 2052]],
};

function importsFor(file, directory) {
  return file.statements.filter(ts.isImportDeclaration).map(node => {
    let specifier = node.moduleSpecifier.text;
    if (specifier.startsWith('.')) {
      specifier = path.relative(directory, path.resolve(path.dirname(file.fileName), specifier)).replaceAll('\\', '/');
      if (!specifier.startsWith('.')) specifier = './' + specifier;
    }
    return node.getText(file).replace(node.moduleSpecifier.getText(file), JSON.stringify(specifier));
  }).join('\n');
}

for (const [page, selections] of Object.entries(plans)) {
  const file = program.getSourceFile(`src/pages/${page}.tsx`);
  const nodes = new Map();
  function collect(node) {
    if (ts.isJsxElement(node)) {
      const start = file.getLineAndCharacterOfPosition(node.getStart()).line + 1;
      if (!nodes.has(start)) nodes.set(start,node);
    }
    ts.forEachChild(node, collect);
  }
  collect(file);
  const edits = [];
  const newImports = [];
  const directory = path.resolve(`src/features/workspaces/${page}/panels`);
  fs.mkdirSync(directory, {recursive:true});
  for (const [name,line] of selections) {
    const node = nodes.get(line);
    if (!node) throw Error(`${page}:${line} missing`);
    const props = new Map();
    function visit(child) {
      if (ts.isIdentifier(child)) {
        const symbol = checker.getSymbolAtLocation(child);
        const declarations = symbol?.declarations;
        if (declarations?.length && declarations.every(d => d.getSourceFile() === file && (d.getStart() < node.getStart() || d.end > node.end))) {
          const declaration = declarations[0];
          const pageFunction = file.statements.find(s => ts.isFunctionDeclaration(s) && s.name?.text === page);
          if (declaration.getStart() > pageFunction.body.getStart() && declaration.end < pageFunction.body.end) {
            props.set(child.text, checker.typeToString(checker.getTypeAtLocation(child), file, ts.TypeFormatFlags.NoTruncation));
          }
        }
      }
      ts.forEachChild(child,visit);
    }
    visit(node);
    const keys = [...props.keys()];
    const types = [...props].map(([key,type]) => `  ${key}: ${type};`).join('\n');
    const source = `${importsFor(file,directory)}\nimport type * as React from 'react';\n\ntype Props = {\n${types}\n};\n\nexport function ${name}({ ${keys.join(', ')} }: Props) {\n  return (${node.getText(file)});\n}\n`;
    fs.writeFileSync(path.join(directory,`${name}.tsx`),source);
    edits.push({start:node.getStart(),end:node.end,text:`<${name} ${keys.map(key => `${key}={${key}}`).join(' ')} />`});
    newImports.push(`import { ${name} } from '../features/workspaces/${page}/panels/${name}';`);
    console.log(`${page} -> ${name}: ${keys.length} props`);
  }
  let source = file.text;
  for (const edit of edits.sort((a,b)=>b.start-a.start)) source = source.slice(0,edit.start)+edit.text+source.slice(edit.end);
  fs.writeFileSync(file.fileName,newImports.join('\n')+'\n'+source);
}
