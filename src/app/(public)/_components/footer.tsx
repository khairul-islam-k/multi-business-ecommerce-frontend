// components/FooterSection.tsx
import Logo from "@/components/shared/logo";

export const FooterSection = () => {
  const columns = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Integrations", "Solutions"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Blog", "Press"],
    },
    {
      title: "Support",
      links: ["Help Center", "Contact Us", "Status", "Community"],
    },
    {
      title: "Resources",
      links: ["Documentation", "Learn", "Affiliates", "Experts"],
    },
  ];

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Logo white />
            <div className="py-1"></div>
            <p className="text-gray-500 max-w-md">
              The easiest way to launch and grow your online business. Trusted
              by over 100,000 entrepreneurs worldwide.
            </p>
          </div>

          {/* Links Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-5 text-sm tracking-widest">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
          © 2026 OneComm. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
