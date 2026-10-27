// Private list of talent bookings, influencer applications and brand enquiries (see lib/admin.ts for login).
import {readRecords} from '../../../lib/submissions';
import {csvResponse,esc,guard,nav,page} from '../../../lib/admin';
export const dynamic='force-dynamic';
export const runtime='nodejs';

type Base={at:string;name:string;email:string;phone:string};
type Inf=Base&{platform:string;profileUrl:string;followers:string;niche:string;location:string;otherProfiles:string;rate:string;message:string};
type Brand=Base&{company:string;brandWebsite:string;budget:string;platforms:string[];niche:string;goal:string};
type Booking=Base&{talent:string;company:string;bookingType:string;eventDate:string;city:string;details:string};
const when=(at:string)=>esc(new Date(at).toLocaleString('en-GB',{timeZone:'Asia/Karachi'}));
const contact=(r:Base)=>`${esc(r.name)}<br><a href="mailto:${esc(r.email)}">${esc(r.email)}</a><br><a href="tel:${esc(r.phone.replace(/[^\d+]/g,''))}">${esc(r.phone)}</a>`;
const link=(u:string)=>u?`<a href="${esc(/^https?:\/\//.test(u)?u:'https://'+u)}" target="_blank" rel="noopener nofollow">${esc(u)}</a>`:'';

export async function GET(req:Request){
  const denied=guard(req);if(denied)return denied;
  const [inf,brands,bookings]=await Promise.all([readRecords<Inf>('influencers.jsonl'),readRecords<Brand>('brand-enquiries.jsonl'),readRecords<Booking>('bookings.jsonl')]);
  const fmt=new URL(req.url).searchParams.get('format');
  if(fmt==='bookings')return csvResponse('talent-bookings',['Date','Talent','Booking for','Event date','City / venue','Name','Company','Email','Phone','Details'],bookings.map(r=>[r.at,r.talent,r.bookingType,r.eventDate,r.city,r.name,r.company,r.email,r.phone,r.details]));
  if(fmt==='influencers')return csvResponse('influencer-applications',['Date','Name','Email','Phone','Platform','Profile','Followers','Niche','Location','Other profiles','Rate','Message'],inf.map(r=>[r.at,r.name,r.email,r.phone,r.platform,r.profileUrl,r.followers,r.niche,r.location,r.otherProfiles,r.rate,r.message]));
  if(fmt==='brands')return csvResponse('brand-enquiries',['Date','Company','Website','Name','Email','Phone','Budget','Platforms','Niche','Campaign goal'],brands.map(r=>[r.at,r.company,r.brandWebsite,r.name,r.email,r.phone,r.budget,r.platforms.join('; '),r.niche,r.goal]));
  const bookingRows=bookings.map(r=>`<tr><td>${when(r.at)}</td><td><strong>${esc(r.talent)}</strong><br>${esc(r.bookingType)}</td><td>${esc(r.eventDate)}<br><small>${esc(r.city)}</small></td><td>${contact(r)}${r.company?`<br><small>${esc(r.company)}</small>`:''}</td><td>${esc(r.details)}</td></tr>`).join('');
  const infRows=inf.map(r=>`<tr><td>${when(r.at)}</td><td>${contact(r)}</td><td>${esc(r.platform)}<br>${link(r.profileUrl)}${r.otherProfiles?`<br><small>${esc(r.otherProfiles)}</small>`:''}</td><td>${esc(r.followers)}</td><td>${esc(r.niche)}<br><small>${esc(r.location)}</small></td><td>${esc(r.rate)}</td><td>${esc(r.message)}</td></tr>`).join('');
  const brandRows=brands.map(r=>`<tr><td>${when(r.at)}</td><td><strong>${esc(r.company)}</strong><br>${link(r.brandWebsite)}</td><td>${contact(r)}</td><td>${esc(r.budget)}</td><td>${esc(r.platforms.join(', '))}<br><small>${esc(r.niche)}</small></td><td>${esc(r.goal)}</td></tr>`).join('');
  return page('Influencers & brands',`${nav('influencers')}
<div class="top"><h1>Talent bookings (${bookings.length})</h1><a class="btn" href="?format=bookings">Download CSV</a></div>
<div class="wrap"><table><thead><tr><th>Date</th><th>Talent / type</th><th>Event date / venue</th><th>Contact</th><th>Details</th></tr></thead><tbody>${bookingRows||'<tr><td colspan="5">No bookings yet.</td></tr>'}</tbody></table></div>
<div class="top" style="margin-top:32px"><h1>Influencer applications (${inf.length})</h1><a class="btn" href="?format=influencers">Download CSV</a></div>
<div class="wrap"><table><thead><tr><th>Date</th><th>Contact</th><th>Platform</th><th>Followers</th><th>Niche / location</th><th>Rate</th><th>Message</th></tr></thead><tbody>${infRows||'<tr><td colspan="7">No applications yet.</td></tr>'}</tbody></table></div>
<div class="top" style="margin-top:32px"><h1>Brand campaign enquiries (${brands.length})</h1><a class="btn" href="?format=brands">Download CSV</a></div>
<div class="wrap"><table><thead><tr><th>Date</th><th>Brand</th><th>Contact</th><th>Budget</th><th>Platforms / niche</th><th>Campaign goal</th></tr></thead><tbody>${brandRows||'<tr><td colspan="6">No enquiries yet.</td></tr>'}</tbody></table></div>
<p>Times shown in Pakistan time. Newest first.</p>`);
}
