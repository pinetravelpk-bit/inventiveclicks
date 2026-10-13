import type {Metadata} from 'next';
import {Breadcrumb,CTA,Tag,FAQ,Checklist} from '../../../../components/Inner';
import {JsonLd,BreadcrumbData,siteUrl,ogDefaults} from '../../../../components/StructuredData';
import SiteAudit from '../../../../components/SiteAudit';
import {tools} from '../../../../lib/tools';
const t=tools[0];
export const metadata:Metadata={title:'Free Website Audit Tool: Deep SEO & Site Health Check | Inventive Clicks',description:'Run a free deep website audit. Check on-page SEO, technical SEO, speed, security, AI search readiness and broken links across up to 25 pages, with a score and step-by-step fixes.',alternates:{canonical:'/tools/'+t.slug},openGraph:{...ogDefaults,title:'Free Website Deep Audit | Inventive Clicks',description:t.summary,url:'/tools/'+t.slug}};
export default function Page(){return <>
 <JsonLd data={{'@type':'WebApplication','@id':siteUrl+'/tools/'+t.slug+'#app',name:t.name,url:siteUrl+'/tools/'+t.slug,description:t.summary,applicationCategory:'BusinessApplication',operatingSystem:'Any (web browser)',isAccessibleForFree:true,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},publisher:{'@id':siteUrl+'/#organization'}}}/>
 <BreadcrumbData items={[{name:'Free Tools',path:'/tools'},{name:t.name,path:'/tools/'+t.slug}]}/>
 <Breadcrumb items={[{label:'Free Tools',href:'/tools'},{label:t.name}]}/>
 <section className="container tool-hero"><Tag>FREE SEO TOOL</Tag><h1>Website Deep Audit</h1><p>Find out what is holding your website back. Get a score and a prioritised list of fixes for <strong>SEO</strong>, <strong>speed</strong>, <strong>security</strong>, <strong>AI search</strong> and <strong>broken links</strong>, checked across up to 25 pages.</p></section>
 <section className="container tool-panel"><SiteAudit/></section>
 <section className="container inner-section tool-guide"><div><Tag>WHAT WE CHECK</Tag><h2>Over 50 checks in seven areas.</h2></div><div><Checklist items={['On-page SEO: titles, descriptions, headings, content depth, images and social tags.','Technical SEO: status codes, redirects, robots.txt, sitemap, 404 handling and response time.','Speed: page weight, image size and format, render-blocking scripts and lazy loading.','Security: HTTPS, redirects, mixed content and security headers.','AI search readiness: structured data, FAQ markup, llms.txt and AI crawler access.','Links and site-wide issues: broken links, duplicate titles, thin and slow pages.']}/></div></section>
 <section className="container inner-section"><div className="section-top"><div><Tag>QUESTIONS</Tag><h2>Frequently asked questions</h2></div></div><FAQ items={t.faq}/></section>
 <CTA title="Want a full manual SEO audit?" text="Our team reviews rankings, competitors, content and backlinks, then gives you a clear action plan."/>
</>}
