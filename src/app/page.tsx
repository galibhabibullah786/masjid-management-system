import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import StatisticsSection from "@/components/home/StatisticsSection";
import CurrentCommitteeSection from "@/components/home/CurrentCommitteeSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import ContactSection from "@/components/home/ContactSection";
import BackToTopButton from "@/components/BackToTopButton";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <AboutSection />
        <StatisticsSection />
        <CurrentCommitteeSection />
        <GalleryPreview />
        <ContactSection />
        <BackToTopButton />
      </main>
      <Footer />
    </>
  );
}
