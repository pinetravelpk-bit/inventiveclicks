export type Platform={slug:string;name:string;kind:string;headline:string;summary:string;organic:string[];paid:string[];optimization:string[];note:string;faq:[string,string][];source:string};
export const platforms:Platform[]=[
  {
    "slug": "amazon",
    "name": "Amazon",
    "kind": "commerce",
    "headline": "Make your Amazon catalogue and advertising work together.",
    "summary": "Product detail pages, search relevance and paid campaigns need to be planned around the same catalogue.",
    "organic": [
      "Keyword and customer-question research",
      "Titles, bullet points and product attributes",
      "Image briefs and eligible brand content"
    ],
    "paid": [
      "Sponsored Products campaign planning",
      "Product and keyword targeting reviews",
      "Budget, search-term and advertising-cost reviews"
    ],
    "optimization": [
      "Variation and catalogue consistency",
      "Stock and offer readiness before promotion",
      "Product-level margin and conversion review"
    ],
    "note": "Advertising eligibility and available brand tools depend on the account, product and marketplace. We confirm access before committing to a campaign.",
    "faq": [
      [
        "Should we advertise every product?",
        "Start with products that have accurate detail pages, available stock and an acceptable margin. Catalogue problems can waste spend even when targeting is relevant."
      ]
    ],
    "source": "https://sell.amazon.com/advertising"
  },
  {
    "slug": "ebay",
    "name": "eBay",
    "kind": "commerce",
    "headline": "Turn detailed listings into a clearer buying decision.",
    "summary": "Connect item specifics, condition information and promoted listings with a practical seller workflow.",
    "organic": [
      "Buyer-focused listing titles",
      "Accurate item specifics and categories",
      "Condition, shipping and return information"
    ],
    "paid": [
      "Eligible Promoted Listings campaign setup",
      "Campaign strategy and budget reviews",
      "Attributed sales and fee reporting"
    ],
    "optimization": [
      "Variation and duplicate-listing checks",
      "Pricing and shipping presentation",
      "Listing-level conversion review"
    ],
    "note": "Promoted Listings eligibility and charging models vary by campaign strategy. Account access and the selling market are reviewed first.",
    "faq": [
      [
        "What needs fixing before promotion?",
        "Missing item specifics, unclear condition notes and weak photos should be addressed before paying for more exposure. The listing must explain exactly what the buyer will receive."
      ]
    ],
    "source": "https://www.ebay.com/help/selling/ebay-advertising/promoted-listings-overview?id=5295"
  },
  {
    "slug": "etsy",
    "name": "Etsy",
    "kind": "commerce",
    "headline": "Build an Etsy shop that helps shoppers choose.",
    "summary": "Bring listing language, product photography and Etsy Ads into one plan for your shop.",
    "organic": [
      "Titles, tags and category relevance",
      "Product descriptions and materials",
      "Shop information and customer questions"
    ],
    "paid": [
      "Etsy Ads listing selection",
      "Budget planning around product economics",
      "Advertising performance reviews"
    ],
    "optimization": [
      "Photo sequence and variation clarity",
      "Processing and delivery information",
      "Listing improvements based on shopper questions"
    ],
    "note": "Etsy Ads and unpaid search placement are separate. Advertising does not purchase a higher organic search position.",
    "faq": [
      [
        "Can ads replace listing optimization?",
        "No. Ads can bring visitors to a listing, but the images, details, price and fulfilment information still need to support the buying decision."
      ]
    ],
    "source": "https://www.etsy.com/seller-handbook/article/how-etsy-search-works/375461474487"
  },
  {
    "slug": "walmart",
    "name": "Walmart Marketplace",
    "kind": "commerce",
    "headline": "Prepare your Walmart listings for discovery and promotion.",
    "summary": "Coordinate catalogue quality and eligible Walmart Connect campaigns around the products you can fulfil.",
    "organic": [
      "Product attributes and category mapping",
      "Readable product titles and descriptions",
      "Image and specification consistency"
    ],
    "paid": [
      "Eligible Sponsored Search planning",
      "Product and budget prioritisation",
      "Campaign performance reviews"
    ],
    "optimization": [
      "Catalogue errors and content gaps",
      "Availability and fulfilment readiness",
      "Advertising and product-page alignment"
    ],
    "note": "Walmart seller access and advertising eligibility must be confirmed. We do not promise seller approval or access to restricted features.",
    "faq": [
      [
        "What information do you need from us?",
        "Supply catalogue identifiers, accurate specifications, images, stock information and the relevant account permissions. Missing product data is resolved before launch."
      ]
    ],
    "source": "https://marketplace.walmart.com/sponsored-search-ads/"
  },
  {
    "slug": "shopify",
    "name": "Shopify",
    "kind": "commerce",
    "headline": "Connect your Shopify store with a complete marketing plan.",
    "summary": "Bring product and collection content, paid acquisition and retention together around your own storefront.",
    "organic": [
      "Collection and product-page SEO",
      "Internal links and useful buying guides",
      "Email content for opted-in customers"
    ],
    "paid": [
      "Search and social campaign coordination",
      "Product-feed and landing-page alignment",
      "Acquisition and remarketing plans where suitable"
    ],
    "optimization": [
      "Mobile product and checkout journeys",
      "Catalogue, feed and event consistency",
      "Repeat-purchase and enquiry reporting"
    ],
    "note": "Shopify is your storefront. Paid acquisition runs through selected advertising channels; subscriptions, apps and media spend are separate.",
    "faq": [
      [
        "Does this include rebuilding our store?",
        "Marketing can work with an existing store. Theme changes, custom features and integrations are assessed separately so the proposal distinguishes marketing from development."
      ]
    ],
    "source": "https://help.shopify.com/en/manual/promoting-marketing"
  },
  {
    "slug": "woocommerce",
    "name": "WooCommerce",
    "kind": "commerce",
    "headline": "Market your WooCommerce store with its operations in mind.",
    "summary": "Coordinate search content and paid traffic while accounting for your WordPress setup, product data and checkout.",
    "organic": [
      "Product and category content",
      "Search-friendly navigation and internal links",
      "Useful purchase guides and email content"
    ],
    "paid": [
      "Selected search and social campaigns",
      "Feed preparation for agreed channels",
      "Product-led landing-page planning"
    ],
    "optimization": [
      "Checkout and form journey reviews",
      "Plugin, catalogue and tracking dependencies",
      "Store content and conversion priorities"
    ],
    "note": "Hosting, plugins and custom checkout behaviour can affect implementation. Development and maintenance requirements are reviewed before campaign work.",
    "faq": [
      [
        "Can marketing start on an older store?",
        "Sometimes. We first check whether product pages and checkout are usable. Issues that prevent a reliable purchase should be resolved before increasing paid traffic."
      ]
    ],
    "source": "https://woocommerce.com/marketing/"
  },
  {
    "slug": "tiktok-shop",
    "name": "TikTok Shop",
    "kind": "commerce",
    "headline": "Connect product discovery with a shoppable content plan.",
    "summary": "Plan short-form product content, creator collaboration and eligible paid promotion around a prepared shop.",
    "organic": [
      "Product demonstration briefs",
      "Accurate product listings and buying details",
      "Creator and publishing coordination"
    ],
    "paid": [
      "Eligible shop campaign planning",
      "Video creative testing",
      "Budget and product-level performance review"
    ],
    "optimization": [
      "Video-to-product consistency",
      "Stock and order-handling readiness",
      "Content usage permissions and reporting"
    ],
    "note": "TikTok Shop and advertising availability vary by market, account and product. We confirm the intended selling market before defining delivery.",
    "faq": [
      [
        "Do we need product videos?",
        "A usable product-video plan is central to this scope. We agree whether your team supplies footage, creators produce it or production is commissioned separately."
      ]
    ],
    "source": "https://seller.tiktok.com/"
  },
  {
    "slug": "facebook",
    "name": "Facebook",
    "kind": "social",
    "headline": "Give your Facebook presence a clear business purpose.",
    "summary": "Connect Page content, community replies and paid campaigns with a useful destination for enquiries.",
    "organic": [
      "Page information and content planning",
      "Educational posts and campaign updates",
      "Comment and message response guidance"
    ],
    "paid": [
      "Audience and objective planning",
      "Creative and landing-page tests",
      "Lead-quality and budget reviews"
    ],
    "optimization": [
      "Clear enquiry paths",
      "Approved response and escalation rules",
      "Relevant reporting definitions"
    ],
    "note": "Campaign scope depends on account access, market and offer eligibility. Publishing and reply coverage are agreed separately.",
    "faq": [
      [
        "Is boosting a post a full campaign strategy?",
        "A promoted post may support a particular goal, but it does not replace audience planning, a clear destination or follow-up. We scope paid activity around the action you need."
      ]
    ],
    "source": "https://www.facebook.com/business/ads"
  },
  {
    "slug": "instagram",
    "name": "Instagram",
    "kind": "social",
    "headline": "Build an Instagram presence with content worth returning to.",
    "summary": "Connect profile clarity, Reels, carousels and paid creative with a consistent brand voice.",
    "organic": [
      "Profile and content-pillar planning",
      "Reels, carousel and Stories briefs",
      "Publishing and community coordination"
    ],
    "paid": [
      "Campaign and creative-test planning",
      "Audience and destination alignment",
      "Paid-content performance reviews"
    ],
    "optimization": [
      "Profile-to-enquiry journey",
      "Format-specific creative reviews",
      "Permissions for reused creator content"
    ],
    "note": "Filming, creator fees and community coverage are specified in the proposal. Reach and follower growth are not guaranteed.",
    "faq": [
      [
        "Can one video be reused everywhere?",
        "Source footage can be adapted, but hooks, framing, captions and the intended action should fit each placement. Reuse also depends on the rights attached to the footage."
      ]
    ],
    "source": "https://business.instagram.com/advertising"
  },
  {
    "slug": "linkedin",
    "name": "LinkedIn",
    "kind": "social",
    "headline": "Turn your expertise into useful professional content.",
    "summary": "Build a company presence and paid campaigns around the people involved in a business buying decision.",
    "organic": [
      "Company Page and messaging review",
      "Expert-led posts and case-study planning",
      "Editorial support for approved spokespeople"
    ],
    "paid": [
      "Professional audience planning",
      "Lead or website campaign scoping",
      "Creative and lead-quality reviews"
    ],
    "optimization": [
      "Offer clarity for different decision makers",
      "Lead handover to the sales team",
      "Meaningful engagement and enquiry reporting"
    ],
    "note": "Leadership content needs genuine subject-matter input and approval. Targeting options depend on available campaign features.",
    "faq": [
      [
        "Who should provide the expertise?",
        "Your subject-matter experts supply the facts, examples and point of view. We help structure and edit that input without inventing experience or client outcomes."
      ]
    ],
    "source": "https://business.linkedin.com/advertise"
  },
  {
    "slug": "tiktok",
    "name": "TikTok",
    "kind": "social",
    "headline": "Build a short-form content plan around your audience.",
    "summary": "Connect repeatable video concepts, creator input and paid tests with a realistic production rhythm.",
    "organic": [
      "Audience and format research",
      "Video hooks and recurring series",
      "Publishing and comment-response plans"
    ],
    "paid": [
      "Eligible campaign planning",
      "Creative testing with approved assets",
      "Budget and destination reviews"
    ],
    "optimization": [
      "Video opening and message clarity",
      "Production and approval workflow",
      "Content-to-enquiry or purchase journey"
    ],
    "note": "Creator permissions, production responsibilities and account eligibility are checked before paid use.",
    "faq": [
      [
        "Do we need to follow every trend?",
        "No. We select formats that fit the offer and the people you need to reach. A repeatable demonstration or useful answer can be more relevant than an unrelated trend."
      ]
    ],
    "source": "https://ads.tiktok.com/business/en/blog/small-business-marketing-tiktok-ultimate-guide"
  },
  {
    "slug": "youtube",
    "name": "YouTube",
    "kind": "social",
    "headline": "Build a channel around questions worth answering.",
    "summary": "Connect video planning, discoverability and paid distribution with a clear reason for viewers to keep watching.",
    "organic": [
      "Topic and series planning",
      "Titles, descriptions and thumbnail briefs",
      "Channel organisation and publishing support"
    ],
    "paid": [
      "Video campaign planning",
      "Audience and landing-page alignment",
      "Creative and budget reviews"
    ],
    "optimization": [
      "Opening sequence and viewing journey",
      "End-of-video next steps",
      "Content and enquiry performance review"
    ],
    "note": "Video production and advertising are separate scopes. We confirm footage, music permissions and the chosen campaign requirements.",
    "faq": [
      [
        "Should every video be a sales pitch?",
        "No. Tutorials, comparisons and product explanations can help viewers evaluate the offer. The action at the end should match what the video has helped them understand."
      ]
    ],
    "source": "https://business.google.com/us/ad-solutions/youtube-ads/"
  },
  {
    "slug": "pinterest",
    "name": "Pinterest",
    "kind": "social",
    "headline": "Connect visual discovery with useful destination pages.",
    "summary": "Plan Pins, relevant content and paid promotion around the ideas and products your audience is exploring.",
    "organic": [
      "Board and topic planning",
      "Pin creative and destination content",
      "Publishing around relevant buying questions"
    ],
    "paid": [
      "Eligible advertising and shopping campaigns",
      "Creative and destination tests",
      "Budget and conversion reviews"
    ],
    "optimization": [
      "Pin-to-page consistency",
      "Catalogue quality where shopping is used",
      "Creative freshness and useful reporting"
    ],
    "note": "Advertising and shopping features depend on market and account eligibility. Product feeds are included only when agreed.",
    "faq": [
      [
        "Can Pinterest support a service business?",
        "It can be considered when the audience uses visual planning to explore the service. The destination should provide useful detail, not simply repeat the image caption."
      ]
    ],
    "source": "https://business.pinterest.com/"
  }
];
