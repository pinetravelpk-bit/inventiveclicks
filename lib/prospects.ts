// Server-only engine for the Backlink Prospect Finder tool.
// Discovery: Brave Search API. Metrics: Moz Links API (DA, PA, Spam Score) and Open PageRank.
// Verification: live HTTPS fetch of each homepage. Results and API usage are cached on disk.
import {promises as dns} from 'node:dns';
import {isIP} from 'node:net';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {trancoRanks} from './tranco';

export type Verification = {status:'verified'|'protected'|'redirects'|'unreachable'|'parked'|'error'; httpStatus?:number; https:boolean; finalUrl?:string; title?:string; note?:string};
export type ProspectMeta = {guestPostUrl?:string; foundVia?:string; name?:string; category?:string; note?:string; region?:string};
export type Prospect = ProspectMeta & {
  domain:string; trancoRank:number|null;
  da:number|null; pa:number|null; spamScore:number|null; linkingDomains:number|null;
  openPageRank:number|null; opr_referringDomains:number|null;
  verification:Verification;
  guestPostUrl?:string; foundVia?:string;
};

const env = (k:string) => (process.env[k] || '').trim();
const DATA_DIR = env('DATA_DIR') || path.join(process.cwd(), '.data');
const CACHE_FILE = path.join(DATA_DIR, 'prospects-cache.json');
const CACHE_DAYS = 30;
export const limits = {
  domainsPerCheck: 50,
  checksPerIpPerDay: Number(env('TOOL_CHECKS_PER_IP_PER_DAY')) || 10,
  mozRowsPerMonth: Number(env('MOZ_MONTHLY_ROW_LIMIT')) || 2000,
  braveQueriesPerMonth: Number(env('BRAVE_MONTHLY_QUERY_LIMIT')) || 900,
};
export const providers = () => ({
  moz: Boolean(env('MOZ_TOKEN') || (env('MOZ_ACCESS_ID') && env('MOZ_SECRET_KEY'))),
  openPageRank: Boolean(env('OPEN_PAGERANK_KEY')),
  search: Boolean(env('BRAVE_SEARCH_KEY')),
});

// ---------- persistent cache + usage counters ----------
type CacheEntry = {at:number; moz?:{da:number|null;pa:number|null;spam:number|null;lrd:number|null}; opr?:{rank:number|null;rd:number|null}; verification?:Verification};
type Store = {domains:Record<string,CacheEntry>; usage:{month:string; mozRows:number; braveQueries:number}; ips:Record<string,{day:string;count:number}>};
let store:Store|null = null;
let saveTimer:NodeJS.Timeout|null = null;
const month = () => new Date().toISOString().slice(0,7);
const today = () => new Date().toISOString().slice(0,10);

async function load():Promise<Store>{
  if(store) return store;
  try{ store = JSON.parse(await readFile(CACHE_FILE,'utf8')); }catch{ store = {domains:{},usage:{month:month(),mozRows:0,braveQueries:0},ips:{}}; }
  if(store!.usage.month!==month()) store!.usage = {month:month(),mozRows:0,braveQueries:0};
  return store!;
}
function save(){
  if(saveTimer) return;
  saveTimer = setTimeout(async()=>{saveTimer=null; if(!store) return;
    const cutoff = Date.now()-CACHE_DAYS*864e5;
    for(const [d,e] of Object.entries(store.domains)) if(e.at<cutoff) delete store.domains[d];
    for(const [ip,v] of Object.entries(store.ips)) if(v.day!==today()) delete store.ips[ip];
    await mkdir(DATA_DIR,{recursive:true}); await writeFile(CACHE_FILE,JSON.stringify(store));
  },2000);
}
const fresh = (e?:CacheEntry) => Boolean(e && Date.now()-e.at < CACHE_DAYS*864e5);

export async function takeQuota(ip:string){
  const s = await load(); const rec = s.ips[ip];
  const used = rec && rec.day===today() ? rec.count : 0;
  if(used >= limits.checksPerIpPerDay) return false;
  s.ips[ip] = {day:today(),count:used+1}; save(); return true;
}

