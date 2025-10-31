import { Navbar } from "@/components/navbar/Navbar";
import { Container } from "@/components/container";
import { Footer } from "@/components/footer/Footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <Container>{children}</Container>
      <Footer />
    </div>
  );
}
