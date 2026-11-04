import type { ImageMetadata } from "astro";
import brettSmith from "@/assets/testimonials/brett-smith.webp";
import reneSamson from "@/assets/testimonials/rene-samson.png";
import shiloAbramovicz from "@/assets/testimonials/shilo-abramovicz.jpg";
import ronnaLichtenberg from "@/assets/testimonials/ronna-lichtenberg.jpg";

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
// for its name on hover. hoverInk adjusts only failing wall inks to at least 3.15:1 on the theme canvas.
// Leave color out for a black (or near-black) brand: its name keeps the page's ink.
// logo: the client strip's files in public/clients, trimmed to their ink: light for a light background,
// dark for a dark one. Where a brand publishes only one, the other is made from it with its black or
// white parts flipped and its brand colors kept (2026-10-28).
export type ClientLogo = { light: string; dark: string };
export type Brand = {
  name: string;
  color?: string;
  hoverInk?: { light?: string; dark?: string };
  logo: ClientLogo;
};

// The owner's clients, in alphabetical order; the owner adds to them. Colors are each brand's accent from
// Brandfetch (2026-10-27), except Harvard's (its crimson) and TV Tropes' (its blue: the accent is a
// yellow too close to emmaki's); never fetch anything from Fiverr itself. Every client here
// is confirmed (owner, 2026-10-27). Logos are from Brandfetch (2026-10-28), except MHC Digital Group's
// (an earlier Brandfetch file; the current one is only an icon), Compoundly's (its site header's symbol and
// name, captured as an image), Spectral Core's (its site footer's symbol and name, captured the same way;
// Brandfetch's file is an award badge) and Arc4dia's, cropped above its "Cyber Defense" line (the only
// file it publishes is 201x48).
export const BRANDS: Brand[] = [
  { name: "Accredible", color: "#5B4DFC", logo: { light: "accredible.png", dark: "accredible-on-dark.png" } },
  { name: "Arc4dia", color: "#317DB3", logo: { light: "arc4dia.png", dark: "arc4dia.png" } },
  { name: "Compoundly", color: "#0EB400", hoverInk: { light: "#0DA800" }, logo: { light: "compoundly.png", dark: "compoundly-on-dark.png" } },
  { name: "Design Bundles", color: "#4CC5FB", hoverInk: { light: "#3C9AC5" }, logo: { light: "design-bundles.svg", dark: "design-bundles-on-dark.png" } },
  { name: "Fiverr", color: "#1DBF73", hoverInk: { light: "#19A564" }, logo: { light: "fiverr.svg", dark: "fiverr-on-dark.svg" } },
  { name: "HackerRank", color: "#1BA94C", logo: { light: "hackerrank.svg", dark: "hackerrank-on-dark.png" } },
  { name: "Harvard University", color: "#A51C30", hoverInk: { dark: "#AB2C3E" }, logo: { light: "harvard.svg", dark: "harvard-on-dark.svg" } },
  { name: "Marco Polo", color: "#1DA2C7", hoverInk: { light: "#1C9DC1" }, logo: { light: "marco-polo.png", dark: "marco-polo-on-dark.png" } },
  { name: "MHC Digital Group", color: "#AB5DE3", logo: { light: "mhc-digital-group.svg", dark: "mhc-digital-group-on-dark.png" } },
  { name: "Quartile", color: "#FF9900", hoverInk: { light: "#D17D00" }, logo: { light: "quartile-on-light.png", dark: "quartile-on-dark.svg" } },
  { name: "SellersFi", color: "#FCB337", hoverInk: { light: "#BD8729" }, logo: { light: "sellersfi.svg", dark: "sellersfi-on-dark.png" } },
  { name: "Spectral Core", color: "#17B3D0", hoverInk: { light: "#149EB8" }, logo: { light: "spectral-core-on-light.png", dark: "spectral-core-on-dark.png" } },
  { name: "Tenity", color: "#993744", hoverInk: { dark: "#9C3C49" }, logo: { light: "tenity.svg", dark: "tenity-on-dark.png" } },
  { name: "TV Tropes", color: "#006BB1", logo: { light: "tv-tropes.png", dark: "tv-tropes-on-dark.png" } },
];

