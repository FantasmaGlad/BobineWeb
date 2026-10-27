import type { Metadata } from "next";
import "../styles/bobine-tokens.css";
import "../styles/security.css";
import "../styles/bobine-controls.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://security.bobine.fit"),
  title: "Bobine Security",
  description: "Official vulnerability disclosure policy and OpenPGP key for Bobine.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-theme="lavande">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.className='js';(function(){try{var m=document.cookie.match(/(?:^|; )bobine-theme=([\w-]+)/);var t=(m&&m[1])||localStorage.getItem('bobineweb-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
