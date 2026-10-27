// Private list of website-audit leads (see lib/admin.ts for login).
import {readLeads} from '../../../lib/audit/leads';
import {csvResponse,esc,guard,nav,page} from '../../../lib/admin';
export const dynamic='force-dynamic';
export const runtime='nodejs';

export async function GET(req:Request){
  const denied=guard(req);if(denied)return denied;
  const leads=await readLeads();
  if(new URL(req.url).searchParams.get('format')==='csv')
    return csvResponse('audit-leads',['Date','Name','Email','Phone','Website','Score'],leads.map(l=>[l.at,l.name,l.email,l.phone,l.website,l.score]));
  const rows=leads.map(l=>`<tr><td>${esc(new Date(l.at).toLocaleString('en-GB',{timeZone:'Asia/Karachi'}))}</td><td>${esc(l.name)}</td><td><a href="mailto:${esc(l.email)}">${esc(l.email)}</a></td><td><a href="tel:${esc(l.phone.replace(/[^\d+]/g,''))}">${esc(l.phone)}</a></td><td><a href="${esc(l.website)}" target="_blank" rel="noopener">${esc(l.website)}</a></td><td>${esc(l.score)}</td></tr>`).join('');
  return page('Audit leads',`${nav('leads')}<div class="top"><h1>Website audit leads (${leads.length})</h1><a class="btn" href="?format=csv">Download CSV</a></div><p>Times shown in Pakistan time. Newest first.</p><div class="wrap"><table><thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Website audited</th><th>Score</th></tr></thead><tbody>${rows||'<tr><td colspan="6">No leads yet.</td></tr>'}</tbody></table></div>`);
}
