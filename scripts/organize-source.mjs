import ts from 'typescript';
import fs from 'node:fs';
const config = ts.readConfigFile('tsconfig.app.json', ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd());
const service = ts.createLanguageService({
  ...ts.sys,
  getCompilationSettings: () => parsed.options,
  getScriptFileNames: () => parsed.fileNames,
  getScriptVersion: () => '0',
  getScriptSnapshot: file => { const text = ts.sys.readFile(file); return text === undefined ? undefined : ts.ScriptSnapshot.fromString(text); },
  getCurrentDirectory: () => process.cwd(),
  getDefaultLibFileName: ts.getDefaultLibFilePath,
});
for (const file of parsed.fileNames.filter(f => /\/panels\/|src\/pages\/|\/hooks\/use.*Workspace/.test(f))) {
  const edits = service.organizeImports({type:'file',fileName:file}, {}, {});
  for (const edit of edits) {
    let text = fs.readFileSync(edit.fileName,'utf8');
    for (const change of [...edit.textChanges].sort((a,b)=>b.span.start-a.span.start)) text = text.slice(0,change.span.start)+change.newText+text.slice(change.span.start+change.span.length);
    fs.writeFileSync(edit.fileName,text);
  }
}
