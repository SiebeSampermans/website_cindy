import "./globals.css";

export const metadata = {
  title: {
    default: "t Snuffeltje",
    template: "%s | t Snuffeltje"
  },
  description: "Trimsalon, bodywork, massage en fitness voor honden in Boortmeerbeek.",
  icons: {
    icon: "/images/favicon/favicon.ico",
    apple: "/images/favicon/apple-touch-icon.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
