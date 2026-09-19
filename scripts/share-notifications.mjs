import ts from 'typescript';
import fs from 'node:fs';
for (const page of ['Accounting','PostOp','PreOp','PreOpDetails','Recovery']) {
  const file=`src/pages/${page}.tsx`;
  let source=fs.readFileSync(file,'utf8');
  const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const edits=[];
  function visit(node) {
    if(ts.isJsxExpression(node)&&node.expression&&ts.isBinaryExpression(node.expression)&&node.expression.left.getText(ast)==='toast'&&node.expression.operatorToken.kind===ts.SyntaxKind.AmpersandAmpersandToken) {
      edits.push([node.getStart(),node.end,'<WorkspaceNotification notice={toast} onClose={() => setToast(null)} />']);
      return;
    }
    ts.forEachChild(node,visit);
  }
  visit(ast);
  for(const[start,end,text] of edits.sort((a,b)=>b[0]-a[0]))source=source.slice(0,start)+text+source.slice(end);
  fs.writeFileSync(file,`import { WorkspaceNotification } from '../components/layout/WorkspaceNotification';\n`+source);
}