// ---------- domain parsing ----------
const MULTI_TLD = /\.(co|com|org|net|gov|edu|ac|gob|ltd|plc|nic)\.[a-z]{2}$/i;
export function rootDomain(input:string):string|null{
  let host = input.trim().toLowerCase();
  if(!host) return null;
  try{ host = new URL(/^[a-z]+:\/\//.test(host)?host:'http://'+host).hostname; }catch{ return null; }
  host = host.replace(/^www\./,'').replace(/\.$/,'');
  if(!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host) || isIP(host)) return null;
  const parts = host.split('.');
  return parts.slice(MULTI_TLD.test(host) ? -3 : -2).join('.');
}

// Large platforms are not realistic outreach targets; leave them out of discovery results.
const PLATFORMS = new Set(['youtube.com','facebook.com','instagram.com','twitter.com','x.com','linkedin.com','pinterest.com','reddit.com','quora.com','wikipedia.org','amazon.com','tiktok.com','google.com','apple.com','microsoft.com','github.com','medium.com','yelp.com','tripadvisor.com','indeed.com','glassdoor.com','fiverr.com','upwork.com','wordpress.org','blogspot.com','wordpress.com','tumblr.com','substack.com','play.google.com','apps.apple.com','bing.com','yahoo.com','duckduckgo.com','britannica.com','forbes.com','nytimes.com','bbc.com','bbc.co.uk','cnn.com']);

// ---------- discovery (Brave Search) ----------
export async function discover(keyword:string, location:string){
  const s = await load();
  const k = keyword.replace(/["]/g,'').trim().slice(0,80);
  const loc = location.replace(/["]/g,'').trim().slice(0,40);
  const queries = [`${k} "write for us"`, `${k} "guest post" OR "submit a guest post"`, `${k} blog ${loc}`.trim()];
  if(loc) queries[0] += ` ${loc}`;
  if(s.usage.braveQueries + queries.length > limits.braveQueriesPerMonth) throw new Error('The monthly search allowance has been used. Try the domain checker, or come back next month.');
  const found = new Map<string,{guestPostUrl?:string; foundVia:string}>();
  for(const [i,q] of queries.entries()){
    const res = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}&count=20&safesearch=strict`,{headers:{Accept:'application/json','X-Subscription-Token':env('BRAVE_SEARCH_KEY')},signal:AbortSignal.timeout(12000)});
    s.usage.braveQueries++; save();
    if(!res.ok) throw new Error(`Search provider error (${res.status}).`);
    const data = await res.json() as {web?:{results?:{url:string}[]}};
    for(const r of data.web?.results || []){
      const d = rootDomain(r.url); if(!d || PLATFORMS.has(d)) continue;
      const prev = found.get(d);
      const guest = i<2 && /write|guest|contribut|submit/i.test(r.url) ? r.url : undefined;
      if(!prev) found.set(d,{guestPostUrl:guest,foundVia:i<2?'Guest post search':'Niche search'});
      else if(guest && !prev.guestPostUrl) prev.guestPostUrl = guest;
    }
  }
  return found;
}

// ---------- metrics ----------
async function mozMetrics(domains:string[]){
  const s = await load(); const out:Record<string,NonNullable<CacheEntry['moz']>> = {};
  const headers:Record<string,string> = {'Content-Type':'application/json'};
  if(env('MOZ_TOKEN')) headers['x-moz-token'] = env('MOZ_TOKEN');
  else headers.Authorization = 'Basic '+Buffer.from(`${env('MOZ_ACCESS_ID')}:${env('MOZ_SECRET_KEY')}`).toString('base64');
  for(let i=0;i<domains.length;i+=50){
    const batch = domains.slice(i,i+50);
    if(s.usage.mozRows + batch.length > limits.mozRowsPerMonth) break;
    const res = await fetch('https://lsapi.seomoz.com/v2/url_metrics',{method:'POST',headers,body:JSON.stringify({targets:batch}),signal:AbortSignal.timeout(20000)});
    s.usage.mozRows += batch.length; save();
    if(!res.ok) throw new Error(`Moz API error (${res.status}).`);
    const data = await res.json() as {results?:Record<string,unknown>[]};
    (data.results||[]).forEach((r,j)=>{
      const num = (k:string)=> typeof r[k]==='number' ? r[k] as number : null;
      const spam = num('spam_score');
      out[batch[j]] = {da:num('domain_authority'),pa:num('page_authority'),spam:spam!=null&&spam>=0?spam:null,lrd:num('root_domains_to_root_domain')};
    });
  }
  return out;
}

async function openPageRank(domains:string[]){
  const out:Record<string,NonNullable<CacheEntry['opr']>> = {};
  for(let i=0;i<domains.length;i+=100){
    const res = await fetch('https://openpagerank.keywordseverywhere.com/v1/domains/bulk',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+env('OPEN_PAGERANK_KEY')},body:JSON.stringify({domains:domains.slice(i,i+100),include_history:false}),signal:AbortSignal.timeout(20000)});
    if(!res.ok) throw new Error(`Open PageRank error (${res.status}).`);
    const data = await res.json() as {results?:{domain:string;found:boolean;open_page_rank:number|null;referring_domains?:number|null}[]};
    for(const r of data.results||[]) out[r.domain.toLowerCase()] = {rank:r.found?r.open_page_rank:null,rd:r.referring_domains??null};
  }
  return out;
}

// ---------- live verification ----------
const PRIVATE = [/^10\./,/^127\./,/^0\./,/^169\.254\./,/^172\.(1[6-9]|2\d|3[01])\./,/^192\.168\./,/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,/^::1$/,/^f[cd]/i,/^fe80/i,/^::ffff:(10|127|192\.168|169\.254)\./i];
async function isPublicHost(host:string){
  try{ const addrs = await dns.lookup(host,{all:true}); return addrs.length>0 && addrs.every(a=>!PRIVATE.some(re=>re.test(a.address))); }catch{ return false; }
}
const decode=(t:string)=>t.replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g,(_,e:string)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'",apos:"'",nbsp:' '} as Record<string,string>)[e]).replace(/&#(\d+);/g,(_,n:string)=>String.fromCharCode(Number(n)));
const PARKED = /domain (is )?for sale|buy this domain|parked (free|domain)|this domain may be for sale|sedoparking|domain has expired|hugedomains/i;

export async function verify(domain:string, start?:string):Promise<Verification>{
  let url = start || `https://${domain}/`;
  for(let hop=0; hop<6; hop++){
    const host = new URL(url).hostname;
    if(!(await isPublicHost(host))) return {status:'unreachable',https:false,note:'Domain does not resolve to a public server'};
    let res:Response;
    try{ res = await fetch(url,{redirect:'manual',headers:{'User-Agent':'InventiveClicksProspectFinder/1.0 (+https://inventiveclicks.com/tools)'},signal:AbortSignal.timeout(9000)}); }
    catch{ return hop===0 ? {status:'unreachable',https:false,note:'No valid HTTPS response'} : {status:'error',https:url.startsWith('https:'),finalUrl:url,note:'Redirect target did not respond'}; }
    if(res.status>=300 && res.status<400 && res.headers.get('location')){ url = new URL(res.headers.get('location')!,url).toString(); continue; }
    const https = url.startsWith('https:');
    const finalRoot = rootDomain(url);
    // Bot protection (Cloudflare, AWS WAF, etc.) answers automated checks with a challenge: the site is up.
    if([202,403,429,503].includes(res.status) && (res.headers.get('cf-mitigated') || res.headers.get('x-amzn-waf-action') || /cloudflare|akamai|varnish|awselb|ddos-guard|sucuri/i.test(res.headers.get('server')||'')))
      return {status:'protected',https:url.startsWith('https:'),httpStatus:res.status,finalUrl:url,note:'Live; the site blocks automated checks, so open it in your browser'};
    if([403,429].includes(res.status)){ const body=(await res.text().catch(()=>'')).slice(0,30000); if(/captcha|challenge|just a moment|access denied|are you a robot|verify you are human|bot/i.test(body)) return {status:'protected',https:url.startsWith('https:'),httpStatus:res.status,finalUrl:url,note:'Live; the site blocks automated checks, so open it in your browser'}; }
    if(res.status>=400) return {status:'error',https,httpStatus:res.status,finalUrl:url,note:`Homepage returned HTTP ${res.status}`};
    const html = (await res.text()).slice(0,200000);
    const rawTitle = html.match(/<title[^>]*>([^<]{0,160})/i)?.[1]?.replace(/\s+/g,' ').trim();
    const title = rawTitle && decode(rawTitle);
    if(PARKED.test(html.slice(0,60000))) return {status:'parked',https,httpStatus:res.status,finalUrl:url,title,note:'Looks like a parked or for-sale domain'};
    if(finalRoot && finalRoot!==domain) return {status:'redirects',https,httpStatus:res.status,finalUrl:url,title,note:`Redirects to ${finalRoot}`};
    return {status:'verified',https,httpStatus:res.status,finalUrl:url,title};
  }
  return {status:'error',https:false,note:'Too many redirects'};
}

async function mapLimit<T,R>(items:T[],n:number,fn:(t:T)=>Promise<R>){
  const out:R[] = new Array(items.length); let i=0;
  await Promise.all(Array.from({length:Math.min(n,items.length)},async()=>{while(i<items.length){const k=i++; out[k]=await fn(items[k]);}}));
  return out;
}

// ---------- main entry ----------
export async function analyse(domains:string[], meta:Map<string,ProspectMeta> = new Map(), max = limits.domainsPerCheck){
  const s = await load(); const p = providers(); const warnings:string[] = [];
  const list = [...new Set(domains)].slice(0,max);
  const stale = list.filter(d=>!fresh(s.domains[d]));
  for(const d of stale) s.domains[d] = {at:Date.now()};
  const needMoz = p.moz ? list.filter(d=>!s.domains[d].moz) : [];
  const needOpr = p.openPageRank ? list.filter(d=>!s.domains[d].opr) : [];
  type MozMap=Awaited<ReturnType<typeof mozMetrics>>; type OprMap=Awaited<ReturnType<typeof openPageRank>>;
  const [moz,opr,ver,tranco] = await Promise.all([
    needMoz.length ? mozMetrics(needMoz).catch((e):MozMap=>{warnings.push(String(e.message||e)); return {};}) : Promise.resolve<MozMap>({}),
    needOpr.length ? openPageRank(needOpr).catch((e):OprMap=>{warnings.push(String(e.message||e)); return {};}) : Promise.resolve<OprMap>({}),
    mapLimit(stale,8,d=>verify(d,meta.get(d)?.guestPostUrl)),
    trancoRanks(list).catch(()=>({} as Record<string,number|null>)),
  ]);
  stale.forEach((d,i)=>{ s.domains[d].verification = ver[i]; });
  for(const [d,m] of Object.entries(moz)) if(s.domains[d]) s.domains[d].moz = m;
  for(const [d,o] of Object.entries(opr)) if(s.domains[d]) s.domains[d].opr = o;
  if(p.moz && needMoz.some(d=>!s.domains[d].moz) && !warnings.length) warnings.push('The monthly Moz allowance has been reached, so some DA, PA and Spam Score values are unavailable.');
  save();
  const results:Prospect[] = list.map(d=>{const e=s.domains[d]||{at:0};return {
    domain:d, trancoRank:tranco[d]??null, da:e.moz?.da??null, pa:e.moz?.pa??null, spamScore:e.moz?.spam??null, linkingDomains:e.moz?.lrd??null,
    openPageRank:e.opr?.rank??null, opr_referringDomains:e.opr?.rd??null,
    verification:e.verification||{status:'error',https:false,note:'Not checked'}, ...meta.get(d)};});
  return {results,warnings,providers:p};
}
