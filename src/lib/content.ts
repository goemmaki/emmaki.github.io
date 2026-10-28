export const FIVERR_INBOX_URL = "https://www.fiverr.com/inbox/emmaki";
export const FIVERR_PROFILE_URL = "https://www.fiverr.com/emmaki";

// The owner's availability, shown as a status light in the header and by the closing button.
// Change it here only. open: green. limited: yellow. full: red.
export type Availability = "open" | "limited" | "full";
export const AVAILABILITY: Availability = "open";

// The owner's working hours, for the header clock: Online inside them, Offline outside.
// A schedule for now; docs/ideas.md has the live Home Assistant version.
export const WORK_HOURS = { timeZone: "Europe/Athens", days: [1, 2, 3, 4, 5], start: 10, end: 18 };

// A client the owner has written for (the brands wall, the client slots). color: the brand's color,
// for its name on hover. Leave it out for a black (or near-black) brand: its name keeps the page's ink.
export type Brand = { name: string; color?: string };

// The owner's clients, in alphabetical order; the owner adds to them. Colors are each brand's accent from
// Brandfetch (2026-10-27), except Harvard's (its crimson) and TV Tropes' (its blue: the accent is a
// yellow too close to emmaki's); never fetch anything from Fiverr itself. Every client here
// is confirmed (owner, 2026-10-27).
export const BRANDS: Brand[] = [
  { name: "Accredible", color: "#5B4DFC" },
  { name: "Arc4dia", color: "#317DB3" },
  { name: "Compoundly", color: "#0EB400" },
  { name: "Design Bundles", color: "#4CC5FB" },
  { name: "Fiverr", color: "#1DBF73" },
  { name: "HackerRank", color: "#1BA94C" },
  { name: "Harvard University", color: "#A51C30" },
  { name: "Marco Polo", color: "#1DA2C7" },
  { name: "MHC Digital Group", color: "#AB5DE3" },
  { name: "Quartile", color: "#FF9900" },
  { name: "SellersFi", color: "#FCB337" },
  { name: "Spectral Core", color: "#17B3D0" },
  { name: "Tenity", color: "#993744" },
  { name: "TV Tropes", color: "#006BB1" },
];


// The owner's services: one per Fiverr gig, in the gig index's order (Second Brain
// business/emmaki/fiverr/gigs/index.md, 2026-10-28).
export const SERVICES = [
  "Website Copy",
  "Sales Copy",
  "VSL Scripts",
  "Email Copy",
  "SEO Content",
  "Lead Magnets",
  "Press Releases",
  "Content Rewrites",
  "AI Content Strategy",
  "Fiverr Optimization",
];
