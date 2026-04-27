import "./globals.css";
import { PawTrail } from "@/components/paw-trail";

export const metadata = {
  title: {
    default: "t Snuffeltje",
    template: "%s | t Snuffeltje"
  },
  description: "Trimsalon voor honden in Boortmeerbeek, met vachtverzorging, puppygewenning en advies op maat.",
  icons: {
    icon: "/images/favicon/favicon.ico",
    apple: "/images/favicon/apple-touch-icon.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>
        <PawTrail />
        {children}
      </body>
    </html>
  );
}
