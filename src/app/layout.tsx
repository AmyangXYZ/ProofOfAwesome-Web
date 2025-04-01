import type { Metadata } from "next"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"
import { ThemeProvider } from "@mui/material/styles"
import { Roboto } from "next/font/google"
import theme from "./theme"

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
})

export const metadata: Metadata = {
  title: "Proof of Awesome | AI-Verified Blockchain Achievement Platform",
  description:
    "Transform your real-world achievements into blockchain-verified digital assets with AI validation. Join themed chains for fitness, learning, creativity and more.",
  keywords: [
    "blockchain achievement",
    "AI verification",
    "digital achievement tracking",
    "proof of work alternative",
    "blockchain social platform",
  ],
  openGraph: {
    title: "Proof of Awesome | Transform Achievements into Blockchain Assets",
    description:
      "Record your real-world accomplishments on a blockchain with AI verification. Join public chains or create private ones for your community.",
    type: "website",
    locale: "en_US",
    siteName: "Proof of Awesome",
  },
  twitter: {
    card: "summary",
    title: "Proof of Awesome | Blockchain Achievement Platform",
    description: "Your real-world achievements, verified by AI and recorded on blockchain.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  applicationName: "Proof of Awesome",
  category: "productivity",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" style={{ scrollBehavior: "smooth", background: "black" }}>
      <body className={roboto.variable}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
