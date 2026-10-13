// Private list of audit leads. Protected by HTTP Basic auth: user "admin" and the
// ADMIN_PASSWORD value in /etc/inventiveclicks.env. Disabled when no password is set.
import {timingSafeEqual} from 'node:crypto';
import {readLeads} from '../../../lib/audit/leads';
export const dynamic='force-dynamic';
export const runtime='nodejs';

const headers={'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'};
const esc=(s:unknown)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
function authorised(req:Request){
  const pass=process.env.ADMIN_PASSWORD||'';if(pass.length<12)return false;
  const m=(req.headers.get('authorization')||'').match(/^Basic (.+)$/);if(!m)return false;
  const [user,...rest]=Buffer.from(m[1],'base64').toString().split(':');const given=Buffer.from(rest.join(':'));const want=Buffer.from(pass);
  return user==='admin'&&given.length===want.length&&timingSafeEqual(given,want);
}

export async function GET(req:Request){
  if(!process.env.ADMIN_PASSWORD) return new Response('Not found',{status:404,headers});
  if(!authorised(req)) return new Response('Login required',{status:401,headers:{...headers,'WWW-Authenticate':'Basic realm="Inventive Clicks leads", charset="UTF-8"'}});
  const leads=await readLeads();
  if(new URL(req.url).searchParams.get('format')==='csv'){
    const q=(v:unknown)=>`"${String(v??'').replace(/"/g,'""')}"`;
    const csv=['Date,Name,Email,Phone,Website,Score',...leads.map(l=>[l.at,l.name,l.email,l.phone,l.website,l.score].map(q).join(','))].join('\n');
    return new Response('﻿'+csv,{headers:{...headers,'Content-Type':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="audit-leads-${new Date().toISOString().slice(0,10)}.csv"`}});
  }
  const rows=leads.map(l=>`<tr><td>${esc(new Date(l.at).toLocaleString('en-GB',{timeZone:'Asia/Karachi'}))}</td><td>${esc(l.name)}</td><td><a href="mailto:${esc(l.email)}">${esc(l.email)}</a></td><td><a href="tel:${esc(l.phone.replace(/[^\d+]/g,''))}">${esc(l.phone)}</a></td><td><a href="${esc(l.website)}" target="_blank" rel="noopener">${esc(l.website)}</a></td><td>${esc(l.score)}</td></tr>`).join('');
  const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Audit leads · Inventive Clicks</title><style>body{font:14px system-ui,sans-serif;margin:0;padding:24px;background:#050912;color:#e7ecf8}h1{font-size:22px}a{color:#cdb6ff}table{border-collapse:collapse;width:100%;margin-top:16px}th,td{text-align:left;padding:10px;border-bottom:1px solid #23324a;vertical-align:top}th{background:#0b1626;color:#aeb9cd;font-size:12px;text-transform:uppercase}.top{display:flex;gap:16px;align-items:center;flex-wrap:wrap}.btn{background:#6d4ce0;color:#fff;padding:9px 14px;border-radius:8px;text-decoration:none}.wrap{overflow-x:auto}</style></head><body><div class="top"><h1>Website audit leads (${leads.length})</h1><a class="btn" href="?format=csv">Download CSV</a></div><p>Times shown in Pakistan time. Newest first.</p><div class="wrap"><table><thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Website audited</th><th>Score</th></tr></thead><tbody>${rows||'<tr><td colspan="6">No leads yet.</td></tr>'}</tbody></table></div></body></html>`;
  return new Response(html,{headers:{...headers,'Content-Type':'text/html; charset=utf-8'}});
}
