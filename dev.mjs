import {spawn} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const children=[
  spawn(process.execPath,[path.join(root,'server.js')],{cwd:root,stdio:'inherit',env:process.env}),
  spawn(process.execPath,[path.join(root,'node_modules','vite','bin','vite.js'),'--host','0.0.0.0'],{cwd:root,stdio:'inherit',env:process.env})
];
let shuttingDown=false;
function stop(code=0){if(shuttingDown)return;shuttingDown=true;for(const child of children)if(child.exitCode===null)child.kill('SIGTERM');setTimeout(()=>process.exit(code),300).unref()}
for(const child of children){child.on('error',error=>{console.error(error);stop(1)});child.on('exit',code=>{if(!shuttingDown&&code!==0)stop(code||1)})}
process.on('SIGINT',()=>stop(0));process.on('SIGTERM',()=>stop(0));
