import type { Metadata } from "next";
import { Inter, Space_Grotesk, Plus_Jakarta_Sans, Fira_Code } from "next/font/google";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Use system font fallback if Google Fonts fetch fails
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});


const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Colloabuilder | The Digital Forge",
  description: "Bridge the gap between solving algorithms and building production-ready software.",
  icons: {
    icon: "https://ik.imagekit.io/DEMOPROJECT/colloabuilder.png",
    apple: "https://ik.imagekit.io/DEMOPROJECT/colloabuilder.png",
  },
  openGraph: {
    title: "Colloabuilder | The Digital Forge",
    description: "Bridge the gap between solving algorithms and building production-ready software.",
    images: [{ url: "https://ik.imagekit.io/DEMOPROJECT/download.svg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Colloabuilder | The Digital Forge",
    description: "Bridge the gap between solving algorithms and building production-ready software.",
    images: ["https://ik.imagekit.io/DEMOPROJECT/download.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${plusJakarta.variable} ${firaCode.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          <UserProvider>
            <Toaster position="top-right" theme="dark" richColors closeButton />
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
