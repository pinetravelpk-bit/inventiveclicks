import {analyse,discover,limits,providers,rootDomain,takeQuota} from '../../../../lib/prospects';
export const dynamic='force-dynamic';
export const runtime='nodejs';

const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});

export function GET(){return json({providers:providers(),limits:{domainsPerCheck:limits.domainsPerCheck,checksPerDay:limits.checksPerIpPerDay}})}

export async function POST(req:Request){
  let body:{mode?:string;keyword?:string;location?:string;domains?:string};
  try{body=await req.json()}catch{return json({error:'Invalid request.'},400)}
  const p=providers();
  // Behind Cloudflare the visitor IP arrives in CF-Connecting-IP; nginx adds X-Real-IP otherwise.
  const ip=req.headers.get('cf-connecting-ip')||req.headers.get('x-real-ip')||'unknown';

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
