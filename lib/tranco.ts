// Tranco popularity rank (https://tranco-list.eu): a free research ranking of the top 1M sites,
// combining several traffic sources. Downloaded weekly to DATA_DIR and kept in memory.
import {mkdir,readFile,stat,writeFile} from 'node:fs/promises';
import path from 'node:path';

const FILE = path.join(process.env.DATA_DIR || path.join(process.cwd(),'.data'),'tranco.csv');
const MAX_AGE = 7*864e5;
let ranks:Map<string,number>|null = null;
let loading:Promise<Map<string,number>|null>|null = null;
let failedAt = 0;

async function download(){
  const meta = await fetch('https://tranco-list.eu/api/lists/date/latest',{signal:AbortSignal.timeout(15000)}).then(r=>r.json()) as {download?:string};
  if(!meta.download) throw new Error('No Tranco list available');
  const csv = await fetch(meta.download,{signal:AbortSignal.timeout(120000)}).then(r=>{if(!r.ok)throw new Error('Tranco download failed');return r.text()});
  await mkdir(path.dirname(FILE),{recursive:true}); await writeFile(FILE,csv);
  return csv;
}

async function load(){
  let csv:string|null = null;
  try{ const s = await stat(FILE); csv = await readFile(FILE,'utf8'); if(Date.now()-s.mtimeMs>MAX_AGE) download().then(c=>{ranks=parse(c)}).catch(()=>{}); }
  catch{ csv = await download().catch(()=>null); }
  return csv ? parse(csv) : null;
}

function parse(csv:string){
  const m = new Map<string,number>();
  for(const line of csv.split('\n')){ const i=line.indexOf(','); if(i>0) m.set(line.slice(i+1).trim(),Number(line.slice(0,i))); }
  return m;
}

export async function trancoRanks(domains:string[]){
  if(!ranks && Date.now()-failedAt>36e5){ loading ??= load(); ranks = await loading; loading = null; if(!ranks) failedAt = Date.now(); }
  const out:Record<string,number|null> = {};
  for(const d of domains) out[d] = ranks?.get(d) ?? null;
  return out;
}
