import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowRight,Smartphone,Search,Gauge,LayoutTemplate,ShieldCheck,PlugZap} from 'lucide-react';
import {Breadcrumb,CTA,Tag} from '../../../components/Inner';
import {JsonLd,BreadcrumbData,siteUrl,ogDefaults} from '../../../components/StructuredData';
import PortfolioGrid from '../../../components/PortfolioGrid';
import {projects,sectors} from '../../../lib/portfolio';
import './portfolio.css';

export const metadata:Metadata={
  title:'Website Development Portfolio | Our Projects | Inventive Clicks',
  description:'Websites we have designed and developed for healthcare, staffing and recruitment, travel and hospitality, and business clients in Pakistan and the USA.',
  alternates:{canonical:'/portfolio'},
  openGraph:{...ogDefaults,title:'Our Development Projects | Inventive Clicks',description:'A selection of websites designed and developed by Inventive Clicks.',url:'/portfolio'},
};

const capabilities=[
  [LayoutTemplate,'Custom design','Layouts built around each brand and the action visitors should take.'],
  [Smartphone,'Mobile first','Every page designed for phones first, then scaled up.'],
  [Search,'SEO-ready builds','Clean structure, metadata, schema and fast pages from day one.'],
  [PlugZap,'Lead capture','Booking, enquiry, search and WhatsApp flows that turn visits into leads.'],
  [Gauge,'Performance','Optimised images, caching and lean code for quick loading.'],
  [ShieldCheck,'Secure hosting','HTTPS, security headers and reliable deployment and updates.'],
] as const;

const steps=[['Discover','Goals, audience and the key action each page should drive.'],['Design','Wireframes and visual design reviewed with you before build.'],['Develop','Responsive build on WordPress, Next.js or a custom stack.'],['Launch & grow','SEO setup, analytics, hosting and ongoing improvements.']];

const hero=['pinetravel','estaff','mrppc'].map(s=>projects.find(p=>p.slug===s)!);
const sectorCount=new Set(projects.map(p=>p.sector)).size;

export default function Portfolio(){return <div className="pf">
  <JsonLd data={{'@type':'CollectionPage','@id':siteUrl+'/portfolio#page',url:siteUrl+'/portfolio',name:'Website development portfolio',description:'Websites designed and developed by Inventive Clicks.',publisher:{'@id':siteUrl+'/#organization'},mainEntity:{'@type':'ItemList',numberOfItems:projects.length,itemListElement:projects.map((p,i)=>({'@type':'ListItem',position:i+1,item:{'@type':'CreativeWork',name:`${p.name} website`,description:p.summary,image:siteUrl+`/portfolio/${p.slug}.webp`,creator:{'@id':siteUrl+'/#organization'}}}))}}}/>
  <BreadcrumbData items={[{name:'Portfolio',path:'/portfolio'}]}/>
  <Breadcrumb items={[{label:'Portfolio'}]}/>

  <section className="container pf-hero">
    <div className="pf-hero-copy">
      <Tag>OUR DEVELOPMENT PROJECTS</Tag>
      <h1>Websites that <span>work</span> as hard as you do.</h1>
      <p>A selection of websites we have designed and developed for clinics, staffing agencies, travel companies, resorts and growing businesses in Pakistan and the USA.</p>
      <div className="pf-stats">
        <div><strong>{projects.length}</strong><span>Live websites</span></div>
        <div><strong>{sectorCount}</strong><span>Industries</span></div>
        <div><strong>2</strong><span>Markets: Pakistan &amp; USA</span></div>
      </div>
      <div className="inner-actions"><Link className="primary" href="#projects">Explore projects <ArrowRight size={18}/></Link><Link className="outline" href="/contact?service=Web%20Development">Start your website <ArrowRight size={17}/></Link></div>
    </div>
    <div className="pf-collage" aria-hidden="true">{hero.map((p,i)=><div key={p.slug} className={`pf-float f${i}`}><div className="pf-browser"><div className="pf-bar"><i/><i/><i/></div><img src={`/portfolio/${p.slug}-sm.webp`} alt="" width={800} height={500}/></div></div>)}</div>
  </section>

  <section id="projects" className="container inner-section">
    <div className="section-top"><div><Tag>SELECTED WORK</Tag><h2>Built for real businesses.</h2></div><p>Filter by industry and tap any screenshot to see it larger.</p></div>
    <PortfolioGrid projects={projects} sectors={sectors}/>
  </section>

  <section className="container inner-section">
    <div className="section-top"><div><Tag>WHAT EVERY BUILD INCLUDES</Tag><h2>More than a good-looking homepage.</h2></div></div>
    <div className="pf-caps">{capabilities.map(([I,t,d])=><div key={t}><I size={24}/><h3>{t}</h3><p>{d}</p></div>)}</div>
  </section>

  <section className="container inner-section">
    <div className="section-top"><div><Tag>HOW WE WORK</Tag><h2>From brief to launch.</h2></div></div>
    <ol className="pf-steps">{steps.map(([t,d],i)=><li key={t}><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></li>)}</ol>
  </section>

  <CTA title="Want a website like these?" text="Tell us about your business and goals, and we will plan a website that brings in enquiries."/>
</div>}
