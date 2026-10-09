// Builds /llms.txt (concise index) and /llms-full.txt (full service knowledge) for AI assistants.
import {business} from './business';
import {services,projects,articles} from './content';
import {platforms} from './platforms';
import {serviceGroups} from './service-groups';

const u=(p:string)=>business.url+p;
const contactLines=()=>[business.email&&`- Email: ${business.email}`,business.telephone&&`- Phone: ${business.telephone}`,business.address.addressLocality&&`- Location: ${[business.address.streetAddress,business.address.addressLocality,business.address.addressRegion,business.address.addressCountry].filter(Boolean).join(', ')}`,business.areaServed.length&&`- Areas served: ${business.areaServed.join(', ')}`,`- Contact form: ${u('/contact')}`].filter(Boolean);

export function llmsIndex(){
  const groups=serviceGroups.map(g=>[`### ${g.name}`,...services.filter(s=>g.slugs.includes(s.slug)).map(s=>`- [${s.name}](${u('/services/'+s.slug)}): ${s.summary}`)].join('\n'));
  const grouped=new Set(serviceGroups.flatMap(g=>g.slugs));
  const other=services.filter(s=>!grouped.has(s.slug));
  return [
    `# ${business.name}`,'',`> ${business.description}`,'',
    `${business.name} plans and delivers digital marketing, search, paid media, social, e-commerce, web and creative work for businesses. Every engagement starts from the client's business goal and a written scope with deliverables and review stages.`,'',
    '## Key pages',`- [Home](${u('/')})`,`- [About](${u('/about')})`,`- [All services](${u('/services')})`,`- [Contact / start a project](${u('/contact')})`,`- [Careers](${u('/careers')})`,`- [Full details for AI assistants](${u('/llms-full.txt')})`,'',
    '## Services',...groups,...(other.length?['### Other',...other.map(s=>`- [${s.name}](${u('/services/'+s.slug)}): ${s.summary}`)]:[]),'',
    '## Platform marketing',...platforms.map(p=>`- [${p.name}](${u('/platforms/'+p.slug)}): ${p.summary}`),'',
    '## Work (illustrative concepts)',...projects.map(p=>`- [${p.name}](${u('/work/'+p.slug)}): ${p.summary}`),'',
    '## Articles',...articles.map(a=>`- [${a.title}](${u('/blog/'+a.slug)}): ${a.summary}`),'',
    '## Contact',...contactLines(),'',
  ].join('\n');
}

export function llmsFull(){
  const svc=services.map(s=>[
    `## ${s.name}`,`URL: ${u('/services/'+s.slug)}`,'',s.summary,'',s.intro,'',`Who it is for: ${s.audience}`,'',
    '### What is included',...s.offerings.map(([t,d])=>`- ${t}: ${d}`),'',
    '### Deliverables',...s.deliverables.map(d=>`- ${d}`),'',
    '### FAQ',...s.faq.flatMap(([q,a])=>[`Q: ${q}`,`A: ${a}`,'']),
  ].join('\n'));
  const plat=platforms.map(p=>[
    `## ${p.name} marketing`,`URL: ${u('/platforms/'+p.slug)}`,'',p.headline,p.summary,'',
    '### Organic',...p.organic.map(x=>`- ${x}`),'','### Paid',...p.paid.map(x=>`- ${x}`),'','### Optimization',...p.optimization.map(x=>`- ${x}`),'',
    '### FAQ',...p.faq.flatMap(([q,a])=>[`Q: ${q}`,`A: ${a}`,'']),
  ].join('\n'));
  return [`# ${business.name}: full service reference`,'',`> ${business.description}`,'','# Services','',...svc,'# Platforms','',...plat,'# Contact',...contactLines(),''].join('\n');
}
