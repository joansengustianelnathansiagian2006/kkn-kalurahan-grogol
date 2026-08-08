import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="pt-28 flex-1">{children}</main>
      <Footer />
    </div>
  );
}