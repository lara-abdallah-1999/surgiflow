import { mkdir, readFile, writeFile } from 'node:fs/promises';
import ts from 'typescript';

// Compile the SAME pure rules used by the UI; never maintain a second workflow engine.
await mkdir(new URL('../server/.generated/', import.meta.url), { recursive: true });
for (const name of ['utils', 'analyzeSurgery', 'language', 'patientLookup']) {
  const source = await readFile(new URL(`../src/features/copilot/${name}.ts`, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
    .replace(/from "\.\/(utils|language)"/g, 'from "./$1.mjs"');
  await writeFile(new URL(`../server/.generated/${name}.mjs`, import.meta.url), code);
}
