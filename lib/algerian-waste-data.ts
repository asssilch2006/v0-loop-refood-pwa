/**
 * Algerian Food Waste Research Data
 * Based on studies about food waste in Algeria and North Africa
 */

export const wasteStatistics = {
  overall: {
    wastePercentage: 45,
    description: "of food is wasted in Algerian households annually",
    co2PerKg: 2.1, // kg CO2 equivalent per kg of food
  },
  topWastedItems: [
    {
      category: "Bread & Cereals",
      percentage: 38,
      description: "Most wasted category in households",
      icon: "🍞",
      solution: "Animal feed programs, bread saving tips, donation networks",
    },
    {
      category: "Vegetables & Fruits",
      percentage: 28,
      description: "Second most wasted due to poor storage",
      icon: "🥕",
      solution: "Better storage techniques, market connectivity",
    },
    {
      category: "Dairy & Proteins",
      percentage: 18,
      description: "Often expired before use",
      icon: "🥛",
      solution: "Real-time marketplace matching",
    },
    {
      category: "Processed Foods",
      percentage: 16,
      description: "Over-purchasing and expiration",
      icon: "📦",
      solution: "Smart sharing platform",
    },
  ],
  keyFindings: [
    {
      title: "Bread Waste Crisis",
      statistic: "~30% of bread produced is wasted",
      impact: "Particularly high in urban areas like Algiers",
      solution: "Animal Feed (Dry Bread) category connects bakeries to farmers",
    },
    {
      title: "Storage Issues",
      statistic: "50% of Algerians lack proper food storage",
      impact: "Leads to premature spoilage",
      solution: "Educational content + preservation tips",
    },
    {
      title: "Urban Food Waste",
      statistic: "45% waste rate in Algiers and major cities",
      impact: "Environmental and economic burden",
      solution: "Loop Refood circular economy model",
    },
  ],
  greenTips: [
    "Tip: 50% of Algerians waste bread due to poor storage. Use our vacuum-seal tips!",
    "Did you know? Dried bread can feed livestock. Share with farmers in your neighborhood!",
    "Green fact: Saving 1 kg of bread = 2.1 kg CO2 prevented. You're making a difference!",
    "Storage tip: Keep bread in airtight containers away from humidity.",
    "Farmers' market: Check our 'Animal Feed' section for surplus cereals at discounted prices.",
    "Budget hack: Buy surplus items from bakeries—same quality, half price!",
    "Waste reduction: You've prevented 125 kg of CO2 by using Loop Refood.",
    "Community impact: Your sharing has saved 847 kg of food from landfills!",
  ],
  impactMetrics: {
    foodSavedPerUser: 12.5, // kg per month average
    co2PreventedPerUser: 26.25, // kg CO2 per month
    monetarySavingsPerUser: 890, // DZD per month
  },
};

export const algiersNeighborhoods = [
  {
    name: "Algiers Center",
    lat: 36.7538,
    lng: 3.0588,
    type: "Urban Hub",
    storeCount: 4,
    description: "Downtown area with bakeries and grocery stores",
  },
  {
    name: "Hydra",
    lat: 36.7652,
    lng: 3.0876,
    type: "Residential",
    storeCount: 3,
    description: "Residential neighborhood with local bakeries",
  },
  {
    name: "Rouiba",
    lat: 36.6952,
    lng: 3.0338,
    type: "Mixed",
    storeCount: 3,
    description: "Mixed residential and commercial area",
  },
  {
    name: "Bab Ezzouar",
    lat: 36.7421,
    lng: 3.1121,
    type: "Suburban",
    storeCount: 2,
    description: "Suburban area with growing food markets",
  },
  {
    name: "Hussein Dey",
    lat: 36.7412,
    lng: 3.0921,
    type: "Urban",
    storeCount: 3,
    description: "Historic urban neighborhood",
  },
  {
    name: "El Harrach",
    lat: 36.7589,
    lng: 3.1432,
    type: "Suburban",
    storeCount: 2,
    description: "Suburban area with farmland nearby",
  },
  {
    name: "Kouba",
    lat: 36.7654,
    lng: 3.0345,
    type: "Residential",
    storeCount: 2,
    description: "Quiet residential zone",
  },
  {
    name: "Bir Mourad Raïs",
    lat: 36.7745,
    lng: 3.0654,
    type: "Upscale",
    storeCount: 3,
    description: "Upscale residential area",
  },
  {
    name: "Dely Ibrahim",
    lat: 36.8032,
    lng: 3.0654,
    type: "Suburban",
    storeCount: 2,
    description: "Suburban area with farmland",
  },
  {
    name: "Bab El Oued",
    lat: 36.7632,
    lng: 3.0412,
    type: "Urban",
    storeCount: 3,
    description: "Historic urban neighborhood with heritage bakeries",
  },
  {
    name: "Belouizdad",
    lat: 36.7521,
    lng: 3.0745,
    type: "Mixed",
    storeCount: 2,
    description: "Mixed area with diverse food options",
  },
  {
    name: "El Biar",
    lat: 36.7852,
    lng: 3.0512,
    type: "Upscale",
    storeCount: 2,
    description: "Upscale neighborhood",
  },
  {
    name: "Bachdjarah",
    lat: 36.6875,
    lng: 3.0921,
    type: "Suburban",
    storeCount: 2,
    description: "Suburban area with mixed commerce",
  },
  {
    name: "Sidi Yahia",
    lat: 36.7421,
    lng: 3.0234,
    type: "Residential",
    storeCount: 2,
    description: "Residential neighborhood",
  },
  {
    name: "Staoueli",
    lat: 36.7652,
    lng: 2.9854,
    type: "Coastal",
    storeCount: 2,
    description: "Coastal area with fresh markets",
  },
];

