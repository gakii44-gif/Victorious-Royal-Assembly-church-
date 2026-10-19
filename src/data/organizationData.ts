/**
 * Victorious Royal Assembly International (VRAI)
 * Juba, South Sudan
 * 
 * Centralized Ministry & School Data Configuration
 * Strictly adheres to verified information guidelines:
 * - Unconfirmed data is clearly marked as editable placeholders.
 * - No fabricated enrollment numbers, financial figures, or unverified endorsements.
 */

export interface MinistryItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  keyActivities: string[];
  iconType: 'worship' | 'evangelism' | 'healing' | 'outreach' | 'children';
  photoSlotKey: string;
  photoPlaceholderPath: string;
}

export interface ProjectProfile {
  id: string;
  projectName: string;
  status: 'Proposed' | 'Active' | 'Funded' | 'Completed';
  category: 'Education' | 'Mission & Community' | 'Church & Institutional';
  problemAddressed: string;
  proposedActivities: string[];
  targetBeneficiaries: string;
  estimatedBudget: string;
  fundingRequested: string;
  projectTimeline: string;
  expectedOutcomes: string[];
  contactPerson: string;
  isVerified: boolean;
  photoSlotKey: string;
  photoPlaceholderPath: string;
}

export interface NewsStory {
  id: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  content: string[];
  category: string;
  isVerifiedStory: boolean;
  photoSlotKey: string;
  photoPlaceholderPath: string;
}

export interface LeaderItem {
  name: string;
  namePlaceholder: string;
  role: string;
  title: string;
  bio: string;
  bioPlaceholder: string;
  photoPlaceholder: string;
}

export interface CommunityOutreachItem {
  id: string;
  title: string;
  category: string;
  description: string;
  impactHighlight: string;
  photoPlaceholder: string;
}

export interface SchoolImmediateNeed {
  id: string;
  category: string;
  urgency: string;
  title: string;
  description: string;
  costEstimate: string;
}

export interface SchoolSponsorshipTier {
  id: string;
  period: string;
  title: string;
  amount: string;
  benefits: string[];
}

export interface SchoolGalleryPlaceholder {
  id: string;
  title: string;
  caption: string;
  path: string;
}

export interface PillarItem {
  id: string;
  number: number;
  name: string;
  shortName: string;
  quote: string;
  scripture: {
    reference: string;
    text?: string;
  };
  leader: string;
  role: string;
  focus: string;
  summary: string;
  badge: string;
  iconType: 'church' | 'school' | 'vocational';
  viewTarget: string;
}

export interface DetailedSchool {
  id: string;
  name: string;
  shortName: string;
  level: string;
  location: string;
  motto: string;
  headline: string;
  supportingText: string;
  promiseQuote?: string;
  founderSacrifice?: string;
  overview: string[];
  curriculum: string[];
  stats: {
    enrollmentPlaceholder: string;
    teachingStaffPlaceholder: string;
    classroomsCountPlaceholder: string;
    sponsoredCount?: string;
  };
  immediateNeeds: SchoolImmediateNeed[];
  sponsorshipTiers: SchoolSponsorshipTier[];
  galleryPlaceholders: SchoolGalleryPlaceholder[];
  photoSlotKey: string;
  photoPlaceholderPath: string;
  heroImagePlaceholder: string;
}

export interface OrganizationData {
  orgName: string;
  shortName: string;
  acronym: string;
  tagline: string;
  subTitle: string;
  legalStatusNotice: string;
  identity: string;
  location: {
    city: string;
    state: string;
    country: string;
    district?: string;
    compoundDescription: string;
    directions?: string;
  };
  socialLinks: {
    facebook: string;
    tiktok: string;
  };
  hero: {
    headline: string;
    supportingText: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    photoSlotKey: string;
    photoPlaceholderPath: string;
  };
  welcome: {
    title: string;
    body: string[];
    learnButtonText: string;
  };
  missionAndVision: {
    mission: {
      title: string;
      statement: string;
      isApprovedStatement: boolean;
      scripture?: string;
      leader?: string;
    };
    vision: {
      title: string;
      statement: string;
      isApprovedStatement: boolean;
      scripture?: string;
      leader?: string;
    };
  };
  ministries: MinistryItem[];
  school: {
    name: string;
    shortName: string;
    type: string;
    headline: string;
    supportingText: string;
    overview: string[];
    educationalApproach: string[];
    programsOffered: string[];
    facilitiesAndNeeds: {
      title: string;
      description: string;
      status: string;
    }[];
    photoSlotKey: string;
    photoPlaceholderPath: string;
    gallerySlots: {
      id: string;
      title: string;
      description: string;
      path: string;
      slotKey: string;
    }[];
  };
  threePillars: PillarItem[];
  schools: {
    heritageAcademy: DetailedSchool;
    vocationalSchool: DetailedSchool;
  };
  missionsAndOutreach: {
    overview: string;
    focusAreas: string[];
    photoSlotKey: string;
    photoPlaceholderPath: string;
  };
  leadership: LeaderItem[];
  communityOutreach: CommunityOutreachItem[];
  donorAccountDetails: {
    bankNamePlaceholder: string;
    usdAccountNoPlaceholder: string;
    swiftBicPlaceholder: string;
    branchPlaceholder: string;
    accountTitle: string;
    accountNamePlaceholder: string;
    correspondentBank: string;
  };
  partnership: {
    headline: string;
    supportingText: string;
    categories: {
      id: string;
      title: string;
      description: string;
      opportunities: string[];
      ctaText: string;
    }[];
    projectProfiles: ProjectProfile[];
  };
  newsStories: NewsStory[];
  callToAction: {
    headline: string;
    supportingText: string;
    contactButtonText: string;
    partnerButtonText: string;
  };
  contact: {
    emailPlaceholder: string;
    donorLiaisonEmailPlaceholder: string;
    phone: string;
    phoneSecondary: string;
    phoneAlternate: string;
    whatsapp: string;
    phonePlaceholder: string;
    officeHours: string;
    addressPlaceholder: string;
    serviceSchedule: {
      title: string;
      time: string;
      description?: string;
    }[];
  };
  donationConfig: {
    isConfigured: boolean;
    noticeText: string;
    frequencies: string[];
    allocationOptions: {
      id: string;
      name: string;
      description: string;
    }[];
  };
}

