// Safe HTTP fetching for the website audit: only public hosts, manual redirects
// (each hop re-checked), timeouts and a response size cap.
import {promises as dns} from 'node:dns';
import {isIP} from 'node:net';

const PRIVATE=[/^10\./,/^127\./,/^0\./,/^169\.254\./,/^172\.(1[6-9]|2\d|3[01])\./,/^192\.168\./,/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,/^::1$/,/^::$/,/^f[cd]/i,/^fe80/i,/^::ffff:(10|127|192\.168|169\.254|0)\./i];
const hostCache=new Map<string,boolean>();
export const UA='Mozilla/5.0 (compatible; InventiveClicksAudit/1.0; +https://inventiveclicks.com/tools/website-audit)';

export async function isPublicHost(host:string){
  if(hostCache.has(host)) return hostCache.get(host)!;
  let ok=false;
  if(isIP(host)) ok=!PRIVATE.some(re=>re.test(host));
  else if(/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host) && !/\.(local|internal|localhost)$/i.test(host)){
    try{const a=await dns.lookup(host,{all:true});ok=a.length>0&&a.every(x=>!PRIVATE.some(re=>re.test(x.address)))}catch{ok=false}
  }
  hostCache.set(host,ok); return ok;
}

export type Hop={url:string;status:number};
export type FetchResult={ok:boolean;status:number;url:string;chain:Hop[];headers:Headers|null;body:string;bytes:number;ms:number;ttfb?:number;error?:string};

export async function safeFetch(input:string,{method='GET',timeout=12000,maxBytes=3_000_000,readBody=true,maxRedirects=8}:{method?:string;timeout?:number;maxBytes?:number;readBody?:boolean;maxRedirects?:number}={}):Promise<FetchResult>{
  let url=input; const chain:Hop[]=[]; const start=Date.now();
  for(let hop=0;hop<=maxRedirects;hop++){
    let u:URL; try{u=new URL(url)}catch{return {ok:false,status:0,url,chain,headers:null,body:'',bytes:0,ms:0,error:'Invalid URL'}}
    if(!/^https?:$/.test(u.protocol)) return {ok:false,status:0,url,chain,headers:null,body:'',bytes:0,ms:0,error:'Unsupported protocol'};
    if(!(await isPublicHost(u.hostname))) return {ok:false,status:0,url,chain,headers:null,body:'',bytes:0,ms:Date.now()-start,error:'Host does not resolve to a public server'};
    let res:Response;
    const t0=Date.now();
    try{res=await fetch(url,{method,redirect:'manual',headers:{'User-Agent':UA,Accept:'text/html,application/xhtml+xml,*/*;q=0.8','Accept-Encoding':'gzip, deflate, br'},signal:AbortSignal.timeout(timeout)})}
    catch(e){return {ok:false,status:0,url,chain,headers:null,body:'',bytes:0,ms:Date.now()-start,error:(e as Error).name==='TimeoutError'?'Timed out':'Connection failed (DNS, TLS or network error)'}}
    const ttfb=Date.now()-t0;
    const loc=res.headers.get('location');
    if(res.status>=300&&res.status<400&&loc){chain.push({url,status:res.status});res.body?.cancel().catch(()=>{});url=new URL(loc,url).toString();continue}
    let body='',bytes=0;
    if(readBody&&method!=='HEAD'&&res.body){
      const reader=res.body.getReader();const dec=new TextDecoder();
      try{while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes<=maxBytes)body+=dec.decode(value,{stream:true});else{reader.cancel().catch(()=>{});break}}}catch{/* partial body is fine */}
    }else{res.body?.cancel().catch(()=>{});bytes=Number(res.headers.get('content-length'))||0}
    return {ok:res.status<400,status:res.status,url,chain,headers:res.headers,body,bytes,ms:Date.now()-t0,ttfb,error:undefined};
  }
  return {ok:false,status:0,url,chain,headers:null,body:'',bytes:0,ms:Date.now()-start,error:'Too many redirects'};
}

export async function mapLimit<T,R>(items:T[],n:number,fn:(t:T,i:number)=>Promise<R>){
  const out:R[]=new Array(items.length);let i=0;
  await Promise.all(Array.from({length:Math.min(n,items.length)},async()=>{while(i<items.length){const k=i++;out[k]=await fn(items[k],k)}}));
  return out;
}

export function normalizeInput(raw:string){
  let s=raw.trim();if(!s)return null;
  if(!/^https?:\/\//i.test(s))s='https://'+s;
  try{const u=new URL(s);u.hash='';if(!/\./.test(u.hostname)||isIP(u.hostname)&&PRIVATE.some(re=>re.test(u.hostname)))return null;return u.toString()}catch{return null}
}
