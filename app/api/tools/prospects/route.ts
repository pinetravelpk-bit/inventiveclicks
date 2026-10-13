import {analyse,discover,limits,providers,rootDomain,takeQuota,type ProspectMeta} from '../../../../lib/prospects';
import {opportunities,categories} from '../../../../lib/link-opportunities';
export const dynamic='force-dynamic';
export const runtime='nodejs';

const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});

export function GET(){return json({providers:providers(),limits:{domainsPerCheck:limits.domainsPerCheck,checksPerDay:limits.checksPerIpPerDay}})}

export async function POST(req:Request){
  let body:{mode?:string;keyword?:string;location?:string;domains?:string;niche?:string;categories?:string[]};
  try{body=await req.json()}catch{return json({error:'Invalid request.'},400)}
  const p=providers();
  // Behind Cloudflare the visitor IP arrives in CF-Connecting-IP; nginx adds X-Real-IP otherwise.
  const ip=req.headers.get('cf-connecting-ip')||req.headers.get('x-real-ip')||'unknown';

  // Built-in verified list: no search key needed and no per-visitor quota (results are cached).
  if(body.mode==='curated'){
    const cats=new Set((body.categories||[]).filter(c=>categories.some(x=>x.id===c)));
    const picked=opportunities.filter(o=>(!cats.size||cats.has(o.category))&&(!body.niche||body.niche==='all'||o.niches==='all'||o.niches.includes(body.niche as never)));
    const meta=new Map<string,ProspectMeta>();
    for(const o of picked){const d=rootDomain(o.url);if(d&&!meta.has(d))meta.set(d,{name:o.name,category:o.category,note:o.note,region:o.region,guestPostUrl:o.url,foundVia:'Verified list'});}
    if(!meta.size) return json({results:[],warnings:['No websites match this niche and type. Try All niches.']});
    return json(await analyse([...meta.keys()],meta,200));
  }

  if(body.mode==='keyword'){
    const keyword=(body.keyword||'').trim();
    if(keyword.length<2||keyword.length>80) return json({error:'Enter a niche or keyword (2 to 80 characters).'},400);
    if(!p.search) return json({error:'Keyword discovery is not switched on yet. Paste a list of domains instead.'},503);
    if(!(await takeQuota(ip))) return json({error:`Daily limit reached (${limits.checksPerIpPerDay} checks per day). Please try again tomorrow.`},429);
    try{
      const found=await discover(keyword,body.location||'');
      if(!found.size) return json({results:[],warnings:['No matching websites were found. Try a broader keyword.']});
      return json(await analyse([...found.keys()],found));
    }catch(e){return json({error:e instanceof Error?e.message:'Search failed.'},502)}
  }

  if(body.mode==='domains'){
    const raw=(body.domains||'').split(/[\s,;]+/).filter(Boolean).slice(0,200);
    const domains=[...new Set(raw.map(rootDomain).filter((d):d is string=>Boolean(d)))];
    if(!domains.length) return json({error:'Paste at least one valid domain, such as example.com.'},400);
    if(domains.length>limits.domainsPerCheck) return json({error:`Check up to ${limits.domainsPerCheck} domains at a time.`},400);
    if(!(await takeQuota(ip))) return json({error:`Daily limit reached (${limits.checksPerIpPerDay} checks per day). Please try again tomorrow.`},429);
    return json(await analyse(domains));
  }
  return json({error:'Unknown mode.'},400);
}
