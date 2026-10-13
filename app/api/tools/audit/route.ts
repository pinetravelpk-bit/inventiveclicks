import {runAudit,type Report} from '../../../../lib/audit';
import {normalizeInput} from '../../../../lib/audit/net';
import {preview,storeReport} from '../../../../lib/audit/leads';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export const maxDuration=90;

// Returns a preview only; the full report is released by /api/tools/audit/unlock.
const DAILY=Number(process.env.AUDITS_PER_IP_PER_DAY)||10;
const ips=new Map<string,{day:string;n:number}>();
const cache=new Map<string,{at:number;report:Report}>();
const running=new Map<string,Promise<Report>>();
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});

export async function POST(req:Request){
  let body:{url?:string;deep?:boolean};
  try{body=await req.json()}catch{return json({error:'Invalid request.'},400)}
  const url=normalizeInput(body.url||'');
  if(!url) return json({error:'Enter a website address, such as example.com.'},400);
  const deep=body.deep!==false;const key=url+'|'+deep;

  const hit=cache.get(key);
  if(hit&&Date.now()-hit.at<30*60e3) return json(preview(storeReport(hit.report),hit.report));

  // Behind Cloudflare the visitor IP arrives in CF-Connecting-IP.
  const ip=req.headers.get('cf-connecting-ip')||req.headers.get('x-real-ip')||'unknown';
  const day=new Date().toISOString().slice(0,10);const rec=ips.get(ip);
  const used=rec&&rec.day===day?rec.n:0;
  if(used>=DAILY) return json({error:`You have used today’s ${DAILY} free audits. Please come back tomorrow.`},429);
  ips.set(ip,{day,n:used+1});

  try{
    let job=running.get(key);
    if(!job){job=runAudit(url,deep);running.set(key,job)}
    const report=await job.finally(()=>running.delete(key));
    cache.set(key,{at:Date.now(),report});
    if(cache.size>300)cache.delete(cache.keys().next().value!);
    return json(preview(storeReport(report),report));
  }catch(e){return json({error:e instanceof Error?e.message:'The audit failed. Please try again.'},502)}
}
