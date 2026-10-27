// Influencer network page data.
// featuredInfluencers is shown on /influencers. Add only creators who have agreed to be
// listed, with accurate, current details. Put photos in public/influencers/ and use
// the path (e.g. '/influencers/ayesha.webp'); without a photo the card shows initials.
export type Influencer={
  name:string;
  handle:string;          // e.g. '@ayesha.creates'
  platform:Platform;
  profileUrl:string;      // public profile link
  niche:string;           // e.g. 'Fashion & lifestyle'
  followers:string;       // as the creator reports it, e.g. '120K'
  location?:string;       // e.g. 'Lahore, Pakistan'
  photo?:string;
};

export const platforms=['Instagram','TikTok','YouTube','Facebook','X (Twitter)','LinkedIn','Snapchat','Pinterest','Twitch','Blog / Website','Other'] as const;
export type Platform=typeof platforms[number];

export const niches=['Fashion & beauty','Lifestyle','Food & cooking','Travel','Tech & gadgets','Gaming','Health & fitness','Education','Business & finance','Parenting & family','Comedy & entertainment','Sports','Automotive','Home & interiors','Other'];

export const followerBands=['Under 10K (nano)','10K – 50K (micro)','50K – 100K','100K – 500K (mid-tier)','500K – 1M (macro)','1M+ (mega)'];

export const budgetBands=['Under PKR 100,000','PKR 100,000 – 500,000','PKR 500,000 – 1.5M','PKR 1.5M+','Under USD 1,000','USD 1,000 – 5,000','USD 5,000+','Not sure yet'];

export const featuredInfluencers:Influencer[]=[];
