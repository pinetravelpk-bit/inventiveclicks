import type { Metadata, Viewport } from 'next';
import './globals.css';
import {FloatingContact} from '../components/ContactActions';
import {JsonLd,siteUrl} from '../components/StructuredData';
import {business,organizationSchema,organizationId} from '../lib/business';
import {services} from '../lib/content';
export const metadata: Metadata = { icons: { icon: '/favicon.svg', apple: '/logo.png' }, title: 'Inventive Clicks | Digital Marketing, SEO & Web Development', description: 'A creative and performance digital agency. Digital marketing, SEO, PPC, web development, branding, e-commerce and remote staffing.', applicationName: business.name, metadataBase: new URL('https://inventiveclicks.com'), alternates:{canonical:'/'}, openGraph:{type:'website',siteName:'Inventive Clicks',locale:'en_US'}, twitter:{card:'summary_large_image'}, robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-snippet':-1,'max-image-preview':'large','max-video-preview':-1}}, formatDetection:{telephone:false} };
export const viewport: Viewport = { themeColor: '#050912', colorScheme: 'dark' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><JsonLd data={organizationSchema(services.map(s=>s.name))}/><JsonLd data={{'@type':'WebSite','@id':siteUrl+'/#website',name:'Inventive Clicks',url:siteUrl,inLanguage:'en',description:business.description,publisher:{'@id':organizationId}}}/>{children}<FloatingContact/></body></html>}
