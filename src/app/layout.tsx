import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgentBeat - Production Monitoring for AI Agents",
  description:
    "Know when your agents fail, overspend, or go silent. Heartbeat monitoring, cost tracking, and failure detection for AI agents and automated workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className="min-h-full font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
