import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {articles} from '../../../lib/content';
import {Breadcrumb,PageHero,CTA,Tag,IconArt} from '../../../components/Inner';
export const metadata:Metadata={title:'Insights & Ideas | Inventive Clicks Blog',description:'Practical articles about campaign planning, useful websites and remote team collaboration.',alternates:{canonical:'/blog'}};
export default function Blog(){return <><Breadcrumb items={[{label:'Blog'}]}/><PageHero eyebrow="THE INVENTIVE JOURNAL" title="Practical guides for planning better work." summary="Prepare a marketing brief, check your landing-page content or define a remote role before committing time and budget." icon={8}/><section className="container inner-section"><div className="section-top"><div><Tag>IDEAS & INSIGHTS</Tag><h2>Start with a useful idea.</h2></div></div><div className="article-grid">{articles.map(a=><Link className="article-card" key={a.slug} href={`/blog/${a.slug}`}><div className="article-art"><IconArt index={a.icon}/><span>{a.category}</span></div><div className="article-copy"><span className="article-meta">{a.category} · {a.read}</span><h2>{a.title}</h2><p>{a.summary}</p><span className="card-link">Read article <ArrowRight size={16}/></span></div></Link>)}</div></section><CTA title="Ready to put an idea into action?"/></>}
