import { spawn } from 'node:child_process';
const args=process.argv.slice(2);const normalized=[];
for(let i=0;i<args.length;i++){if(args[i]==='--strictPort')continue;normalized.push(args[i]==='--host'?'--hostname':args[i]);}
if(!normalized.includes('--port')) normalized.push('--port','3000');
if(!normalized.includes('--hostname')) normalized.push('--hostname','0.0.0.0');
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev',...normalized],{stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));child.on('exit',code=>process.exit(code??0));
