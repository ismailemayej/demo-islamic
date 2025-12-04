import { Navbar } from "@/components/navbar/Navbar";
import { Container } from "@/components/container";
import TopAdBanner from "@/components/advesment";
import { Footer } from "@/components/footer/Footer";
import OfferToast from "@/components/offer-toast/OfferToast";
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen overflow-x-hidden font-sans">
      <OfferToast />
      <TopAdBanner />
      <Navbar />
      <Container>{children}</Container>
      <Footer />
    </div>
  );
}
