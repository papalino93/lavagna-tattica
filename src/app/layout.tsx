import type { Metadata } from "next";
import { Big_Shoulders, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lavagna-tattica-mu.vercel.app"),
  title: "Lavagna Tattica",
  description: "Gestione squadra e lavagna tattica per allenatori",
  openGraph: {
    title: "Lavagna Tattica",
    description: "Rosa, allenamenti, partite e schemi tattici — tutto in un posto.",
    type: "website",
  },
};

// Applica subito il tema scuro esplicito salvato dall'utente, prima del primo paint,
// così non si vede un lampo di tema chiaro. Se non c'è una scelta esplicita, si segue
// semplicemente la preferenza di sistema via CSS (@media prefers-color-scheme).
const THEME_INIT_SCRIPT = `
try {
  var t = localStorage.getItem('theme');
  if (t === 'light' || t === 'dark') {
    document.documentElement.setAttribute('data-theme', t);
  }
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${bigShoulders.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}
