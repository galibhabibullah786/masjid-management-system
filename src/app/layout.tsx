import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amanat-E-Nazirpara | Community Mosque Project",
  description: "Join us in building our community mosque through transparency, trust, and collective effort. View contributions, committees, and our journey.",
  keywords: ["mosque", "community", "donation", "transparency", "Nazirpara", "Bangladesh"],
  authors: [{ name: "Amanat-E-Nazirpara Committee" }],
  openGraph: {
    title: "Amanat-E-Nazirpara | Community Mosque Project",
    description: "Building our sacred space together through community contributions",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
