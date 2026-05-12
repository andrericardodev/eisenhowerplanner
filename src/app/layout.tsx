import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eisenhower Planner",
  description: "A focused task planner built around the Eisenhower Matrix."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
