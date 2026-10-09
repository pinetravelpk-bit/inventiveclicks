import type {MetadataRoute} from 'next';
export const dynamic='force-static';
// Search engines and AI answer engines are welcome; listing them explicitly documents that intent.
const aiCrawlers=['GPTBot','OAI-SearchBot','ChatGPT-User','ClaudeBot','Claude-User','Claude-SearchBot','anthropic-ai','PerplexityBot','Perplexity-User','Google-Extended','Applebot-Extended','Bingbot','Amazonbot','CCBot','Meta-ExternalAgent','DuckAssistBot','cohere-ai','MistralAI-User'];
export default function robots():MetadataRoute.Robots{return {rules:[{userAgent:'*',allow:'/'},{userAgent:aiCrawlers,allow:'/'}],sitemap:'https://inventiveclicks.com/sitemap.xml',host:'https://inventiveclicks.com'}}