export const localProfiles = {
  students: [
    {
      name: "Amine",
      location: "Bab Ezzouar",
      institution: "USTHB (Université des Sciences et de la Technologie Houari Boumediène)",
      bio: "Engineering student",
      review: "This app saved my budget! I find cheap meals near Bab Ezzouar every day. As a student with limited means, Loop Refood is a game-changer.",
      rating: 5,
    },
    {
      name: "Fatima",
      location: "Algiers Center",
      institution: "USTHB - Biology Faculty",
      bio: "Biology student passionate about sustainability",
      review: "Brilliant concept! Finding organic vegetables at half price helps me eat healthy on a student budget. The environmental impact is amazing too.",
      rating: 5,
    },
    {
      name: "Youssef",
      location: "Hussein Dey",
      institution: "École Polytechnique d'Alger",
      bio: "Computer science student",
      review: "The app is incredibly well-designed. I love that it reduces food waste AND saves money. Win-win for students like me!",
      rating: 5,
    },
  ],
  workers: [
    {
      name: "Karim",
      location: "Dely Ibrahim",
      profession: "Factory Worker & Small Farmer",
      bio: "Part-time livestock farmer",
      review: "As a worker with a small farm, I buy surplus bread for my animals here. It's a game-changer for recycling. My feed costs dropped 40%!",
      rating: 5,
    },
    {
      name: "Soraya",
      location: "El Harrach",
      profession: "Office Manager",
      bio: "Single mother of two",
      review: "Working hard to provide for my kids, this app lets me buy quality food at affordable prices. Monthly savings: 2,500 DZD!",
      rating: 5,
    },
    {
      name: "Mohammed",
      location: "Kouba",
      profession: "Construction Worker",
      bio: "Community organizer",
      review: "Loop Refood isn't just an app—it's a movement. I share surplus with neighbors, creating real community bonds while reducing waste.",
      rating: 5,
    },
  ],
  volunteers: [
    {
      name: "Lydia",
      location: "Algiers",
      organization: "Green Algiers Initiative",
      bio: "Environmental volunteer",
      review: "Finally, an app that addresses the 45% of food waste in our cities! Every item saved is a victory for our planet.",
      rating: 5,
    },
    {
      name: "Aïcha",
      location: "Bir Mourad Raïs",
      organization: "Community Waste Reduction Program",
      bio: "Sustainability advocate",
      review: "This is exactly what Algiers needs. Combining circular economy with community support—I'm volunteering to expand this to other neighborhoods!",
      rating: 5,
    },
  ],
};

export const dailyGreenTips = wasteStatistics.greenTips;

export function getRandomGreenTip(): string {
  return dailyGreenTips[Math.floor(Math.random() * dailyGreenTips.length)];
}

export function calculateCO2Saved(foodWeightKg: number): number {
  return foodWeightKg * wasteStatistics.overall.co2PerKg;
}

export function calculateMoneySaved(foodWeightKg: number): number {
  // Average DZD 70 per kg of food
  return foodWeightKg * 70;
}
