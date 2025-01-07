import './globals.css';
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: 'Bogdański - Konfigurator Okien',
  description: 'Konfigurator okien i drzwi Bogdański',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        {children}
        <Analytics />
       </body>
    </html>
  );
}