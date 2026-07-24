import type { ReactNode } from "react";

import { getTemplateFontClassName } from "@/lib/template-fonts";

type TemplateFontProviderProps = {
  fontFamily?: string | null;
  children: ReactNode;
  className?: string;
};

export default function TemplateFontProvider({
  fontFamily,
  children,
  className = "",
}: TemplateFontProviderProps) {
  const fontClassName = getTemplateFontClassName(fontFamily);

  console.log('provide', fontFamily);

  return (
    <div
      className={`${fontClassName} min-h-screen ${className}`.trim()}
    >
      {children}
    </div>
  );
}