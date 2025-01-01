import './globals.css';

export const metadata = {
  title: 'Bogdański - Konfigurator Okien',
  description: 'Konfigurator okien i drzwi Bogdański',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}