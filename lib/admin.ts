// Shared HTTP Basic auth and HTML helpers for /admin pages: user "admin",
// password = ADMIN_PASSWORD (12+ characters). Pages return 404 when it is not set.
import {timingSafeEqual} from 'node:crypto';

export const adminHeaders={'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'};
export const esc=(s:unknown)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));

function authorised(req:Request){
  const pass=process.env.ADMIN_PASSWORD||'';if(pass.length<12)return false;
  const m=(req.headers.get('authorization')||'').match(/^Basic (.+)$/);if(!m)return false;
  const [user,...rest]=Buffer.from(m[1],'base64').toString().split(':');const given=Buffer.from(rest.join(':'));const want=Buffer.from(pass);
  return user==='admin'&&given.length===want.length&&timingSafeEqual(given,want);
}

// Returns a Response to send when the request is not allowed, or null when it is.
export function guard(req:Request){
  if(!process.env.ADMIN_PASSWORD) return new Response('Not found',{status:404,headers:adminHeaders});
  if(!authorised(req)) return new Response('Login required',{status:401,headers:{...adminHeaders,'WWW-Authenticate':'Basic realm="Inventive Clicks admin", charset="UTF-8"'}});
  return null;
}

export function csvResponse(name:string,head:string[],rows:unknown[][]){
  const q=(v:unknown)=>`"${String(v??'').replace(/"/g,'""')}"`;
  const csv=[head.map(q).join(','),...rows.map(r=>r.map(q).join(','))].join('\n');
  return new Response('﻿'+csv,{headers:{...adminHeaders,'Content-Type':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="${name}-${new Date().toISOString().slice(0,10)}.csv"`}});
}

export const nav=(active:string)=>`<nav class="tabs">${[['leads','Audit leads'],['influencers','Influencers & brands']].map(([k,l])=>`<a href="/admin/${k}"${k===active?' class="on"':''}>${l}</a>`).join('')}</nav>`;

export function page(title:string,body:string){
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(title)} · Inventive Clicks</title><style>body{font:14px system-ui,sans-serif;margin:0;padding:24px;background:#050912;color:#e7ecf8}h1{font-size:22px;margin:0}h2{font-size:18px;margin:28px 0 0}a{color:#cdb6ff}table{border-collapse:collapse;width:100%;margin-top:12px}th,td{text-align:left;padding:10px;border-bottom:1px solid #23324a;vertical-align:top}th{background:#0b1626;color:#aeb9cd;font-size:12px;text-transform:uppercase}.top{display:flex;gap:16px;align-items:center;flex-wrap:wrap}.btn{background:#6d4ce0;color:#fff;padding:9px 14px;border-radius:8px;text-decoration:none}.wrap{overflow-x:auto}.tabs{display:flex;gap:8px;margin-bottom:18px}.tabs a{padding:8px 14px;border:1px solid #2a3a52;border-radius:999px;text-decoration:none;color:#c9d2e4}.tabs a.on{background:#6d4ce0;border-color:#6d4ce0;color:#fff}td small{color:#8f9bb2}</style></head><body>${body}</body></html>`,{headers:{...adminHeaders,'Content-Type':'text/html; charset=utf-8'}});
}