// The client strip's order: the names a buyer is most likely to know first, so the first row, before
// any cell rolls, leads with them (owner, 2026-10-28). A client missing here goes last.
export const CLIENT_STRIP_ORDER = [
  "Fiverr",
  "Harvard University",
  "HackerRank",
  "TV Tropes",
  "Marco Polo",
  "Accredible",
  "Design Bundles",
  "Quartile",
  "SellersFi",
  "Tenity",
  "Spectral Core",
  "MHC Digital Group",
  "Compoundly",
  "Arc4dia",
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

// photo: a headshot in src/assets/testimonials, at least 3x its 56px display size; renders through <Picture>. about: who the
// client is, one line shown in mono under the name (after bymonolog.com).
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  photo?: ImageMetadata;
  about?: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
};

// Real client quotes, as the owner supplied them (2026-10-28).
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Emma was a fantastic partner in helping us refine and rewrite the content for our website. She brought a highly process-oriented approach to the project, which made collaboration smooth and efficient from start to finish. Emma took the time to conduct thorough research into our business, industry, and audience, and it really showed in the final result.",
    name: "Brett Smith",
    role: "Founder & Principal Consultant",
    company: "Cumulus Vision",
    photo: brettSmith,
    about: "A San Francisco Salesforce partner with 100+ clients since 2012.",
    city: "San Francisco",
    country: "us",
    lat: 37.77,
    lng: -122.42,
  },
  {
    quote: "Emma quickly understood our needs during the consultation and pointed out many things that we hadn’t thought of. She went above and beyond by providing more value than we expected, even giving several variants of the same text using different approaches. It’s clear that she is a master at her craft, and we would love to work with her on future projects!",
    name: "René Samson",
    role: "Founder & CEO",
    company: "Samson Digital",
    photo: reneSamson,
    city: "Nova Scotia",
    country: "ca",
    lat: 45.51,
    lng: -60.99,
  },
  {
    quote: "Emma was a pleasure to work with on a 60-second comedy ad script and its 15-second cutdown. She asked sharp questions up front, pitched ideas of her own, and took notes quickly and graciously, including a big change of direction halfway through. Both drafts came in ahead of schedule, the script is genuinely funny, and her voice-over notes are clear and fun to work from. She even caught a word-count mistake on our side. Professional, quick and witty. Highly recommended for short-form ad scripts.",
    name: "Shilo Abramovicz",
    role: "AI Engineer Lead",
    company: "Fiverr",
    photo: shiloAbramovicz,
    city: "Tel Aviv",
    country: "il",
    lat: 32.08,
    lng: 34.78,
  },
  {
    quote: "Emma delivers value, every time. Not only is she a persuasive writer, she is a first-rate problem solver. She takes the time to understand what I need and comes up with ideas that wouldn’t have occurred to me.",
    name: "Ronna Lichtenberg",
    role: "Former SVP",
    company: "Prudential Securities",
    photo: ronnaLichtenberg,
    city: "New York",
    country: "us",
    lat: 40.71,
    lng: -74.01,
  },
];

// Placeholder client quotes until the owner picks real Fiverr reviews (About, Home).
export const PLACEHOLDER_QUOTES: Testimonial[] = [
  {
    quote: "Placeholder for a real Fiverr review: two or three sentences on what changed for the client after the work.",
    name: "Client name",
    role: "Role",
    company: "Company",
  },
  {
    quote: "A shorter placeholder review, one sentence long.",
    name: "Client name",
    role: "Role",
    company: "Company",
  },
  {
    quote: "A longer placeholder review, to show how the block copes with length: four sentences or so, the sort a happy client leaves after a big project, naming the result and how it felt to work together.",
    name: "Client name",
    role: "Role",
    company: "Company",
  },
];
