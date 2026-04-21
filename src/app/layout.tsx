import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Study 2 Enterprise Assistant Prototype",
  description: "Cognitive walkthrough prototype for adaptive enterprise assistant interactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
