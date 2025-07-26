// constants/navigation.ts

export type NavItem = {
  label: string;
  href: string;
};

export type NavSection = {
  label: string;
  children: NavItem[];
};

export const navigation: NavSection[] = [
  {
    label: "Docs",
    children: [
      { label: "Introduction", href: "/docs" },
      { label: "Text Circle", href: "/docs/text-circle" },
    ],
  },
  {
    label: "Examples",
    children: [
      { label: "FlipCard", href: "/docs/flip-card" },
      { label: "Text Ripple", href: "/docs/text-ripple" },
    ],
  },
];
