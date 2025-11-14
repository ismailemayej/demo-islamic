import { Navbar } from "@/components/navbar/Navbar";
import { Container } from "@/components/container";
import TopAdBanner from "@/components/advesment";
import { Footer } from "@/components/footer/Footer";
import { Providers } from "@/components/providers";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <TopAdBanner />
      <Navbar />
      <Container>
        <Providers>{children}</Providers>
      </Container>
      <Footer />
    </div>
  );
}
