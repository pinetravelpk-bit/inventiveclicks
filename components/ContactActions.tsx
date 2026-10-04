'use client';
import Link from 'next/link';
import {MessageCircle,ArrowRight,Check} from 'lucide-react';
import {hasWhatsApp,whatsappHref} from '../lib/contact';
export function WhatsAppLink({className='',label='Chat on WhatsApp',message}:{className?:string;label?:string;message?:string}){return <a className={`whatsapp-link ${className}`} href={whatsappHref(message)} target={hasWhatsApp?'_blank':undefined} rel={hasWhatsApp?'noopener noreferrer':undefined}><MessageCircle size={19}/><span>{hasWhatsApp?label:'WhatsApp contact'}</span></a>}
export function FloatingContact(){return <div className="floating-contact"><Link href="/contact" className="mobile-enquiry">Discuss your project <ArrowRight size={17}/></Link><WhatsAppLink className="floating-whatsapp"/></div>}
export function Callouts(){return <ul className="callout-strip" aria-label="How we work">{['Scope agreed upfront','Clear review stages','Support across 30 services','Mobile-first design'].map(s=><li key={s}><Check size={15}/>{s}</li>)}</ul>}
export function ConversionBand({title='Have a goal but need a plan?',text='Tell us what needs to change. We’ll help you decide where to start.',service}:{title?:string;text?:string;service?:string}){return <section className="container conversion-band"><div><h2>{title}</h2><p>{text}</p></div><div className="conversion-actions"><Link className="primary" href={service?`/contact?service=${encodeURIComponent(service)}`:'/contact'}>Discuss Your Project <ArrowRight size={17}/></Link><WhatsAppLink/></div></section>}
