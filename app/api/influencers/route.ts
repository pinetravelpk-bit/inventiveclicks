// Influencer network applications and brand campaign enquiries from /influencers.
import {appendRecord} from '../../../lib/submissions';
import {platforms,niches,followerBands,budgetBands} from '../../../lib/influencers';
export const dynamic='force-dynamic';
export const runtime='nodejs';

const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const tries=new Map<string,{day:string;n:number}>();
const str=(v:unknown,max:number)=>String(v??'').trim().replace(/\s+/g,' ').slice(0,max);
const oneOf=(v:unknown,list:readonly string[])=>list.includes(String(v))?String(v):'';
const emailOk=(e:string)=>/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(e);
const phoneOk=(p:string)=>p.replace(/\D/g,'').length>=7;
const urlOk=(u:string)=>{try{const x=new URL(u);return /^https?:$/.test(x.protocol)&&x.hostname.includes('.')}catch{return false}};

export async function POST(req:Request){
  let b:Record<string,unknown>;
  try{b=await req.json()}catch{return json({error:'Invalid request.'},400)}
  if(b.website)return json({ok:true}); // honeypot field: bots fill it, people never see it
  const ip=req.headers.get('cf-connecting-ip')||req.headers.get('x-real-ip')||'unknown';
  const day=new Date().toISOString().slice(0,10);const t=tries.get(ip);const n=t&&t.day===day?t.n:0;
  if(n>=10)return json({error:'Too many submissions today. Please try again tomorrow.'},429);
  tries.set(ip,{day,n:n+1});

  const name=str(b.name,100),email=str(b.email,254).toLowerCase(),phone=str(b.phone,25).replace(/[^\d+()\s-]/g,'');
  if(name.length<2)return json({error:'Please enter your name.'},400);
  if(!emailOk(email))return json({error:'Please enter a valid email address.'},400);
  if(!phoneOk(phone))return json({error:'Please enter a valid phone or WhatsApp number with country code.'},400);
  const base={at:new Date().toISOString(),name,email,phone,ip};

  if(b.type==='influencer'){
    const rec={...base,type:'influencer',platform:oneOf(b.platform,platforms),profileUrl:str(b.profileUrl,300),followers:oneOf(b.followers,followerBands),niche:oneOf(b.niche,niches),location:str(b.location,100),otherProfiles:str(b.otherProfiles,500),rate:str(b.rate,100),message:str(b.message,1500)};
    if(!rec.platform)return json({error:'Choose your main platform.'},400);
    if(!urlOk(rec.profileUrl))return json({error:'Add a link to your main profile, starting with https://'},400);
    if(!rec.followers)return json({error:'Choose your follower range.'},400);
    if(!rec.niche)return json({error:'Choose your main niche.'},400);
    await appendRecord('influencers.jsonl',rec);return json({ok:true});
  }
  if(b.type==='brand'){
    const rec={...base,type:'brand',company:str(b.company,150),brandWebsite:str(b.brandWebsite,300),budget:oneOf(b.budget,budgetBands),platforms:(Array.isArray(b.platforms)?b.platforms:[]).map(String).filter(p=>platforms.includes(p as never)).slice(0,11),niche:oneOf(b.niche,niches),goal:str(b.goal,1500)};
    if(rec.company.length<2)return json({error:'Please enter your company or brand name.'},400);
    if(rec.goal.length<10)return json({error:'Tell us a little about the campaign you have in mind.'},400);
    await appendRecord('brand-enquiries.jsonl',rec);return json({ok:true});
  }
  return json({error:'Unknown form.'},400);
}
