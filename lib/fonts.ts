import localFont from "next/font/local";

export const cormorantGaramond = localFont({
  src: "../public/Cormorant_Garamond/CormorantGaramond-VariableFont_wght.ttf",
  variable: "--font-serif",
  display: "swap",
  weight: "300 700",
});

export const inter = localFont({
  src: "../public/Inter/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
});
