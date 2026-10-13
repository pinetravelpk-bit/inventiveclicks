import type {Metadata} from 'next';
import {Breadcrumb,CTA,Tag,FAQ,Checklist} from '../../../../components/Inner';
import {JsonLd,BreadcrumbData,siteUrl,ogDefaults} from '../../../../components/StructuredData';
import SiteAudit from '../../../../components/SiteAudit';
import {tools} from '../../../../lib/tools';
const t=tools[0];
export const metadata:Metadata={title:'Free Website Audit Tool: Deep SEO & Site Health Check | Inventive Clicks',description:'Free deep website audit: SEO, GEO, AEO, AI search, local SEO, off-page authority, speed, technical SEO, security, links and broken pages across up to 25 pages, with a score and step-by-step fixes.',alternates:{canonical:'/tools/'+t.slug},openGraph:{...ogDefaults,title:'Free Website Deep Audit | Inventive Clicks',description:t.summary,url:'/tools/'+t.slug}};
export default function Page(){return <>
 <JsonLd data={{'@type':'WebApplication','@id':siteUrl+'/tools/'+t.slug+'#app',name:t.name,url:siteUrl+'/tools/'+t.slug,description:t.summary,applicationCategory:'BusinessApplication',operatingSystem:'Any (web browser)',isAccessibleForFree:true,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},publisher:{'@id':siteUrl+'/#organization'}}}/>
 <BreadcrumbData items={[{name:'Free Tools',path:'/tools'},{name:t.name,path:'/tools/'+t.slug}]}/>
 <Breadcrumb items={[{label:'Free Tools',href:'/tools'},{label:t.name}]}/>
 <section className="container tool-hero"><Tag>FREE SEO TOOL</Tag><h1>Website Deep Audit</h1><p>Find out what is holding your website back. One scan checks <strong>SEO</strong>, <strong>GEO</strong>, <strong>AEO</strong>, <strong>AI search</strong>, <strong>local SEO</strong>, <strong>off-page authority</strong>, <strong>speed</strong>, <strong>security</strong> and <strong>broken pages</strong> across up to 25 pages, then gives you a score and a prioritised list of fixes.</p></section>
 <section className="container tool-panel"><SiteAudit/></section>
 <section className="container inner-section tool-guide"><div><Tag>WHAT WE CHECK</Tag><h2>Over 100 checks in 14 areas.</h2></div><div><Checklist items={['On-page and technical SEO: titles, descriptions, headings, canonicals, robots.txt, sitemap, redirects and response time.','GEO and AI search: AI crawler access, llms.txt, structured data, brand entity, facts, freshness and content depth.','AEO: FAQ schema, question headings, direct answers, lists and HowTo markup.','Local SEO: LocalBusiness schema, address, phone, click-to-call, maps, hours and service area.','Off-page and authority: popularity rank, domain age, web history, knowledge graph and social profiles.','Speed, mobile, accessibility and security: page weight, images, zoom, labels, HTTPS and security headers.','Content and E-E-A-T, social and tracking: readability, author, trust pages, Open Graph and analytics.','Links, broken pages and a site-wide crawl: broken links, error pages, duplicate titles, thin and slow pages.']}/></div></section>
 <section className="container inner-section"><div className="section-top"><div><Tag>QUESTIONS</Tag><h2>Frequently asked questions</h2></div></div><FAQ items={t.faq}/></section>
 <CTA title="Want a full manual SEO audit?" text="Our team reviews rankings, competitors, content and backlinks, then gives you a clear action plan."/>
</>}
