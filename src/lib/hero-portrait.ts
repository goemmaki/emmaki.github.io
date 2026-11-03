import { getImage } from 'astro:assets';
import cutout from '../assets/hero/portrait-cutout.png';

// The Home hero portrait as served: Astro encodes it from the precut PNG (made by
// scripts/hero-cutout.mjs from portrait-source.png). The hero's canvas loads it, and Home preloads it.
export const heroPortrait = () => getImage({ src: cutout, format: 'webp', quality: 90 });
