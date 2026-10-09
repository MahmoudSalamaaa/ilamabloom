import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {createRequire} from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url),cache=new Map();
export function loadTypeScript(name){
 const path=resolve(name.endsWith('.ts')?name:name+'.ts');if(cache.has(path))return cache.get(path);
 const module={exports:{}};cache.set(path,module.exports);
 const source=ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
 new Function('require','module','exports',source)(id=>id.startsWith('.')?loadTypeScript(resolve(dirname(path),id)):require(id),module,module.exports);
 cache.set(path,module.exports);return module.exports;
}
