import ts from 'typescript';
import fs from 'node:fs';
const files=fs.readdirSync('src/pages').filter(f=>f.endsWith('.tsx')).map(f=>'src/pages/'+f);
for (const workspace of ['PreOpDetails','PostOpDetails','Recovery','ReceptionDetails']) {
  const dir=`src/features/workspaces/${workspace}/panels`;
  files.push(...fs.readdirSync(dir).filter(f=>f.endsWith('.tsx')).map(f=>dir+'/'+f));
}
for (const file of files) {
  let source=fs.readFileSync(file,'utf8');
  const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const edits=[];
  function visit(node) {
    if (ts.isJsxOpeningElement(node)) {
      const attrs=node.attributes.properties;
      const text=node.getText(ast);
      if (attrs.some(a=>ts.isJsxAttribute(a)&&a.name.text==='ref'&&a.initializer?.getText(ast)==='{rowsContainerRef}')) edits.push([node.tagName.end,' data-table-body="true"']);
      const cls=attrs.find(a=>ts.isJsxAttribute(a)&&a.name.text==='className')?.initializer?.getText(ast)??'';
      if (cls.includes('flex')&&cls.includes('items-center')&&cls.includes('justify-between')&&cls.includes('border-b')) edits.push([node.tagName.end,' data-page-toolbar="true"']);
      if (ts.isJsxElement(node.parent) && ts.isParenthesizedExpression(node.parent.parent)&&ts.isReturnStatement(node.parent.parent.parent) && ts.isBlock(node.parent.parent.parent.parent) && ts.isFunctionDeclaration(node.parent.parent.parent.parent.parent)) {
        if (file.startsWith('src/pages/')) edits.push([node.tagName.end,` data-workspace-page="${file.split('/').at(-1).replace('.tsx','')}"`]);
        else {
          const names={AnesthesiaPanel:'anesthesia',PreOpHistoryPanel:'history',ReceptionAdmissionForm:'admission'};
          const name=file.split('/').at(-1).replace('.tsx','');
          if (!['PreOpWorkflowTabs','RecoveryQueue'].includes(name)&&/^[a-z]/.test(node.tagName.getText(ast))) edits.push([node.tagName.end,` data-workspace-panel="${names[name]??name}"`]);
        }
      }
    }
    ts.forEachChild(node,visit);
  }
  visit(ast);
  for (const [position,text] of edits.sort((a,b)=>b[0]-a[0])) source=source.slice(0,position)+text+source.slice(position);
  fs.writeFileSync(file,source);
}

function replace(file,from,to) { let text=fs.readFileSync(file,'utf8');if(!text.includes(from))throw Error(file+' missing '+from);fs.writeFileSync(file,text.replace(from,to)); }
replace('src/pages/PreOpDetails.tsx','className={`grid w-full','className={`preop-workspace grid w-full');
replace('src/pages/PreOpDetails.tsx','className={`col-start-2 row-start-2','className={`workspace-actions col-start-2 row-start-2');
replace('src/pages/PreOpDetails.tsx','grid-rows-[minmax(0,1fr)_44px]','grid-rows-[minmax(0,1fr)_auto]');
replace('src/features/workspaces/PreOpDetails/panels/PreOpWorkflowTabs.tsx','className="row-span-2','className="preop-tabs row-span-2');
replace('src/pages/PostOpDetails.tsx','className="grid h-full min-h-0 grid-rows-[66px_minmax(0,1fr)_58px]','className="postop-workspace grid h-full min-h-0 grid-rows-[66px_minmax(0,1fr)_58px]');
replace('src/pages/PostOpDetails.tsx','className="grid min-h-0 grid-cols-4 gap-2','className="postop-cards grid min-h-0 grid-cols-4 gap-2');
replace('src/pages/PostOpDetails.tsx','className="grid h-[58px]','className="workspace-actions grid h-[58px]');
replace('src/features/workspaces/PostOpDetails/components/WorkspaceCard.tsx','className="min-h-0 flex-1 p-2"','className="postop-card-body min-h-0 flex-1 p-2"');

// All hooks must run before the missing-case return.
const surgery='src/pages/SurgeryDetails.tsx';
let source=fs.readFileSync(surgery,'utf8');
const start=source.indexOf('  const filteredEquipment = useMemo');
const end=source.indexOf('  const equipmentReconciled',start);
const block=source.slice(start,end);
source=source.slice(0,start)+source.slice(end);
const guard=source.indexOf('  if (!surgery)');
source=source.slice(0,guard)+block+source.slice(guard);
fs.writeFileSync(surgery,source);
