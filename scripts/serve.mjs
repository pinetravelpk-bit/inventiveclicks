import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=resolve('out');
const port=Number(process.env.PORT||3000);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.ico':'image/x-icon','.woff2':'font/woff2'};
try { await stat(resolve(root,'index.html')); } catch { console.error('Build the website first: npm run build'); process.exit(1); }
createServer(async(req,res)=>{
  try {
    if(!['GET','HEAD'].includes(req.method||'')){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let path=resolve(root,'.'+pathname);
    if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);res.end();return;}
    try{const info=await stat(path);if(info.isDirectory())path=await stat(resolve(path,'index.html')).then(()=>resolve(path,'index.html'),()=>path.replace(/[\\/]+$/,'')+'.html');}
    catch{if(!extname(path))path+='.html';}
    const body=await readFile(path);
    res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD'?undefined:body);
  }catch {res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(resolve(root,'404.html')).catch(()=>Buffer.from('Not found')));}
}).listen(port,'0.0.0.0',()=>console.log(`Inventive Clicks: http://localhost:${port}`));
