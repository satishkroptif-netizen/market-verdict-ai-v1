import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PredictChain — AI-Powered Market Predictions',
  description: 'Real-time price predictions for BTC, ETH, Gold, Silver & WTI using multi-factor analysis',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
