import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Portfolio Showcase | Brian Maina Nyawira',
  description: 'Explore my latest design showcases including UI/UX, presentations, branding, and confidential corporate projects.',
  openGraph: {
    title: 'Portfolio Showcase | Brian Maina Nyawira',
    description: 'Explore my latest design showcases including UI/UX, presentations, branding, and confidential corporate projects.',
    url: '/portfolio',
    type: 'website',
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}