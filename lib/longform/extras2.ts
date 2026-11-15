// Further per-service sections: engagement models, how related services connect, and
// the signals that mean a business needs this service now.
export type Extras2={models:[string,string][];related:[string,string,string][];signals:string[]};

export const extras2:Record<string,Extras2>={
'digital-marketing':{
 models:[['Strategy project','A one-off plan: audit, customer and channel strategy, measurement design and a 90-day roadmap your team or partners can execute.'],['Managed growth retainer','We plan and run the channels month to month, with media budgets paid directly by you and reporting against agreed business metrics.'],['Fractional marketing lead','A senior strategist embedded with your team for a set number of days each month, directing in-house staff and suppliers.']],
 related:[['SEO','/services/seo','Captures the demand your campaigns create and lowers acquisition cost over time.'],['PPC','/services/ppc','Delivers measurable enquiries quickly while slower channels build.'],['Content Creation','/services/content-creation','Supplies the pages, posts and creative every channel in the plan depends on.']],
 signals:['Marketing spend has grown but enquiries have not','Each channel is run by a different person or supplier with no shared plan','You cannot name your cost per lead by channel','A launch, new location or new market is coming','Sales keeps hearing the same objections that marketing never addresses'],
},
seo:{
 models:[['SEO audit and roadmap','A one-off technical, content and local audit with a prioritised action plan your team can implement.'],['Monthly SEO retainer','Ongoing technical work, content production, local SEO and reporting, scaled to the competitiveness of your market.'],['SEO for a new website','Keyword research, architecture, migration planning and on-page work delivered alongside a web development project.']],
 related:[['Content Creation','/services/content-creation','Produces the articles, guides and page copy that earn rankings and AI citations.'],['Web Development','/services/web-development','Fixes speed, structure and technical issues that limit what SEO can achieve.'],['PPC','/services/ppc','Covers high-value keywords immediately while organic rankings build.']],
 signals:['Competitors outrank you for your own service and city','Organic traffic has fallen after a redesign or Google update','Your Google Business Profile is incomplete or has few reviews','You publish content that never ranks','Paid ads are your only reliable source of enquiries'],
},
ppc:{
 models:[['Account audit and rebuild','A one-off review of wasted spend, tracking and structure, followed by a clean rebuild you or we can run.'],['Managed PPC retainer','Ongoing campaign management across chosen platforms, with weekly optimisation and monthly reporting; media paid directly by you.'],['Launch campaign','A time-boxed campaign for a product launch, season or event, with landing pages and tracking included.']],
 related:[['Conversion Rate Optimization','/services/conversion-rate-optimization','Raises the share of paid visitors who enquire or buy, lowering cost per lead.'],['Web Development','/services/web-development','Builds fast landing pages that match each campaign.'],['Analytics & Reporting','/services/analytics-reporting','Connects ad spend to leads and revenue so budget follows results.']],
 signals:['Cost per lead keeps rising month after month','Reports show clicks but nobody can say how many became customers','Ads point to the homepage','Search terms reports are full of irrelevant queries','You need enquiries this month, not next quarter'],
},
'social-media-marketing':{
 models:[['Strategy and setup','Audit, content pillars, profile optimisation, templates and a first calendar for your team to run.'],['Managed social retainer','Monthly content production, publishing, community management and reporting across agreed platforms.'],['Content plus paid social','Organic management combined with paid campaign planning, creative testing and amplification budgets paid directly by you.']],
 related:[['Influencer Marketing','/services/influencer-marketing','Extends reach through creators your audience already trusts.'],['Video Production','/services/video-production','Supplies the short-form video that platforms now reward most.'],['Graphics & Branding','/services/graphics-branding','Keeps every post recognisably yours.']],
 signals:['Profiles have not posted in weeks or look inconsistent','Followers grow but enquiries do not','Messages and comments go unanswered','Boosted posts produce likes but no sales','Competitors are visibly more active on the platforms your customers use'],
},
'e-commerce-solutions':{
 models:[['Store or marketplace launch','Account setup, catalogue content, store build or listing optimisation and launch campaigns for a new channel.'],['Managed e-commerce growth','Ongoing catalogue, advertising, retention and conversion work across your store and marketplaces, reported by channel and margin.'],['Conversion and catalogue audit','A one-off review of product content, checkout, feeds and advertising with a prioritised fix list.']],
 related:[['Shopify Development','/services/shopify-development','Builds and improves the store that campaigns send shoppers to.'],['Marketplace Management','/services/marketplace-management','Runs day-to-day listings, stock and account health on Amazon and others.'],['Email Marketing','/services/email-marketing','Turns first-time buyers into repeat customers.']],
 signals:['Visitors add to cart but do not complete checkout','Advertising cost of sale is climbing','Listings have weak images, few reviews or missing attributes','You sell on one channel and want to add marketplaces or export','Repeat purchases are rare because there is no follow-up'],
},
'web-development':{
 models:[['Business website','A focused, fast, search-ready website with editable content, forms and enquiry journeys, typically delivered in four to eight weeks.'],['Platform or web application','Search, listings, accounts, bookings, portals or directories built in phases on Next.js or a suitable framework.'],['Maintenance and growth plan','Hosting, security, updates, monitoring and a monthly allowance for improvements after launch.']],
 related:[['SEO','/services/seo','Plans the structure and content so the new site ranks from launch.'],['UI/UX Design','/services/ui-ux-design','Shapes the journeys and interfaces before development begins.'],['Website Maintenance','/services/website-maintenance','Keeps the site fast, secure and current after launch.']],
 signals:['The site is slow or awkward on phones','Editing a page needs a developer','Rankings dropped after the last redesign','Visitors do not know what to do next on key pages','You need features your current platform cannot support'],
},
'graphics-branding':{
 models:[['Brand identity project','Discovery, concepts, refined identity, guidelines and core applications, delivered as a fixed-scope project.'],['Brand refresh','Evolution of an existing identity with updated applications and the guidelines that were missing.'],['Creative retainer','A monthly allowance of campaign graphics, social templates, presentations and print within the brand system.']],
 related:[['Brand Strategy','/services/brand-strategy','Defines positioning, naming and messaging before design begins.'],['Web Development','/services/web-development','Applies the identity to the place most customers will meet it.'],['Social Media Marketing','/services/social-media-marketing','Puts the brand to work every day in your feeds.']],
 signals:['Your materials look different depending on who made them','The logo does not work small, on dark backgrounds or in print','Customers describe you as cheaper, not better','You are entering a new market or launching a new offer','Your team recreates templates from scratch every time'],
},
'influencer-marketing':{
 models:[['Launch campaign','A time-boxed campaign with a cluster of vetted creators, briefs, contracts and per-creator reporting.'],['Always-on creator programme','A rolling programme with a core group of creators, monthly content and amplification.'],['Creator sourcing only','Research, vetting and introductions for brands that manage campaigns in-house.']],
 related:[['Social Media Marketing','/services/social-media-marketing','Gives creator content a home and an audience on your own channels.'],['PPC','/services/ppc','Amplifies the best creator content to targeted audiences.'],['Video Production','/services/video-production','Produces brand-side video to complement creator content.']],
 signals:['Paid social is getting more expensive and less believable','You have a product that benefits from being shown in use','A launch needs visible momentum quickly','You need authentic content for ads and your website','One-off creator posts gave unclear results'],
},
'content-creation':{
 models:[['Content strategy and calendar','Audience questions, audit, themes and a three-month calendar your team can execute.'],['Monthly content retainer','A set volume of articles, pages, social content and video produced, optimised and published each month.'],['Website content project','All copy for a new or redesigned website, planned around search and conversion.']],
 related:[['SEO','/services/seo','Directs content toward the searches and questions that bring customers.'],['Copywriting','/services/copywriting','Sharpens the headlines, pages and campaigns that need to persuade.'],['Social Media Marketing','/services/social-media-marketing','Distributes and repurposes content where your audience is.']],
 signals:['Your website explains what you do but not why to choose you','The blog has not been updated in months','Sales repeats the same answers that should be published once','Competitors appear in AI answers and featured snippets and you do not','Social channels run out of things to post'],
},
'remote-staffing':{
 models:[['Dedicated specialist','One vetted professional working set hours for you, managed by you day to day with our support.'],['Managed remote team','Two or more professionals with our oversight of scheduling, quality and reporting.'],['Project-based support','A specialist or small team for a defined project or season, with a clear end date.']],
 related:[['Customer Support','/services/customer-support','Staffed support teams for chat, email and phone.'],['Digital Marketing','/services/digital-marketing','Strategy and direction for the marketers you place with us.'],['Analytics & Reporting','/services/analytics-reporting','Visibility of the work and results your remote team delivers.']],
 signals:['Your team is stretched and routine work slips','Local hiring is slow or unaffordable for the skill you need','Freelancers have been inconsistent','You need to scale a function quickly','You want capacity without long-term employment overhead'],
},
};
