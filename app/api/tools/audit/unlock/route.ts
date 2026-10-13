import {getReport,saveLead,validateLead} from '../../../../../lib/audit/leads';
export const dynamic='force-dynamic';
export const runtime='nodejs';

const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const tries=new Map<string,{day:string;n:number}>();

export async function POST(req:Request){
  let body:{id?:string;name?:string;email?:string;phone?:string};
  try{body=await req.json()}catch{return json({error:'Invalid request.'},400)}
  const ip=req.headers.get('cf-connecting-ip')||req.headers.get('x-real-ip')||'unknown';
  const day=new Date().toISOString().slice(0,10);const t=tries.get(ip);const n=t&&t.day===day?t.n:0;
  if(n>=40) return json({error:'Too many requests today. Please try again tomorrow.'},429);
  tries.set(ip,{day,n:n+1});

  const report=getReport(String(body.id||''));
  if(!report) return json({error:'This audit has expired. Please run it again.'},410);
  const lead=validateLead(body);
  if('error' in lead) return json({error:lead.error},400);
  await saveLead({at:new Date().toISOString(),...lead,website:report.finalUrl,score:report.score,ip,userAgent:(req.headers.get('user-agent')||'').slice(0,200)});
  return json(report);
}
