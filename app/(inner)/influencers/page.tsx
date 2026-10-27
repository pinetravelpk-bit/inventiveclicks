import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowRight,ExternalLink,Users,BadgeCheck,BarChart3,Handshake} from 'lucide-react';
import {Breadcrumb,PageHero,CTA,Tag,FAQ,Checklist} from '../../../components/Inner';
import {JsonLd,BreadcrumbData,siteUrl,ogDefaults} from '../../../components/StructuredData';
import InfluencerForms from '../../../components/InfluencerForms';
import {featuredInfluencers,platforms,niches} from '../../../lib/influencers';

export const metadata:Metadata={title:'Influencer Network & Influencer Marketing | Inventive Clicks',description:'Join the Inventive Clicks influencer network or hire influencers for your brand. We match brands with creators on Instagram, TikTok, YouTube and more, and manage briefs, content and reporting.',alternates:{canonical:'/influencers'},openGraph:{...ogDefaults,title:'Influencer Network | Inventive Clicks',description:'Creators and brands, matched with purpose. Join the network or plan an influencer campaign.',url:'/influencers'}};

const faq:[string,string][]=[
  ['How do I join the Inventive Clicks influencer network?','Fill in the “I’m an influencer” form on this page with your main platform, profile link, follower range and niche. Our team reviews every profile and contacts you when your audience fits a campaign.'],
  ['Is there a minimum follower count?','No. We work with nano and micro creators as well as larger accounts. Relevance and genuine engagement matter more to brands than follower numbers alone.'],
  ['Do influencers pay to join?','No. Joining the network is free. Creators are paid by the brand for agreed campaign work.'],
  ['How do brands hire influencers through Inventive Clicks?','Send your campaign goal, budget and preferred platforms with the “I’m a brand” form. We shortlist suitable creators, agree the brief and deliverables, manage content approvals and report on the results.'],
  ['Which platforms do you cover?','Instagram, TikTok, YouTube, Facebook, X, LinkedIn, Snapchat, Pinterest, Twitch and blogs, depending on where your audience spends time.'],
  ['Do sponsored posts need to be disclosed?','Yes. Every paid collaboration should be clearly labelled as an ad or paid partnership, following the platform’s rules and local advertising guidelines.'],
];

const initials=(n:string)=>n.split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
const features:[typeof Users,string,string][]=[[Users,'Nano to mega','Creators of every size'],[BadgeCheck,'Vetted profiles','Audience and content checked'],[Handshake,'Managed end to end','Brief, approvals and payment'],[BarChart3,'Measured results','Reporting on your goal']];

export default function Influencers(){return <>
  <JsonLd data={{'@type':'Service','@id':siteUrl+'/influencers#service',name:'Influencer marketing and influencer network',serviceType:'Influencer marketing',url:siteUrl+'/influencers',provider:{'@id':siteUrl+'/#organization'},description:'Matching brands with relevant creators and managing influencer campaigns from brief to reporting.'}}/>
  <BreadcrumbData items={[{name:'Influencers',path:'/influencers'}]}/>
  <Breadcrumb items={[{label:'Influencers'}]}/>
  <PageHero eyebrow="INFLUENCER NETWORK" title="Creators and brands, matched with purpose." summary="Join our network of creators, or tell us about your brand and we will find influencers whose audience fits your goals, then manage the campaign from brief to results." icon={3}>
    <div className="inner-actions"><Link className="primary" href="#join">Join as an influencer <ArrowRight size={18}/></Link><Link className="outline" href="#brands">Hire influencers <ArrowRight size={17}/></Link></div>
  </PageHero>

  {featuredInfluencers.length>0&&<section className="container inner-section" id="creators">
    <div className="section-top"><div><Tag>FEATURED CREATORS</Tag><h2>Influencers in our network.</h2></div><p>Creators and talent represented by the Inventive Clicks team.</p></div>
    <div className="influencer-grid">{featuredInfluencers.map(i=><article className="influencer-card" key={i.profileUrl}>
      {i.photo?<img src={i.photo} alt={i.name} width={96} height={96} loading="lazy"/>:<span className="influencer-initials" aria-hidden="true">{initials(i.name)}</span>}
      <h3>{i.page?<Link href={i.page}>{i.name}</Link>:i.name}</h3><a href={i.profileUrl} target="_blank" rel="noopener nofollow">{i.handle} <ExternalLink size={12}/></a>
      <p>{i.niche}{i.location?` · ${i.location}`:''}</p>
      <div className="influencer-meta"><span>{i.platform}</span>{i.followers&&<strong>{i.followers}</strong>}</div>
      {i.page&&<Link className="card-link" href={i.page}>View profile <ArrowRight size={15}/></Link>}
    </article>)}</div>
  </section>}

  <section className="container inner-section influencer-how">
    <article className="detail-panel"><Tag>FOR BRANDS</Tag><h2>Reach the right audience through people they trust.</h2><Checklist items={['We shortlist creators by audience fit, engagement and brand safety.','Clear briefs, deliverables, timelines and usage rights.','Content reviewed before it goes live, with proper ad disclosure.','Results reported against your goal: reach, clicks, sign-ups or sales.']}/><Link className="card-link" href="#brands">Plan a campaign <ArrowRight size={16}/></Link></article>
    <article className="detail-panel"><Tag>FOR INFLUENCERS</Tag><h2>Work with brands that suit your audience.</h2><Checklist items={['Free to join; brands pay for agreed campaign work.','Campaigns matched to your niche and audience.','Clear briefs and agreed rates before you create.','Nano, micro and larger creators all welcome.']}/><Link className="card-link" href="#join">Join the network <ArrowRight size={16}/></Link></article>
  </section>

  <section className="container inner-section">
    <div className="section-top"><div><Tag>WHAT WE COVER</Tag><h2>Platforms and niches.</h2></div><p>We plan campaigns where your audience already spends time.</p></div>
    <div className="influencer-stats">{features.map(([I,t,d])=><div key={t}><I size={22}/><strong>{t}</strong><span>{d}</span></div>)}</div>
    <h3 className="chip-heading">Platforms</h3><ul className="chip-list">{platforms.filter(p=>p!=='Other').map(p=><li key={p}>{p}</li>)}</ul>
    <h3 className="chip-heading">Niches</h3><ul className="chip-list">{niches.filter(n=>n!=='Other').map(n=><li key={n}>{n}</li>)}</ul>
  </section>

  <section className="container inner-section contact-grid influencer-signup" id="join">
    <aside id="brands"><Tag>GET STARTED</Tag><h2>Join the network or<br/>plan a campaign.</h2><p>Creators: share your main profile and audience so we can match you with suitable brands. Brands: tell us your goal, budget and preferred platforms, and we will come back with a shortlist.</p><Checklist items={['Takes about two minutes','No fee to join for creators','We reply by email, phone or WhatsApp']}/><p className="small-note">Looking for the full service? See <Link href="/services/influencer-marketing">Influencer Marketing</Link>.</p></aside>
    <div className="form-panel"><InfluencerForms/></div>
  </section>

  <section className="container inner-section faq-section"><div><Tag>QUESTIONS</Tag><h2>Influencer network FAQ</h2></div><FAQ items={faq}/></section>
  <CTA title="Ready to work with creators?" text="Tell us about your audience and goals, and we will plan an influencer campaign that fits."/>
</>}
