import {
  Inter,
  Noto_Sans_Bengali,
  Playfair_Display,
  Poppins,
  Roboto,
  Montserrat,
  Open_Sans,
  Alegreya
} from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: false,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: false,
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: false,
});

const opensans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: false,
});

const alegreya = Alegreya({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: false,
});

export const TemplateFont = {
  INTER: "INTER",
  POPPINS: "POPPINS",
  ROBOTO: "ROBOTO",
  PLAYFAIR_DISPLAY: "PLAYFAIR_DISPLAY",
  NOTO_SANS_BENGALI: "NOTO_SANS_BENGALI",
  MONTSERRAT: "MONTSERRAT",
  OPEN_SANS: "OPEN_SANS",
  ALEGREYA: "ALEGREYA",
} as const;

export type TemplateFont =
  (typeof TemplateFont)[keyof typeof TemplateFont];

const templateFontMap: Record<TemplateFont, string> = {
  INTER: inter.className,
  POPPINS: poppins.className,
  ROBOTO: roboto.className,
  PLAYFAIR_DISPLAY: playfairDisplay.className,
  NOTO_SANS_BENGALI: notoSansBengali.className,
  MONTSERRAT: montserrat.className,
  OPEN_SANS: opensans.className,
  ALEGREYA: alegreya.className
};

/**
 * Returns the selected Google Font class.
 * Falls back to Inter when the value is invalid.
 */
export function getTemplateFontClassName(
  fontName?: string | null,
): string {
  if (!fontName) {
    return templateFontMap.INTER;
  }


  const normalizedFontName = fontName
    .trim()
    .toUpperCase()
    .replaceAll("-", "_")
    .replaceAll(" ", "_") as TemplateFont;

  return templateFontMap[normalizedFontName] ?? templateFontMap.INTER;
}

export const templateFontOptions = [
  {
    label: "Inter",
    value: TemplateFont.INTER,
  },
  {
    label: "Poppins",
    value: TemplateFont.POPPINS,
  },
  {
    label: "Roboto",
    value: TemplateFont.ROBOTO,
  },
  {
    label: "Playfair Display",
    value: TemplateFont.PLAYFAIR_DISPLAY,
  },
  {
    label: "Noto Sans Bengali",
    value: TemplateFont.NOTO_SANS_BENGALI,
  },
  {
    label: "Montserrat",
    value: TemplateFont.MONTSERRAT,
  },
  {
    label: "Open Sans",
    value: TemplateFont.OPEN_SANS,
  },
  {
    label: "Alegreya",
    value: TemplateFont.ALEGREYA,
  },
];