import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "RSSI Lab Logger",
  description: "MIT PE - RSSI Measurement Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.onerror = function(msg, url, line, col, error) {
              const div = document.getElementById('global-error-log');
              if (div) {
                div.innerHTML += '<div style="margin-top:4px;border-bottom:1px solid #333;">' + 
                  new Date().toISOString() + ' ERROR: ' + msg + ' at ' + url + ':' + line + ':' + col + 
                  '</div>';
                div.style.display = 'block';
              }
            };
            window.addEventListener('error', function(e) {
              if (e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
                const div = document.getElementById('global-error-log');
                 if (div) {
                  div.innerHTML += '<div style="margin-top:4px;border-bottom:1px solid #333;color:orange;">' + 
                    new Date().toISOString() + ' RESOURCE LOAD FAIL: ' + (e.target.src || e.target.href) + 
                    '</div>';
                  div.style.display = 'block';
                }
              }
            }, true);
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div
          id="global-error-log"
          style={{
            display: 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'rgba(0,0,0,0.9)',
            color: 'red',
            zIndex: 99999,
            overflow: 'auto',
            padding: '10px',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}
        >
          <h3>Global Event Log (v1.0.13-DEBUG)</h3>
        </div>
        {children}
      </body>
    </html>
  );
}