export const organizationData: OrganizationData = {
  orgName: "Victorious Royal Assembly International",
  shortName: "Victorious Royal Assembly",
  acronym: "VRAI",
  tagline: "A.k.a Word of Faith Healing & Deliverance Ministry Int’l",
  subTitle: "A.k.a Word of Faith Healing & Deliverance Ministry Int’l",
  legalStatusNotice: "Registered Faith-Based Mission & Educational Institution in Juba, South Sudan [Official Reg No. pending verification]. Transparent financial auditing provided to institutional partners.",
  identity: "Christian missionary church and educational ministry",
  
  location: {
    city: "Juba",
    state: "Central Equatoria State",
    country: "South Sudan",
    district: "Tongping",
    compoundDescription: "Tongping (Former Nilepet Road), Juba, South Sudan",
    directions: "Tongping, Former Nilepet Road, Juba, Central Equatoria State, Republic of South Sudan",
  },

  socialLinks: {
    facebook: "https://www.facebook.com/share/19ZywCQkPt/",
    tiktok: "https://www.tiktok.com/@victorious.royal4?_r=1&_t=ZS-9AZvd6ASlCn",
  },

  hero: {
    headline: "Transforming Lives Through Faith, Education & Mission.",
    supportingText: "Welcome to Victorious Royal Assembly International, a Christian missionary ministry based in Juba, South Sudan. Discover our faith, our educational mission, and opportunities to partner with us in serving communities.",
    primaryButtonText: "Discover Our Mission",
    secondaryButtonText: "Partner With Us",
    photoSlotKey: "home-hero",
    photoPlaceholderPath: "/assets/church/services/hero-church.svg",
  },

  welcome: {
    title: "Welcome to Victorious Royal Assembly International (VRAI)",
    body: [
      "Victorious Royal Assembly International is a Christian missionary church rooted in the heart of Juba, South Sudan. Under the divine mandate of Word of Faith, Healing, and Deliverance, our congregation gathers to worship the living God, preach the uncompromised Gospel of Jesus Christ, and minister spiritual freedom and wholeness to all people.",
      "This website serves as an official welcoming portal for visitors worldwide to learn about our church, explore our educational work through Victorious Heritage Primary School, discover frontline community outreach, and connect directly with our pastoral leadership and mission coordinators.",
    ],
    learnButtonText: "Learn About Our Church",
  },

  missionAndVision: {
    mission: {
      title: "Our Mission",
      statement: "At Victorious Royal Assembly International Church, we are committed to sharing God's love by transforming lives through faith, education, and community service. Our mission is to raise godly leaders and bring hope to every generation. (Matthew 5:16)",
      isApprovedStatement: true,
      scripture: "Matthew 5:16",
      leader: "Dr. Apostle Andrew Abubakar (G.O)",
    },
    vision: {
      title: "Our Vision",
      statement: "To raise godly leaders and bring hope to every generation across South Sudan and beyond through vibrant faith in Christ, inclusive foundational and adult education, and dignified community vocational empowerment.",
      isApprovedStatement: true,
      scripture: "Proverbs 22:6 & Colossians 3:23",
      leader: "Dr. Apostle Andrew Abubakar",
    },
  },

  ministries: [
    {
      id: "worship-prayer",
      name: "Worship & Prayer",
      subtitle: "Heartfelt Adoration & Intercession",
      description: "Dedicated to cultivating fervent prayer altars, weekly congregational worship, and prayer watches that intercede for peace and revival in South Sudan.",
      keyActivities: [
        "Sunday Morning Congregational Services",
        "Midweek Believers' Prayer & Bible Study",
        "Community & National Intercessory Vigils",
      ],
      iconType: "worship",
      photoSlotKey: "ministry-worship",
      photoPlaceholderPath: "/assets/church/services/sunday-worship.svg",
    },
    {
      id: "evangelism-missions",
      name: "Evangelism & Missions",
      subtitle: "Reaching the Unreached with the Gospel",
      description: "Carrying the good news of Jesus Christ through street evangelism, open-air crusades, and rural missionary journeys throughout Central Equatoria.",
      keyActivities: [
        "Grassroots Neighborhood Witnessing",
        "Missionary Outreach to Displaced Communities",
        "New Believer Discipleship & Baptism",
      ],
      iconType: "evangelism",
      photoSlotKey: "ministry-evangelism",
      photoPlaceholderPath: "/assets/church/services/evangelism.svg",
    },
    {
      id: "healing-deliverance",
      name: "Healing & Deliverance Ministry",
      subtitle: "Freedom and Wholeness in Christ",
      description: "The core foundational ministry (Word of Faith Healing & Deliverance) ministering prayer for the sick, brokenhearted, and spiritually oppressed.",
      keyActivities: [
        "Special Healing & Anointing Services",
        "One-on-One Pastoral Counseling & Deliverance",
        "Trauma Recovery & Spiritual Rehabilitation",
      ],
      iconType: "healing",
      photoSlotKey: "ministry-healing",
      photoPlaceholderPath: "/assets/church/services/anointing-service.svg",
    },
    {
      id: "community-outreach",
      name: "Community Outreach",
      subtitle: "Faith Expressed Through Good Works",
      description: "Providing compassionate relief to vulnerable families, widows, orphans, and underserved neighbors through emergency aid, food distribution, and clean water access.",
      keyActivities: [
        "Widows & Single Mothers Fellowship Support",
        "Nutritional Food Basket Distribution",
        "Community Health Hygiene & Medical Camps",
      ],
      iconType: "outreach",
      photoSlotKey: "ministry-outreach",
      photoPlaceholderPath: "/assets/church/outreach/womens-fellowship.svg",
    },
    {
      id: "childrens-ministry",
      name: "Children's Ministry",
      subtitle: "Nurturing God-Fearing Generations",
      description: "Guiding young children through age-appropriate biblical teaching, songs, scripture memorization, and moral mentorship every week.",
      keyActivities: [
        "Weekly Sunday School & Bible Club",
        "Vacation Bible School & Sports Outings",
        "Youth Fellowship & Leadership Circles",
      ],
      iconType: "children",
      photoSlotKey: "ministry-children",
      photoPlaceholderPath: "/assets/church/outreach/childrens-ministry.svg",
    },
  ],

  school: {
    name: "Victorious Heritage Primary School",
    shortName: "Heritage Primary School",
    type: "Christian Primary & Early Childhood Institution",
    headline: "Building Brighter Futures Through Education.",
    supportingText: "Discover the educational work of Victorious Heritage Primary School and learn how partnerships can help strengthen learning opportunities for children.",
    overview: [
      "Victorious Heritage Primary School was established as the educational arm of Victorious Royal Assembly International to address the acute educational deficit in Juba, South Sudan.",
      "In a nation where millions of boys and girls lack access to consistent, safe classrooms, Victorious Heritage Primary School provides early childhood education and foundational primary classes grounded in Christian discipline, literacy, and community care.",
    ],
    educationalApproach: [
      "Foundational Literacy & Numeracy: Comprehensive instruction in English, Mathematics, and reading.",
      "Christian Character & Ethics: Daily devotional assemblies, moral training, and mutual respect across tribal backgrounds.",
      "Holistic Pupil Welfare: Integrating nutritional meal support and safe drinking water to protect student attendance.",
      "South Sudan Curriculum Alignment: Preparing children for national academic transitions and lifelong learning.",
    ],
    programsOffered: [
      "Early Childhood Education (Nursery & Kindergarten)",
      "Lower Primary Classes (Primary 1 – Primary 4)",
      "Upper Primary Classes (Primary 5 – Primary 8)",
      "Daily Morning Assembly & Scripture Memory",
      "Creative Arts, Music & Physical Recreation",
    ],
    facilitiesAndNeeds: [
      {
        title: "Classroom Weatherproofing & Expansion",
        description: "Need for reinforced roofing, secure doors, and cement flooring to withstand the intense South Sudan rainy seasons.",
        status: "Proposed Project",
      },
      {
        title: "Two-Seater Wooden Pupil Desks",
        description: "Replacing temporary bench seating with durable wooden study desks built by local craftsmen.",
        status: "High Need",
      },
      {
        title: "Approved Curriculum Textbooks & Readers",
        description: "Standard South Sudan curriculum textbooks for English, Mathematics, Science, and Social Studies.",
        status: "High Need",
      },
      {
        title: "Pupil Daily Meal & Clean Water Support",
        description: "Sustainable porridge and clean water supply point to eliminate midday hunger and waterborne sickness.",
        status: "Urgent Priority",
      },
    ],
    photoSlotKey: "school-hero",
    photoPlaceholderPath: "/assets/schools/heritage-academy/hero-heritage.svg",
    gallerySlots: [
      {
        id: "sch-1",
        title: "Morning Assembly & Pupils in Uniform",
        description: "Pupils gathering for morning devotion and national anthem.",
        path: "/assets/schools/heritage-academy/morning-assembly.svg",
        slotKey: "school-assembly",
      },
      {
        id: "sch-2",
        title: "Classroom Instruction & Reading",
        description: "Pupils practicing handwriting and blackboard exercises.",
        path: "/assets/schools/heritage-academy/classroom-reading.svg",
        slotKey: "school-classroom",
      },
      {
        id: "sch-3",
        title: "Pupil Nutrition & Recess",
        description: "Students sharing clean water and recreation during school break.",
        path: "/assets/schools/heritage-academy/school-nutrition.svg",
        slotKey: "school-meals",
      },
    ],
  },

  missionsAndOutreach: {
    overview: "Victorious Royal Assembly International is fundamentally a missionary church. We believe the local church must be salt and light in times of hardship. Our outreach programs reach displaced families, widows, vulnerable orphans, and communities in need of reconciliation and spiritual restoration.",
    focusAreas: [
      "Grassroots Community Relief: Providing food relief, soap, blankets, and essential household support during crises.",
      "Women & Widows Support: Spiritual fellowship, trauma comfort circles, and practical empowerment initiatives.",
      "Peace-Building Fellowships: Bringing youth from diverse ethnic groups together in Christian unity and prayer.",
      "Academic Convocations: Honoring teachers, graduates, and community servants with formal academic recognition.",
    ],
    photoSlotKey: "outreach-hero",
    photoPlaceholderPath: "/assets/church/outreach/convocation-ceremony.svg",
  },

  partnership: {
    headline: "Partner With Us to Make a Lasting Difference.",
    supportingText: "Join us in exploring opportunities to strengthen faith, expand educational opportunities, and support meaningful community initiatives in Juba, South Sudan.",
    categories: [
      {
        id: "part-education",
        title: "Education Partnerships",
        description: "Opportunities to discuss school resources, learning materials, teacher support, and educational development for Victorious Heritage Primary School.",
        opportunities: [
          "Classroom Desk & Textbook Sponsorship",
          "Teacher Professional Stipend Support",
          "Pupil Nutrition & Safe Drinking Water",
          "School Building Infrastructure Grants",
        ],
        ctaText: "Discuss Education Partnership",
      },
      {
        id: "part-mission",
        title: "Mission & Community Partnerships",
        description: "Opportunities to collaborate on verified missionary, pastoral training, and community relief initiatives across Juba.",
        opportunities: [
          "Joint Evangelical & Discipleship Missions",
          "Community Medical & Health Clinics",
          "Widow & Vulnerable Family Food Baskets",
          "Displaced Persons Compassion Relief",
        ],
        ctaText: "Discuss Mission Partnership",
      },
      {
        id: "part-institutional",
        title: "Church & Organizational Partnerships",
        description: "Opportunities for partner churches, mission agencies, Christian foundations, and international NGOs to connect with VRAI on formal long-term agreements.",
        opportunities: [
          "Church-to-Church Sisterhood Twinning",
          "Foundation Capital Expenditure Grants",
          "NGO Field Implementation Collaboration",
          "Visiting Pastoral & Medical Mission Teams",
        ],
        ctaText: "Connect With Leadership",
      },
    ],
    projectProfiles: [
      {
        id: "proj-heritage-classrooms",
        projectName: "Victorious Heritage Primary School — Classroom Weatherproofing & Desks",
        status: "Proposed",
        category: "Education",
        problemAddressed: "Overcrowding and seasonal rain intrusion disrupt daily learning, and pupils currently share insufficient seating benches.",
        proposedActivities: [
          "Construct 4 weatherproof classroom blocks with durable tin roofing.",
          "Procure 120 locally manufactured dual wooden pupil desks.",
          "Supply comprehensive curriculum textbook sets for Grades 1 through 6.",
        ],
        targetBeneficiaries: "Approximately 300 primary school pupils and 12 instructional staff in Juba.",
        estimatedBudget: "$22,500 USD [Editable budget placeholder]",
        fundingRequested: "$22,500 USD [Seeking international grant or church partner]",
        projectTimeline: "4 to 6 months from funding confirmation",
        expectedOutcomes: [
          "100% Weatherproof classrooms safe during rainy seasons.",
          "Elimination of floor seating for all enrolled children.",
          "Increased pupil retention and literacy test scores.",
        ],
        contactPerson: "Education Partnership Secretariat, Juba, South Sudan",
        isVerified: false,
        photoSlotKey: "project-classrooms",
        photoPlaceholderPath: "/assets/schools/heritage-academy/classroom-expansion.svg",
      },
      {
        id: "proj-pupil-nutrition",
        projectName: "Heritage School Clean Water Point & Daily Meal Initiative",
        status: "Proposed",
        category: "Education",
        problemAddressed: "Food insecurity in Juba causes student fatigue and classroom absenteeism, while lack of on-site clean water risks waterborne infections.",
        proposedActivities: [
          "Establish an on-site rainwater harvesting and gravity sand filtration system.",
          "Provide daily morning porridge and lunchtime sustenance for enrolled pupils.",
          "Conduct monthly pupil hygiene and sanitation workshops.",
        ],
        targetBeneficiaries: "All enrolled children and neighborhood early learners.",
        estimatedBudget: "$8,500 USD annual budget [Editable placeholder]",
        fundingRequested: "$8,500 USD [Seeking donor or foundation funding]",
        projectTimeline: "12-month pilot program",
        expectedOutcomes: [
          "95%+ attendance consistency through guaranteed daily nutrition.",
          "Zero reported cholera or dysentery cases from school water.",
        ],
        contactPerson: "Welfare & Nutrition Coordinator, Juba",
        isVerified: false,
        photoSlotKey: "project-nutrition",
        photoPlaceholderPath: "/assets/schools/heritage-academy/school-nutrition.svg",
      },
      {
        id: "proj-widows-relief",
        projectName: "Community Widow & Vulnerable Family Food Security Outreach",
        status: "Proposed",
        category: "Mission & Community",
        problemAddressed: "Conflict-affected single mothers and elderly widows face extreme inflation and lack regular access to basic food staples.",
        proposedActivities: [
          "Monthly distribution of dry food rations (maize flour, beans, cooking oil, salt).",
          "Trauma healing, prayer circles, and mutual support fellowships.",
          "Small enterprise mentorship circles for sustainable home baking or crafts.",
        ],
        targetBeneficiaries: "80 vulnerable widow-headed households in Juba.",
        estimatedBudget: "$6,000 USD [Editable placeholder]",
        fundingRequested: "$6,000 USD [Seeking NGO or church partnership]",
        projectTimeline: "Ongoing quarterly cycles",
        expectedOutcomes: [
          "Immediate hunger relief for 80 vulnerable family units.",
          "Strengthened community resilience and spiritual comfort.",
        ],
        contactPerson: "Community Outreach Director, Juba",
        isVerified: false,
        photoSlotKey: "project-widows",
        photoPlaceholderPath: "/assets/church/outreach/womens-fellowship.svg",
      },
    ],
  },

  newsStories: [
    {
      id: "story-school-term-expansion",
      title: "Victorious Heritage Primary School Welcomes Pupils for New Academic Term",
      date: "October 2026",
      author: "School Administration",
      summary: "Teachers, parents, and church leadership gather to commence classes with prayer, welcoming enrolled children back to the classroom.",
      content: [
        "The new academic term has commenced at Victorious Heritage Primary School in Juba, South Sudan.",
        "Pupils arrived eager to continue their studies in English, Mathematics, and General Science. The morning assembly was led in prayer by church pastors, blessing the children, teachers, and school leadership.",
        "With growing interest from neighboring families, the school administration highlighted the critical need for additional classroom desks, textbooks, and infrastructure support from international partners.",
      ],
      category: "Education",
      isVerifiedStory: false,
      photoSlotKey: "story-school",
      photoPlaceholderPath: "/assets/schools/heritage-academy/morning-assembly.svg",
    },
    {
      id: "story-annual-convocation",
      title: "Academic Convocation & Leadership Service Celebrated in Juba",
      date: "September 2026",
      author: "VRAI Secretariat",
      summary: "A solemn service of celebration honoring church leaders, educators, and community servants adorned in formal academic regalia.",
      content: [
        "Victorious Royal Assembly International hosted an inspiring academic convocation ceremony at the church auditorium in Juba.",
        "Ministers, educators, and community workers gathered in academic doctoral and master's gowns to affirm the dignity of learning and Christian scholarship.",
        "The Senior Pastor reiterated the church's lifelong commitment to lifting South Sudan through prayer, the Word of Faith, and accessible education for every child.",
      ],
      category: "Ministry & Convocations",
      isVerifiedStory: false,
      photoSlotKey: "story-convocation",
      photoPlaceholderPath: "/assets/church/outreach/convocation-ceremony.svg",
    },
    {
      id: "story-community-fellowship",
      title: "Women's Fellowship Gathers for Prayer and Community Outreach",
      date: "August 2026",
      author: "Women's Fellowship",
      summary: "Women leaders dressed in vibrant church anniversary attire meet for intercession, mutual care, and family assistance planning.",
      content: [
        "The women of Victorious Royal Assembly International gathered in custom church fabric garments for their monthly prayer fellowship.",
        "Beyond prayer, the fellowship organized relief packs for vulnerable mothers in neighboring quarters of Juba.",
        "The ministry continues to serve as a beacon of love, unity, and Christian fellowship for women across all walks of life.",
      ],
      category: "Outreach",
      isVerifiedStory: false,
      photoSlotKey: "story-women",
      photoPlaceholderPath: "/assets/church/outreach/womens-fellowship.svg",
    },
  ],

  callToAction: {
    headline: "Be Part of the Mission.",
    supportingText: "Connect with Victorious Royal Assembly International to learn more about our ministry, educational work, and opportunities to serve together.",
    contactButtonText: "Contact the Church",
    partnerButtonText: "Explore Partnerships",
  },

  contact: {
    emailPlaceholder: "info@vraisouthsudan.org",
    donorLiaisonEmailPlaceholder: "partnerships@vraisouthsudan.org",
    phone: "+211 (0) 925 332 626",
    phoneSecondary: "+211 (0) 929 522 922",
    phoneAlternate: "+211 (0) 922 221 179",
    whatsapp: "+211 925 332 626",
    phonePlaceholder: "+211 (0) 925 332 626 / +211 (0) 929 522 922",
    officeHours: "Monday – Friday: 8:30 AM – 5:00 PM CAT · Sunday Services: 8:00 AM & 10:30 AM · Wednesday: 5:00 PM",
    addressPlaceholder: "Tongping (Former Nilepet Road), Juba, Central Equatoria State, Republic of South Sudan",
    serviceSchedule: [
      {
        title: "Sunday Celebration & Word of Faith Service",
        time: "1st Service: 8:00 AM · 2nd Service: 10:30 AM CAT",
        description: "Spirit-filled praise, preaching of the Word of Faith, healing, and salvation in Christ.",
      },
      {
        title: "Wednesday Mid-Week Healing, Deliverance & Communion",
        time: "5:00 PM – 7:30 PM CAT",
        description: "Altar prayer, communion, prophetic ministration, and healing miracles.",
      },
      {
        title: "Friday Altar of Fire Vigil",
        time: "9:00 PM – Midnight CAT",
        description: "Intercessory warfare, revival, and spiritual breakthrough prayers for families and South Sudan.",
      },
      {
        title: "Monthly Women's Fellowship & Mothers Prayer",
        time: "1st Saturday of Every Month · 10:00 AM CAT",
        description: "Spiritual empowerment, widow care, mothers intercession, and fellowship.",
      },
    ],
  },

  donationConfig: {
    isConfigured: false,
    noticeText: "Official online donation processing and direct wire details will be published here upon verification and authorization by the Victorious Royal Assembly International leadership board. For now, please use our Partnership Enquiry form to discuss your support.",
    frequencies: ["One-Time Donation", "Monthly Recurring Support"],
    allocationOptions: [
      {
        id: "education",
        name: "Victorious Heritage Primary School",
        description: "Classroom construction, pupil desks, textbooks, teacher stipends, and school meals.",
      },
      {
        id: "missions",
        name: "Evangelism & Missionary Outreach",
        description: "Community evangelism, rural missions, and pastoral discipleship in South Sudan.",
      },
      {
        id: "general",
        name: "General Ministry & Community Relief",
        description: "Church facilities, prayer conferences, widow assistance, and emergency relief.",
      },
    ],
  },

  donorAccountDetails: {
    bankNamePlaceholder: "[Official Bank in Juba, e.g., Stanbic Bank / Ecobank South Sudan — Update in organizationData.ts]",
    usdAccountNoPlaceholder: "[USD Foreign Currency Account No. — Update with verified details]",
    swiftBicPlaceholder: "[SWIFT / BIC Code — Update with verified details]",
    branchPlaceholder: "Main Branch, Juba, Republic of South Sudan",
    accountTitle: "Victorious Royal Assembly International",
    accountNamePlaceholder: "Victorious Royal Assembly International",
    correspondentBank: "[Correspondent Bank details for international transfers — Update as needed]",
  },

  threePillars: [
    {
      id: "pillar-church",
      number: 1,
      name: "Victorious Royal Assembly International Church",
      shortName: "Victorious Royal Assembly Church",
      quote: "At Victorious Royal Assembly International Church, we are committed to sharing God's love by transforming lives through faith, education, and community service. Our mission is to raise godly leaders and bring hope to every generation.",
      scripture: {
        reference: "Matthew 5:16",
        text: "In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.",
      },
      leader: "Dr. Apostle Andrew Abubakar (G.O)",
      role: "General Overseer & Spiritual Father",
      focus: "Faith, Word of Faith Preaching, Spiritual Deliverance, Godly Leadership & Generational Hope",
      summary: "The spiritual cornerstone of the entire ministry in Juba, South Sudan. Raising godly leaders through sound biblical preaching, fervent prayer altars, healing, and holistic deliverance.",
      badge: "Pillar 1 · The Mother Church",
      iconType: "church",
      viewTarget: "home",
    },
    {
      id: "pillar-school",
      number: 2,
      name: "Victorious Heritage Model Nursery & Primary School & Adult Education Centre",
      shortName: "Victorious Heritage School & Adult Education",
      quote: "We believe that no child or adult should be denied the opportunity to learn. Through God's grace, we provide quality education and support vulnerable learners, with over 30% of our pupils fully funded through our ministry and partners.",
      scripture: {
        reference: "Proverbs 22:6",
        text: "Start children off on the way they should go, and even when they are old they will not turn from it.",
      },
      leader: "Dr. Apostle Andrew Abubakar",
      role: "Founder & Educational Patron",
      focus: "Nursery, Primary & Adult Foundational Literacy, Character & 30%+ Vulnerable Learner Sponsorship",
      summary: "Nurturing 120 pupils with foundational literacy, arithmetic, daily meals, Christian values, and expanding to adult education so no generation is left illiterate.",
      badge: "Pillar 2 · Foundational & Adult Education",
      iconType: "school",
      viewTarget: "heritage-academy",
    },
    {
      id: "pillar-vocational",
      number: 3,
      name: "Victorious Royal Vocational Training & Community Empowerment Centre",
      shortName: "Victorious Royal Vocational Centre",
      quote: "Our vocational training programme exists to empower individuals with practical skills, restore dignity, and create opportunities for a better future. When we equip one person, we uplift an entire community.",
      scripture: {
        reference: "Colossians 3:23",
        text: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
      },
      leader: "Dr. Apostle Andrew Abubakar",
      role: "Visionary & Community Patron",
      focus: "Hands-on Practical Trades, Self-Reliance, Tailoring, Solar/Electrical, Carpentry & Toolkits",
      summary: "Empowering youths, widows, and school-leavers with high-demand practical trades that restore economic dignity, launch sustainable local enterprises, and uplift all of Juba.",
      badge: "Pillar 3 · Technical Skills & Empowerment",
      iconType: "vocational",
      viewTarget: "vocational-school",
    },
  ],

  schools: {
    heritageAcademy: {
      id: "heritage-academy",
      name: "Victorious Heritage Model Nursery & Primary School & Adult Education Centre",
      shortName: "Victorious Heritage School & Adult Education",
      level: "Nursery, Primary & Adult Foundational Education",
      location: "Juba, Central Equatoria, South Sudan",
      motto: "Knowledge is Victory",
      headline: "Every child deserves an opportunity to learn.",
      supportingText: "We believe that no child or adult should be denied the opportunity to learn. Through God's grace, we provide quality education and support vulnerable learners, with over 30% of our pupils fully funded through our ministry and partners.",
      promiseQuote: "\"We believe that no child or adult should be denied the opportunity to learn. Through God's grace, we provide quality education and support vulnerable learners, with over 30% of our pupils fully funded through our ministry and partners.\" — Proverbs 22:6 (Dr. Apostle Andrew Abubakar)",
      founderSacrifice: "Through the vision and sacrifice of Dr. Apostle Andrew Abubakar and Victorious Royal Assembly International Church, we continue to educate, feed, and care for vulnerable children across Juba, South Sudan — one classroom, one uniform, one meal at a time.",
      overview: [
        "Victorious Heritage Model Nursery & Primary School is home to 120 pupils in Juba, South Sudan. About 30% of them — roughly 36 children — come from families who simply cannot afford school fees, uniforms, meals, or learning materials, and are fully carried by the school.",
        "Even among the families who do manage to pay, most only get there after a serious, often painful struggle. Yet every child walks through our gates every morning, because we believe poverty should never determine a child's future.",
        "Through the vision and sacrifice of Dr. Apostle Andrew Abubakar and Victorious Royal Assembly International Church, we continue to educate, feed, and care for vulnerable children across Juba, South Sudan — one classroom, one uniform, one meal at a time.",
      ],
      curriculum: [
        "English Language, Phonics & Reading",
        "Mathematics & Practical Numeracy",
        "General Science & Environmental Studies",
        "Social Studies, South Sudan Geography",
        "Christian Religious Education (CRE)",
        "Creative Arts, Music & Physical Health",
      ],
      stats: {
        enrollmentPlaceholder: "120 Enrolled Pupils",
        teachingStaffPlaceholder: "Qualified Teachers & Caregivers",
        classroomsCountPlaceholder: "Nursery & Primary Learning Rooms",
        sponsoredCount: "36 Fully Supported Children (30%)",
      },
      immediateNeeds: [
        {
          id: "hn-1",
          category: "Infrastructure",
          urgency: "Critical",
          title: "Classroom Weatherproofing & Concrete Floors",
          description: "Reinforcing roofs, eaves, and concrete screed flooring across 4 classroom blocks to prevent flooding during torrential South Sudan rains.",
          costEstimate: "$6,800 USD",
        },
        {
          id: "hn-2",
          category: "Furnishing",
          urgency: "High",
          title: "Dual Wooden Pupil Desks (60 Units)",
          description: "Replacing temporary bench seating with sturdy two-child wooden writing desks built by local Juba craftsmen.",
          costEstimate: "$3,600 USD",
        },
        {
          id: "hn-3",
          category: "Textbooks",
          urgency: "High",
          title: "Curriculum Textbook Sets & Library Books",
          description: "Procuring South Sudan Ministry of General Education approved curriculum textbooks for Grades 1 through 8.",
          costEstimate: "$2,400 USD",
        },
        {
          id: "hn-4",
          category: "Pupil Welfare",
          urgency: "Urgent",
          title: "Daily Nutrition Porridge & Safe Water Point",
          description: "Providing morning energy porridge and clean borehole drinking water for 300 pupils for an entire academic term.",
          costEstimate: "$4,200 USD / Term",
        },
      ],
      sponsorshipTiers: [
        {
          id: "ht-1",
          period: "Termly Sponsor",
          title: "Pupil Term Tuition & Meal",
          amount: "$45 / Term",
          benefits: [
            "Full tuition coverage for one term",
            "Daily nutritious morning porridge",
            "Termly academic progress card",
            "Direct student photographic update",
          ],
        },
        {
          id: "ht-2",
          period: "Annual Sponsor",
          title: "Full Year Education & Uniform",
          amount: "$150 / Year",
          benefits: [
            "Full 3-term academic tuition",
            "Two sets of tailored school uniforms",
            "Full curriculum textbook & stationery pack",
            "Direct correspondence letter from pupil",
          ],
        },
        {
          id: "ht-3",
          period: "Classroom Benefactor",
          title: "Classroom Block Patron",
          amount: "$500 / Project",
          benefits: [
            "Complete desk sets for 10 pupils",
            "Classroom library book basket",
            "Commemorative wooden patron plaque",
            "Detailed impact & expenditure report",
          ],
        },
      ],
      galleryPlaceholders: [
        {
          id: "hg-1",
          title: "Morning Assembly & Devotion",
          caption: "Pupils gathered for worship, praise, and morning announcements.",
          path: "/assets/schools/heritage-academy/morning-assembly.svg",
        },
        {
          id: "hg-2",
          title: "Classroom Instruction & Reading",
          caption: "Pupils engaged in English literacy, math, and science lessons.",
          path: "/assets/schools/heritage-academy/classroom-reading.svg",
        },
        {
          id: "hg-3",
          title: "Pupil Nutrition & Recess",
          caption: "Children sharing midday nourishment and outdoor recreation.",
          path: "/assets/schools/heritage-academy/school-nutrition.svg",
        },
      ],
      photoSlotKey: "school-hero",
      photoPlaceholderPath: "/assets/schools/heritage-academy/hero-heritage.svg",
      heroImagePlaceholder: "/assets/schools/heritage-academy/hero-heritage.svg",
    },

    vocationalSchool: {
      id: "vocational-school",
      name: "Victorious Royal Vocational Training & Community Empowerment Centre",
      shortName: "Victorious Royal Vocational Centre",
      level: "Vocational & Technical Trades (Youth & Adult)",
      location: "Juba, Central Equatoria, South Sudan",
      motto: "Equipping Individuals with Practical Skills & Uplifting Communities",
      headline: "Equipping Individuals with Practical Skills, Restoring Dignity & Creating Opportunities.",
      supportingText: "Our vocational training programme exists to empower individuals with practical skills, restore dignity, and create opportunities for a better future. When we equip one person, we uplift an entire community.",
      promiseQuote: "\"Our vocational training programme exists to empower individuals with practical skills, restore dignity, and create opportunities for a better future. When we equip one person, we uplift an entire community.\" — Colossians 3:23 (Dr. Apostle Andrew Abubakar)",
      founderSacrifice: "Through the leadership of Dr. Apostle Andrew Abubakar and Victorious Royal Assembly International, we equip youth and community members with marketable skills and dignity.",
      overview: [
        "South Sudan relies heavily on imported goods and foreign technical labor. Victorious Vocational School trains local South Sudanese youths, conflict-affected women, and former combatants in practical trades so they can establish sustainable small enterprises right here in Juba.",
        "Our curriculum pairs intensive technical workshop hours with Christian ethics, business financial literacy, and entrepreneurship mentorship.",
      ],
      curriculum: [
        "Tailoring & Garment Construction",
        "Carpentry & Furniture Making",
        "Solar & Electrical Installation",
        "Computer Literacy & Digital Skills",
        "Catering & Commercial Food Preparation",
      ],
      stats: {
        enrollmentPlaceholder: "[85 Enrolled Trainees — Update with cohort registry]",
        teachingStaffPlaceholder: "[6 Master Craftsmen Instructors — Update with roster]",
        classroomsCountPlaceholder: "[4 Practical Workshop Sheds — Expansion & tools needed]",
      },
      immediateNeeds: [
        {
          id: "vn-1",
          category: "Tailoring Dept",
          urgency: "Critical",
          title: "Heavy-Duty Manual Sewing Machines (15 Units)",
          description: "Sturdy treadle sewing machines operable without volatile electrical grid power for youth garment training.",
          costEstimate: "$3,750 USD",
        },
        {
          id: "vn-2",
          category: "Solar & Electrical",
          urgency: "High",
          title: "Solar Technician Training Bench & Meters",
          description: "Photovoltaic test panels, multimeters, charge controllers, and inverters for off-grid power training.",
          costEstimate: "$4,500 USD",
        },
        {
          id: "vn-3",
          category: "Carpentry Dept",
          urgency: "High",
          title: "Woodworking Hand Tool & Joinery Sets",
          description: "Planers, chisels, saws, clamps, and workbenches for apprentice carpenters crafting desks and doors.",
          costEstimate: "$2,800 USD",
        },
        {
          id: "vn-4",
          category: "Graduate Launch",
          urgency: "Urgent",
          title: "Graduate Starter Toolkit Fund (20 Toolkits)",
          description: "Equipping graduating artisans with personal toolkits upon graduation so they start earning immediately.",
          costEstimate: "$5,000 USD",
        },
      ],
      sponsorshipTiers: [
        {
          id: "vt-1",
          period: "Course Sponsor",
          title: "Trainee Term Tuition & Materials",
          amount: "$75 / Course",
          benefits: [
            "Full 3-month course tuition & workshop supplies",
            "Personal safety gear and protective apron",
            "Mid-course project evaluation photo",
            "Student biographical profile",
          ],
        },
        {
          id: "vt-2",
          period: "Launch Sponsor",
          title: "Trainee Sponsorship + Starter Toolkit",
          amount: "$250 / Graduate",
          benefits: [
            "Full course training fees covered",
            "Complete personal starter artisan toolkit upon graduation",
            "Official vocational completion certificate",
            "Graduation portrait and enterprise launch update",
          ],
        },
        {
          id: "vt-3",
          period: "Workshop Benefactor",
          title: "Department Workshop Station Patron",
          amount: "$750 / Station",
          benefits: [
            "Fully outfitted technical workbench with equipment",
            "Named dedication on the workshop training station",
            "Quarterly apprentice progress dossier",
            "Direct connection with department head instructor",
          ],
        },
      ],
      galleryPlaceholders: [
        {
          id: "vg-1",
          title: "Tailoring & Garment Workshop",
          caption: "Trainees learning garment pattern cutting and machine sewing.",
          path: "/assets/schools/vocational-school/tailoring-workshop.svg",
        },
        {
          id: "vg-2",
          title: "Carpentry & Joinery Apprentice Station",
          caption: "Youth crafting sturdy wooden study desks and cabinetry.",
          path: "/assets/schools/vocational-school/carpentry-workshop.svg",
        },
        {
          id: "vg-3",
          title: "Solar Technician Practical Assembly",
          caption: "Apprentices wiring charge controllers and solar storage arrays.",
          path: "/assets/schools/vocational-school/solar-electrical.svg",
        },
      ],
      photoSlotKey: "vocational-hero",
      photoPlaceholderPath: "/assets/schools/vocational-school/hero-vocational.svg",
      heroImagePlaceholder: "/assets/schools/vocational-school/hero-vocational.svg",
    },
  },

  leadership: [
    {
      name: "Dr. Apostle Andrew Abubakar",
      namePlaceholder: "Dr. Apostle Andrew Abubakar",
      role: "Senior Pastor, General Overseer & School Founder",
      title: "Spiritual Leader, Apostle & Founder",
      bio: "Founding visionary of Victorious Royal Assembly International and Victorious Heritage Model Nursery & Primary School. Preaching the Word of Faith, Healing, and Deliverance, and pioneering holistic basic education, child feeding, and vocational training across Juba, South Sudan.",
      bioPlaceholder: "Founding visionary of Victorious Royal Assembly International and Victorious Heritage Model Nursery & Primary School. Preaching the Word of Faith, Healing, and Deliverance, and pioneering holistic basic education, child feeding, and vocational training across Juba, South Sudan.",
      photoPlaceholder: "/assets/church/leadership/senior-pastor.svg",
    },
    {
      name: "[Associate Pastor Name — Update in organizationData.ts]",
      namePlaceholder: "[Associate Pastor Name — Update in organizationData.ts]",
      role: "Associate Pastor & Director of Missions",
      title: "Missionary & Evangelism Coordinator",
      bio: "Overseeing grassroots community evangelism, pastoral counseling, prayer networks, and regional outreach throughout Central Equatoria.",
      bioPlaceholder: "Overseeing grassroots community evangelism, pastoral counseling, prayer networks, and regional outreach throughout Central Equatoria.",
      photoPlaceholder: "/assets/church/leadership/associate-pastor.svg",
    },
    {
      name: "[Head Teacher Name — Update in organizationData.ts]",
      namePlaceholder: "[Head Teacher Name — Update in organizationData.ts]",
      role: "Head Administrator, Victorious Heritage Model Academy",
      title: "Primary Education Director",
      bio: "Leading academic instruction, teacher supervision, South Sudan curriculum standards, and pupil welfare initiatives for early childhood and primary classes.",
      bioPlaceholder: "Leading academic instruction, teacher supervision, South Sudan curriculum standards, and pupil welfare initiatives for early childhood and primary classes.",
      photoPlaceholder: "/assets/church/leadership/head-teacher.svg",
    },
    {
      name: "[Vocational Director Name — Update in organizationData.ts]",
      namePlaceholder: "[Vocational Director Name — Update in organizationData.ts]",
      role: "Director of Technical Trades, Victorious Vocational School",
      title: "Vocational & Enterprise Dean",
      bio: "Directing technical skills training in tailoring, electrical systems, carpentry, and entrepreneurship to empower South Sudanese youth with self-reliant livelihoods.",
      bioPlaceholder: "Directing technical skills training in tailoring, electrical systems, carpentry, and entrepreneurship to empower South Sudanese youth with self-reliant livelihoods.",
      photoPlaceholder: "/assets/church/leadership/vocational-director.svg",
    },
  ],

  communityOutreach: [
    {
      id: "outreach-widows",
      title: "Widows & Single Mothers Fellowship Relief",
      category: "Compassion Ministry",
      description: "Providing spiritual care, dry food rations, trauma healing circles, and emergency support for vulnerable widow-headed households in Juba.",
      impactHighlight: "Monthly food distribution & micro-enterprise fellowship circles",
      photoPlaceholder: "/assets/church/outreach/womens-fellowship.svg",
    },
    {
      id: "outreach-convocation",
      title: "Academic Convocations & Leadership Recognition",
      category: "Education & Dignity",
      description: "Hosting solemn academic ceremonies honoring church leaders, educators, and community servants adorned in formal academic regalia to affirm learning.",
      impactHighlight: "Promoting Christian scholarship and community leadership dignity",
      photoPlaceholder: "/assets/church/outreach/convocation-ceremony.svg",
    },
    {
      id: "outreach-youth-peace",
      title: "Youth Peace & Discipleship Fellowships",
      category: "Reconciliation",
      description: "Bringing young men and women from diverse cultural backgrounds together for Bible study, sports, leadership training, and peaceful unity.",
      impactHighlight: "Fostering inter-ethnic brotherhood and spiritual grounding",
      photoPlaceholder: "/assets/church/outreach/childrens-ministry.svg",
    },
    {
      id: "outreach-medical-hygiene",
      title: "Community Clean Water & Sanitation Camps",
      category: "Public Health",
      description: "Promoting disease prevention, clean water filtration, and emergency medical assistance to vulnerable neighborhood families.",
      impactHighlight: "Protecting children and mothers from waterborne infections",
      photoPlaceholder: "/assets/church/services/sunday-worship.svg",
    },
  ],
};
