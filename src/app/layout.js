'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WagmiProvider } from 'wagmi'
import { config } from './config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ToastNotification from "@/components/ui/ToastNotification";
const queryClient = new QueryClient()

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ToastNotification />
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}