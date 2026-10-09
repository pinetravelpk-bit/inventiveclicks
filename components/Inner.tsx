import Link from 'next/link';
import {WhatsAppLink} from './ContactActions';
import {ArrowRight,Check,ChevronRight} from 'lucide-react';
import type {ReactNode} from 'react';
import type {Service} from '../lib/content';
import {JsonLd} from './StructuredData';
export function IconArt({index,className=''}:{index:number;className?:string}){return <span aria-hidden="true" className={`hd-icon ${className}`} style={{backgroundPosition:`${index%4/3*100}% ${Math.floor(index/4)/2*100}%`}}/>}
export function Tag({children}:{children:ReactNode}){return <span className="pill"><span>◈</span> {children}</span>}
export function Breadcrumb({items}:{items:{label:string;href?:string}[]}){return <nav className="breadcrumb container" aria-label="Breadcrumb"><Link href="/">Home</Link>{items.map((x,i)=><span key={i}><ChevronRight size={12}/>{x.href?<Link href={x.href}>{x.label}</Link>:<span aria-current="page">{x.label}</span>}</span>)}</nav>}
export function PageHero({eyebrow,title,summary,icon=10,children}:{eyebrow:string;title:string;summary:string;icon?:number;children?:ReactNode}){return <section className="inner-hero container"><div className="inner-hero-copy"><Tag>{eyebrow}</Tag><h1>{title}</h1><p>{summary}</p>{children}</div><div className="inner-art"><div className="inner-orbit"/><IconArt index={icon}/><span className="art-caption">Ideas. Strategy. Real Results.</span></div></section>}
export function CTA({title='Have a project to discuss?',text='Share your goal, current setup and any deadline so we can discuss the scope.'}:{title?:string;text?:string}){return <section className="container cta inner-cta"><div><h2>{title}</h2><p>{text}</p></div><div className="cta-action-group"><Link className="primary" href="/contact">Discuss Your Project <ArrowRight size={18}/></Link><WhatsAppLink/></div><IconArt index={11} className="plane hd-plane"/></section>}
export function ServiceCard({service:s}:{service:Service}){return <Link className="service-card inner-service-card" href={`/services/${s.slug}`}><IconArt index={s.index} className="service-icon"/><h3>{s.name}</h3><p>{s.summary}</p><span className="card-link">Explore service <ArrowRight size={16}/></span></Link>}
export function Checklist({items}:{items:string[]}){return <ul className="checklist">{items.map(t=><li key={t}><Check size={17}/><span>{t}</span></li>)}</ul>}
// Visible FAQs also publish FAQPage markup so search and AI answers can quote them.
export function FAQ({items}:{items:[string,string][]}){return <div className="faq-list"><JsonLd data={{'@type':'FAQPage',mainEntity:items.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}}/>{items.map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div>}
