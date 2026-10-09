import {platforms} from '../lib/platforms';
import type {MetadataRoute} from 'next';
import {services,projects,articles} from '../lib/content';
export const dynamic='force-static';
const lastModified=new Date();
export default function sitemap():MetadataRoute.Sitemap {const paths=['','/about','/services','/work','/careers','/blog','/contact','/privacy-policy','/terms-and-conditions',...services.map(s=>'/services/'+s.slug),...platforms.map(p=>'/platforms/'+p.slug),...projects.map(p=>'/work/'+p.slug),...articles.map(a=>'/blog/'+a.slug)];return paths.map(path=>({url:'https://inventiveclicks.com'+path,lastModified,changeFrequency:path===''||path==='/blog'?'weekly':'monthly',priority:path===''?1:path.split('/').length===2?.8:.6}))}
