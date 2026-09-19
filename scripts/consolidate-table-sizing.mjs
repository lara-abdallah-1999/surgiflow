import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
const files = ['Accounting','WaitingList','Surgery','PreOp','PostOp'].map(n=>`src/pages/${n}.tsx`);
files.push('src/features/workspaces/Recovery/hooks/useRecoveryWorkspace.ts');
for (const file of files) {
  let source = fs.readFileSync(file,'utf8');
  if (source.includes("import { useTablePageSize }")) continue;
  const ast = ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,file.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
  const edits=[];
  function visit(node) {
    if (ts.isExpressionStatement(node) && node.getText(ast).startsWith('useEffect(') && node.getText(ast).includes('new ResizeObserver')) edits.push([node.getStart(),node.end,'']);
    if (ts.isVariableStatement(node) && /const\s*\[pageSize,\s*setPageSize\]/.test(node.getText(ast))) edits.push([node.getStart(),node.end,'']);
    if (ts.isVariableStatement(node) && /const\s+rowsContainerRef\s*=/.test(node.getText(ast))) edits.push([node.end,node.end,'\n  const pageSize = useTablePageSize(rowsContainerRef, ROW_HEIGHT);']);
    ts.forEachChild(node,visit);
  }
  visit(ast);
  for (const [start,end,value] of edits.sort((a,b)=>b[0]-a[0])) source=source.slice(0,start)+value+source.slice(end);
  source=source.replace(/\bMIN_PAGE_SIZE,\s*/g,'');
  let relative=path.relative(path.dirname(file),'src/hooks/useTablePageSize').replaceAll('\\','/');
  fs.writeFileSync(file,`import { useTablePageSize } from '${relative}';\n`+source);
}

for (const name of ['SurgeryReception','Patients']) {
  const file=`src/pages/${name}.tsx`;
  let source=fs.readFileSync(file,'utf8').replace(/import \{([^}]+)\} from ([^;]+\/config[^;]+);/, (whole, names, from) => `import {${names.replace(/\bPAGE_SIZE,\s*/g,'').replace(/,\s*PAGE_SIZE\b/g,'')}} from ${from};`);
  source=source.replaceAll('PAGE_SIZE','pageSize');
  const start=source.indexOf('{',source.indexOf(`export default function ${name}()`))+1;
  source=source.slice(0,start)+'\n  const rowsContainerRef = useRef<HTMLDivElement | null>(null);\n  const pageSize = useTablePageSize(rowsContainerRef, 52);\n'+source.slice(start);
  source=source.replace('[filteredPatients, page]','[filteredPatients, page, pageSize]').replace('[sortedPatients, page]','[sortedPatients, page, pageSize]');
  const marker=name==='Patients'?'<div className="min-h-0 flex-1 overflow-hidden">':'<div className="min-h-0 flex-1 divide-y divide-slate-100 bg-white">';
  if (!source.includes(marker)) throw Error(`Missing table ${name}`);
  source=source.replace(marker,marker.replace('<div ','<div ref={rowsContainerRef} '));
  fs.writeFileSync(file,`import { useTablePageSize } from '../hooks/useTablePageSize';\n`+source);
}
