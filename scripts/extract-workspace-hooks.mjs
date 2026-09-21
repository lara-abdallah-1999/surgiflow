import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
const config = ts.readConfigFile('tsconfig.app.json', ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd());
const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();
for (const page of ['PreOp','PostOp','Cashier','WaitingList','SurgeryReception','Surgery','Planning','Planning2','Dashboard','Patients']) {
  const file = program.getSourceFile(`src/pages/${page}.tsx`);
  const fn = file.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text===page);
  const firstView = fn.body.statements.find(n => ts.isReturnStatement(n) || ts.isIfStatement(n) && /return\s*\(\s*</.test(n.getText(file)));
  const start = firstView.getStart(file);
  const props = new Set();
  function collect(node) {
    if (ts.isIdentifier(node) && !(ts.isPropertyAccessExpression(node.parent) && node.parent.name === node) && !(ts.isJsxAttribute(node.parent) && node.parent.name === node)) {
      const symbol = checker.getSymbolAtLocation(node);
      const declarations = symbol?.declarations;
      if (declarations?.some(d=>d.getSourceFile()===file && d.getStart()>fn.body.getStart() && d.end<start && (ts.isVariableDeclaration(d)||ts.isBindingElement(d)||ts.isFunctionDeclaration(d)))) props.add(node.text);
    }
    ts.forEachChild(node,collect);
  }
  fn.body.statements.filter(n=>n.getStart()>=start).forEach(collect);
  const name = `use${page}Workspace`;
  const dir = path.resolve(`src/features/workspaces/${page}/hooks`);
  fs.mkdirSync(dir,{recursive:true});
  const imports = file.statements.filter(ts.isImportDeclaration).map(n=>{
    let specifier = n.moduleSpecifier.text;
    if (specifier.startsWith('.')) { specifier=path.relative(dir,path.resolve(path.dirname(file.fileName),specifier)).replaceAll('\\','/'); if(!specifier.startsWith('.'))specifier='./'+specifier; }
    return n.getText(file).replace(n.moduleSpecifier.getText(file),JSON.stringify(specifier));
  }).join('\n');
  fs.writeFileSync(path.join(dir,`${name}.tsx`),`${imports}\n\nexport function ${name}() {${file.text.slice(fn.body.getStart()+1,start)}\n  return { ${[...props].join(', ')} };\n}\n`);
  const updated = file.text.slice(0,fn.body.getStart()+1)+`\n  const { ${[...props].join(', ')} } = ${name}();\n\n`+file.text.slice(start);
  fs.writeFileSync(file.fileName,`import { ${name} } from '../features/workspaces/${page}/hooks/${name}';\n`+updated);
  console.log(page,props.size);
}
