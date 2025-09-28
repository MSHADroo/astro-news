import type { Link } from "../types";

export const SITE = {
  title: "خبرگذاری بیتی",
  description: "خلاصه اخبار فناوری برای خسته ها",
  author: "MSHADroo",
  url: "https://astro.local",
  // github: "https://github.com/Mrahmani71/astro-news",
  locale: "fa-IR",
  dir: "rtl",
  charset: "UTF-8",
  basePath: "/",
  postsPerPage: 4,
};

export const NAVIGATION_LINKS: Link[] = [
  {
    href: "/category/mobile/1",
    text: "موبایل",
  },
  {
    href: "/category/computer/1",
    text: "کامپیوتر",
  },
  {
    href: "/category/software/1",
    text: "نرم‌افزار",
  },
  {
    href: "/category/internet/1",
    text: "اینترنت",
  },
  {
    href: "/category/ai/1",
    text: "هوش‌مصنوعی",
  },
  {
    href: "/category/gaming/1",
    text: "بازی",
  },
  {
    href: "/category/security/1",
    text: "امنیت",
  },
];

export const OTHER_LINKS: Link[] = [
  {
    href: "/about",
    text: "درباره ما",
  },
  {
    href: "/authors",
    text: "نویسندگان",
  },
  {
    href: "/contact",
    text: "تماس با ما",
  },
  {
    href: "/privacy",
    text: "محرمانگی",
  },
  {
    href: "/terms",
    text: "قوانین",
  },
  {
    href: "/cookie-policy",
    text: "سیاست کوکی",
  },
  {
    href: "http://localhost:4321/rss.xml",
    text: "آر اس اس",
  },
  {
    href: "http://localhost:4321/sitemap-index.xml",
    text: "نقشه سایت",
  },
];

export const SOCIAL_LINKS: Link[] = [
  {
    href: "https://github.com",
    text: "گیت هاب",
    icon: "github",
  },
  {
    href: "httpe://www.t.me",
    text: "تلگرام",
    icon: "telegram",
  },
  {
    href: "https://twitter.com",
    text: "توییتر",
    icon: "newTwitter",
  },
  {
    href: "https://www.facebook.com",
    text: "فیس‌بوک",
    icon: "facebook",
  },
];
