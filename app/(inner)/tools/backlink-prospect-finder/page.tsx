import type {Metadata} from 'next';
import {Breadcrumb,CTA,Tag,FAQ,Checklist} from '../../../../components/Inner';
import {JsonLd,BreadcrumbData,siteUrl,ogDefaults} from '../../../../components/StructuredData';
import ProspectFinder from '../../../../components/ProspectFinder';
import {tools} from '../../../../lib/tools';
const t=tools[0];
export const metadata:Metadata={title:'Free Backlink Prospect Finder: DA, PA & Spam Score Checker | Inventive Clicks',description:'Find relevant guest post websites in your niche and bulk check Domain Authority, Page Authority, Spam Score and Open PageRank for free. Every site is checked to confirm it is live.',alternates:{canonical:'/tools/'+t.slug},openGraph:{...ogDefaults,title:'Free Backlink Prospect Finder | Inventive Clicks',description:t.summary,url:'/tools/'+t.slug}};
export default function Page(){return <>
 <JsonLd data={{'@type':'WebApplication','@id':siteUrl+'/tools/'+t.slug+'#app',name:t.name,url:siteUrl+'/tools/'+t.slug,description:t.summary,applicationCategory:'BusinessApplication',operatingSystem:'Any (web browser)',isAccessibleForFree:true,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},publisher:{'@id':siteUrl+'/#organization'}}}/>
 <BreadcrumbData items={[{name:'Free Tools',path:'/tools'},{name:t.name,path:'/tools/'+t.slug}]}/>
 <Breadcrumb items={[{label:'Free Tools',href:'/tools'},{label:t.name}]}/>
 <section className="container tool-hero"><Tag>FREE SEO TOOL</Tag><h1>Backlink Prospect Finder</h1><p>Get a list of <strong>verified websites where you can add your link</strong>: guest post sites, directories, agency listings, profiles and communities. See each site’s <strong>DA</strong>, <strong>PA</strong>, <strong>Spam Score</strong> and popularity rank, or paste your own list to check up to 50 domains at once.</p></section>
 <section className="container tool-panel"><ProspectFinder/></section>
 <section className="container inner-section tool-guide"><div><Tag>HOW TO USE IT</Tag><h2>From keyword to a vetted outreach list.</h2></div><div><Checklist items={['Choose your niche and the kinds of websites you want links from.','Review the table: higher DA and PA suggest stronger sites, a lower Spam Score is safer, and a lower popularity rank means a bigger site.','Keep “Live sites only” on to hide closed, parked and redirected websites.','Open each site’s submission or guidelines page, then download the CSV to track your progress.']}/></div></section>
 <section className="container inner-section"><div className="section-top"><div><Tag>QUESTIONS</Tag><h2>Frequently asked questions</h2></div></div><FAQ items={t.faq}/></section>
 <CTA title="Need links that move rankings?" text="Our SEO team builds relevant, editorial links as part of a complete search strategy."/>
</>}
