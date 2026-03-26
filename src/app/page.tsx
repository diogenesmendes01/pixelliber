import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Subscribe from "@/components/Subscribe";
import ReadAnywhere from "@/components/ReadAnywhere";
import DownloadSection from "@/components/DownloadSection";
import FAQ from "@/components/FAQ";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Subscribe />
        <ReadAnywhere />
        <DownloadSection />
        <FAQ />
      </main>
      <WhatsAppButton />
    </>
  );
}
