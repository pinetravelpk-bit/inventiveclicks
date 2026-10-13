// Audit gating: the API returns a preview; the full report is released only after the
// visitor submits name, email and phone. Leads are appended to DATA_DIR/leads.jsonl.
import {randomBytes} from 'node:crypto';
import {appendFile,mkdir,readFile} from 'node:fs/promises';
import path from 'node:path';
import type {Report,Status} from './index';

const DATA_DIR=process.env.DATA_DIR||path.join(process.cwd(),'.data');
const LEADS=path.join(DATA_DIR,'leads.jsonl');
const reports=new Map<string,{at:number;report:Report}>();
const TTL=3*3600e3;

export function storeReport(report:Report){
  const id=randomBytes(12).toString('hex');
  reports.set(id,{at:Date.now(),report});
  for(const [k,v] of reports)if(Date.now()-v.at>TTL)reports.delete(k);
  return id;
}
export const getReport=(id:string)=>{const r=reports.get(id);return r&&Date.now()-r.at<TTL?r.report:null};

export type Preview=Pick<Report,'host'|'finalUrl'|'auditedAt'|'durationMs'|'score'|'grade'|'deep'|'stats'>&{
  id:string;counts:Record<Status,number>;totalChecks:number;
  categories:{id:string;label:string;score:number;issues:number}[];
  teaser:{label:string;category:string;status:Status}[];
};
export function preview(id:string,r:Report):Preview{
  const all=r.categories.flatMap(c=>c.checks);
  const counts=all.reduce((a,c)=>{a[c.status]++;return a},{pass:0,warn:0,fail:0,info:0} as Record<Status,number>);
  return {id,host:r.host,finalUrl:r.finalUrl,auditedAt:r.auditedAt,durationMs:r.durationMs,score:r.score,grade:r.grade,deep:r.deep,stats:r.stats,counts,totalChecks:all.length,
    categories:r.categories.map(c=>({id:c.id,label:c.label,score:c.score,issues:c.checks.filter(x=>x.status==='fail'||x.status==='warn').length})),
    teaser:r.priorities.slice(0,3).map(p=>({label:p.label,category:p.category,status:p.status}))};
}

export type Lead={at:string;name:string;email:string;phone:string;website:string;score:number;ip:string;userAgent:string};
export function validateLead(b:{name?:unknown;email?:unknown;phone?:unknown}){
  const name=String(b.name||'').trim().replace(/\s+/g,' ').slice(0,100);
  const email=String(b.email||'').trim().toLowerCase().slice(0,254);
  const phone=String(b.phone||'').trim().replace(/[^\d+()\s-]/g,'').slice(0,25);
  if(name.length<2)return {error:'Please enter your name.'};
  if(!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email))return {error:'Please enter a valid email address.'};
  if(phone.replace(/\D/g,'').length<7)return {error:'Please enter a valid phone number with country code.'};
  return {name,email,phone};
}
export async function saveLead(lead:Lead){await mkdir(DATA_DIR,{recursive:true});await appendFile(LEADS,JSON.stringify(lead)+'\n')}
export async function readLeads():Promise<Lead[]>{
  try{return (await readFile(LEADS,'utf8')).split('\n').filter(Boolean).map(l=>JSON.parse(l) as Lead).reverse()}catch{return []}
}
