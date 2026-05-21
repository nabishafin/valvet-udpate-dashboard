import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Velvet Rouge | Admin Dashboard",
  description: "Administrative control center for Velvet Rouge luxury salons and studio spaces.",
  icons: {
    icon: "/valvet.png",
    shortcut: "/valvet.png",
    apple: "/valvet.png",
  },
};

import AppWrapper from "../components/AppWrapper";
import ReduxProvider from "./redux/ReduxProvider";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background flex">
        <ReduxProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a1a',
                color: '#fff',
                borderRadius: '12px',
                padding: '14px 18px',
                fontSize: '14px',
                fontWeight: '600',
              },
              success: {
                iconTheme: { primary: '#BA8C43', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#650A33', secondary: '#fff' },
              },
            }}
          />
          <AppWrapper>{children}</AppWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
