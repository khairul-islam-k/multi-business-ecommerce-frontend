import { FooterSection } from "./_components/footer";
import { Navbar } from "./_components/navbar";

const MainLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <div className="py-8" />
      {children}
      <FooterSection />
    </div>
  );
};

export default MainLayout;
