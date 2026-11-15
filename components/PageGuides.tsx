import Link from 'next/link';
import {ArrowRight,Check,Clock,FileText,MessageCircle,ShieldCheck,Sparkles,Target,Users,Wallet} from 'lucide-react';
import {Tag,FAQ,Checklist} from './Inner';
import {serviceGroups} from '../lib/service-groups';
import {services} from '../lib/content';

/* ---------- About: the longer story ---------- */
const aboutStory=[
  ['How did Inventive Clicks start?','Inventive Clicks grew out of a simple frustration. Businesses were buying marketing, design and development from different suppliers who never spoke to each other: a website built without thinking about search, campaigns sending traffic to pages that could not convert it, brand work that looked good in a presentation and fell apart on a product page. The result was wasted budget and a client left to coordinate specialists who each believed their piece was finished. We set out to be the team that owns the whole outcome.'],
  ['What do we actually do?','We plan and deliver digital growth work across thirty connected services: digital marketing strategy, SEO, PPC and paid social, social media marketing, influencer marketing, e-commerce and marketplace marketing, website and app development, UI/UX design, branding and graphic design, content creation, video and motion graphics, marketing automation, CRM integration, website maintenance and remote staffing. Clients choose one service or a connected scope; either way the thinking behind it is the same.'],
  ['How do we work?','Every engagement starts with a conversation about the business goal, not the deliverable. From there we audit what already exists, write a proposal that lists the scope, review stages, responsibilities and measures of success, and deliver in stages so you see work early. Reporting is in plain language and always ends with a recommendation for what to do next. You own every account, file and website we touch.'],
  ['Who do we work with?','Our clients range from clinics, staffing agencies and travel companies to tax and professional-services firms, e-commerce brands, local businesses and startups, in Pakistan and the United States. The industries differ; the need is the same: more of the right customers, found through search, social and referrals, converted by a website that works and served by a team that follows up.'],
  ['What makes us different?','Three things. First, we connect disciplines that are usually sold separately, so strategy, creative and technology support one another. Second, we build for the way people search now, including Google, Google Maps, voice assistants and AI tools such as ChatGPT and Perplexity, not just the search results of five years ago. Third, we are transparent about scope, ownership and results, because long relationships are built on clarity rather than surprises.'],
];
const aboutValues=[
  ['Clarity before activity','We define the problem and the purpose before building a list of deliverables.'],
  ['Evidence over opinion','Audits, analytics and customer questions shape the plan; taste decides only what evidence cannot.'],
  ['Built to be found','Every page, post and campaign is structured for search engines and AI assistants from the start.'],
  ['Conversion is the point','Enquiry, booking and purchase journeys are designed in, not added at the end.'],
  ['You own everything','Websites, ad accounts, data, designs and content stay in your name, always.'],
  ['Plain-language reporting','You should understand what changed, why it matters and what we recommend next.'],
];
const aboutFaq:[string,string][]=[
  ['Where is Inventive Clicks based?','We work from Pakistan and serve clients across Pakistan and the United States. Projects run online with calls, shared review links and plain-language reporting, so location never limits the work.'],
  ['Do you work with small businesses or only larger companies?','Both. A local clinic, a single-location restaurant and a national staffing company have different budgets but the same need for clear scope and measurable results. Proposals are sized to the work required.'],
  ['Can you take over from another agency?','Yes. We audit what exists, secure access to your accounts in your name, and plan a staged handover so campaigns, rankings and content are protected during the transition.'],
  ['What does a first conversation involve?','Around thirty minutes on your goals, current challenges, audience, timeline and the resources already in place. You leave with a clear view of what we would recommend and what it would involve.'],
  ['How do you charge?','By scope. After discovery we send a written proposal listing deliverables, timeline and fees. Ongoing services such as SEO, PPC management, social media and remote staffing are monthly; projects such as websites and branding are fixed-scope.'],
  ['Do you build in-house or outsource?','Our core team covers strategy, SEO, paid media, social, content, design and development. Specialist partners are brought in for specific needs such as photography or video production, always under our management and quality control.'],
];
export function AboutStory(){return <div className="lf">
  <section className="container inner-section"><div className="section-top"><div><Tag>OUR STORY</Tag><h2>Who is Inventive Clicks?</h2></div><p>A short, honest account of what we do, how we do it and why it works.</p></div><div className="lf-story">{aboutStory.map(([q,a])=><article className="reveal" key={q}><h3>{q}</h3><p>{a}</p></article>)}</div></section>
  <section className="container inner-section"><div className="section-top"><div><Tag>WHAT GUIDES EVERY PROJECT</Tag><h2>Six principles we keep.</h2></div></div><div className="lf-approach">{aboutValues.map(([t,d],i)=><article className="lf-step reveal" key={t}><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>
  <section className="container inner-section lf-split"><div><Tag>WHERE WE WORK</Tag><h2>Pakistan and the United States</h2><p className="lf-muted">Local knowledge matters as much as digital skill. What a customer in Lahore searches for is not what a patient in Texas searches for, and we plan for both.</p></div><ul className="lf-check"><li><Check size={16}/><span>Pakistan: Islamabad, Rawalpindi, Lahore, Karachi, Peshawar and nationwide, with WhatsApp-first enquiry journeys and bilingual content.</span></li><li><Check size={16}/><span>United States: clinics, staffing, directories and professional services with US search, compliance and lead-capture needs.</span></li><li><Check size={16}/><span>Remote collaboration with agreed time-zone overlap, shared review links and monthly reporting calls.</span></li><li><Check size={16}/><span>Cross-border growth: helping Pakistani businesses sell and recruit internationally, and US businesses build remote teams.</span></li></ul></section>
  <section className="container inner-section faq-section"><div><Tag>QUESTIONS ABOUT US</Tag><h2>Frequently asked questions</h2></div><FAQ items={aboutFaq}/></section>
</div>}

/* ---------- Services hub: how to choose ---------- */
const bundles:[string,string,string[]][]=[
  ['Launch a business or product','A credible presence from day one, built to be found and to convert.',['brand-strategy','graphics-branding','web-development','seo','social-media-marketing']],
  ['Get more enquiries','Capture people already searching and turn visits into conversations.',['seo','ppc','conversion-rate-optimization','content-creation','marketing-automation']],
  ['Sell more online','Catalogue, store, marketplaces and ads planned around margin.',['e-commerce-solutions','shopify-development','marketplace-management','email-marketing','product-photography']],
  ['Build the brand','Visibility, trust and a story people remember.',['social-media-marketing','influencer-marketing','video-production','digital-pr','community-management']],
  ['Add capacity','Specialists and ongoing support without the overhead.',['remote-staffing','customer-support','website-maintenance','analytics-reporting','crm-integration']],
];
const chooseFaq:[string,string][]=[
  ['How do I know which service I need?','Start with the result you want: more enquiries, more sales, a stronger brand, a better website or more capacity. Tell us that and we will recommend the smallest scope that moves it, and explain what else would help later.'],
  ['Can I start small and add services later?','Yes. Most relationships start with one priority, prove results and grow from there. Because every service follows the same planning and reporting approach, adding a channel later is straightforward.'],
  ['How are services priced?','Projects such as websites, branding and video are fixed-scope and priced from the work involved. Ongoing services such as SEO, PPC, social media and remote staffing are monthly. Advertising and influencer budgets are paid directly by you and shown separately.'],
  ['Do you offer packages?','We prefer tailored scopes because a package rarely fits. The five starting points above show how services commonly combine; your proposal will list exactly what is included and why.'],
  ['What happens after I choose a service?','A discovery call, an audit of what exists, a written proposal with scope, timeline, responsibilities and measures of success, then staged delivery with reviews and reporting.'],
  ['Do you work on platforms I already use?','Yes. We work with WordPress, Shopify, WooCommerce, Next.js and custom sites; Google, Meta, TikTok, LinkedIn, Microsoft and Amazon advertising; and the major email, CRM and analytics tools.'],
];
export function ServicesGuide(){return <div className="lf">
  <section className="container inner-section"><div className="section-top"><div><Tag>WHERE TO START</Tag><h2>Which services do you need?</h2></div><p>Most goals are reached with a small, connected set of services rather than everything at once. These five starting points cover the situations we see most.</p></div><div className="lf-bundles">{bundles.map(([t,d,slugs])=><article className="lf-bundle reveal" key={t}><Sparkles size={18}/><h3>{t}</h3><p>{d}</p><ul>{slugs.map(s=>{const sv=services.find(x=>x.slug===s);return sv?<li key={s}><Link href={`/services/${s}`}>{sv.name}</Link></li>:null})}</ul></article>)}</div></section>
  <section className="container inner-section lf-split"><div><Tag>HOW SERVICES CONNECT</Tag><h2>Five groups, one plan.</h2><p className="lf-muted">Our thirty services are organised into five groups. Each group can stand alone, but the best results come when they are planned together around a shared goal.</p></div><ul className="lf-check">{serviceGroups.map(g=><li key={g.id}><Check size={16}/><span><strong>{g.name}:</strong> {g.slugs.map(s=>services.find(x=>x.slug===s)?.name).filter(Boolean).join(', ')}.</span></li>)}</ul></section>
  <section className="container inner-section"><div className="section-top"><div><Tag>WHAT EVERY SERVICE INCLUDES</Tag><h2>The same standards, whichever service you choose.</h2></div></div><div className="lf-approach">{[[Target,'A written scope','Deliverables, timeline, review stages and responsibilities, agreed before work starts.'],[ShieldCheck,'Your ownership','Accounts, websites, data and creative stay in your name.'],[Users,'Named people','You know who is doing the work and who to call.'],[Clock,'Staged delivery','Work is reviewed in stages, so nothing goes public without your approval.'],[FileText,'Plain-language reporting','What changed, what it means and what we recommend next.'],[Wallet,'Transparent costs','Our fees are separate from media and creator budgets, which you pay directly.']].map(([I,t,d],i)=>{const Icon=I as typeof Target;return <article className="lf-step reveal" key={t as string}><span>0{i+1}</span><Icon size={20}/><h3>{t as string}</h3><p>{d as string}</p></article>})}</div></section>
  <section className="container inner-section faq-section"><div><Tag>CHOOSING A SERVICE</Tag><h2>Frequently asked questions</h2></div><FAQ items={chooseFaq}/></section>
</div>}

/* ---------- Contact: what happens next ---------- */
const nextSteps:[string,string][]=[
  ['Within one working day','We acknowledge your enquiry and ask any questions needed to understand the goal, the current setup and the deadline.'],
  ['Discovery call','A thirty-minute call (or a WhatsApp conversation if you prefer) to go through your business, audience and what success would look like.'],
  ['Audit and proposal','We review your website, listings, campaigns or brand materials and send a written proposal with scope, timeline, responsibilities, measures of success and fees.'],
  ['Kick-off','Once agreed, we set up access, shared review links and a reporting rhythm, and the first stage of work begins.'],
];
const briefTips=['What your business does and what makes it different','Who your best customers are and where they are located','What you want to improve: enquiries, sales, brand, website or capacity','Links to your website, social profiles and any current campaigns','Your timeline and any fixed dates, such as a launch or season','A budget range, if you have one, so we can recommend realistically'];
export const contactFaq:[string,string][]=[
  ['How quickly will you reply?','Within one working day by email or WhatsApp. Discovery calls are usually scheduled within the same week.'],
  ['Do you offer a free consultation?','Yes. The first conversation and the initial review of your website or campaigns are free. You receive a written proposal before any work is charged.'],
  ['Can we talk on WhatsApp instead of email?','Yes. Many of our Pakistani clients prefer WhatsApp and many US clients prefer email or a scheduled call. Use whichever suits you; the process is the same.'],
  ['What if I am not sure what I need?','That is normal. Describe the problem in your own words, such as “we are not getting enough enquiries” or “our website looks dated”, and we will help you frame the right scope.'],
  ['Do you work with clients outside Pakistan?','Yes. We work with clients in the United States and other countries. Calls are scheduled around your time zone and all reporting is in plain English.'],
  ['Is my information kept confidential?','Yes. Enquiries are used only to respond to you and plan the work. We sign non-disclosure agreements when a project requires it. See our privacy policy for details.'],
];
export function ContactGuide(){return <div className="lf">
  <section className="container inner-section"><div className="section-top"><div><Tag>WHAT HAPPENS NEXT</Tag><h2>What happens after you get in touch?</h2></div><p>No pressure and no sales script: a short, structured path from your message to a written proposal.</p></div><div className="lf-approach lf-four">{nextSteps.map(([t,d],i)=><article className="lf-step reveal" key={t}><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>
  <section className="container inner-section lf-split"><div><Tag>WRITING A USEFUL BRIEF</Tag><h2>What should you include?</h2><p className="lf-muted">You do not need a formal document. A few sentences covering these points let us respond with something specific rather than generic.</p><Link className="outline" href="/tools/website-audit">Run a free website audit first <ArrowRight size={16}/></Link></div><Checklist items={briefTips}/></section>
  <section className="container inner-section lf-split"><div><Tag>WAYS TO REACH US</Tag><h2>Choose the channel that suits you.</h2></div><ul className="lf-check"><li><MessageCircle size={16}/><span><strong>WhatsApp:</strong> fastest for Pakistani clients; use the button on this page and we will reply in a conversation.</span></li><li><FileText size={16}/><span><strong>Project brief form:</strong> fill in the form above with your goals and preferred contact method.</span></li><li><Clock size={16}/><span><strong>Scheduled call:</strong> request a time in your message and we will confirm a slot in your time zone.</span></li><li><Users size={16}/><span><strong>Influencers and talent:</strong> creators and brands can use the dedicated forms on the Influencers page.</span></li></ul></section>
</div>}
