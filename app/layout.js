import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  metadataBase: new URL("https://pawfavoritees.com"),
  title: {
    default: "PawFavoritees — Love Them. Spoil Them. | Pet Supplies USA",
    template: "%s | PawFavoritees",
  },
  description:
    "Premium, affordable pet supplies for dogs and cats. Free shipping on qualifying orders. USA-focused pet store.",
  openGraph: {
    siteName: "PawFavoritees",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
