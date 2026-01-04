import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PublicProviders } from "@/components/PublicProviders";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicProviders>
      <Header />
      {children}
      <Footer />
    </PublicProviders>
  );
}
