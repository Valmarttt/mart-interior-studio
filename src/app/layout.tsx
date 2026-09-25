import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atelier AI — Interior ideas with intention",
  description: "Explore a more considered version of your room with Atelier AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html><body>{children}</body></html>;
}
