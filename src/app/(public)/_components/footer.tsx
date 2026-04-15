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
    <footer className="bg-[#0a1428] text-gray-400 border-t border-blue-900/50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Logo white />
            <div className="mt-6">
              <p className="text-gray-300 max-w-md leading-relaxed text-[15px]">
                The easiest way to launch and grow your online business. Trusted
                by over 100,000 entrepreneurs worldwide.
              </p>
            </div>
          </div>

          {/* Links Columns */}
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col">
              <h4 className="text-white font-semibold text-sm tracking-[0.5px] mb-6">
                {col.title}
              </h4>
              <ul className="space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white! hover:text-gray-400! transition-all duration-200 hover:translate-x-0.5 inline-block"
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
      <div className="border-t border-blue-900/50 py-8 bg-[#0a1428]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© 2026 OneComm. All rights reserved.</p>
            <div className="flex items-center gap-6 text-xs">
              <a
                href="#"
                className="text-white! hover:text-gray-400! transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-white! hover:text-gray-400! transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
