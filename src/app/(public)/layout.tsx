import { FooterSection } from "./_components/footer";
import { Navbar } from "./_components/navbar";

const MainLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Navbar />
      {children}
      <FooterSection />
    </>
  );
};

export default MainLayout;
