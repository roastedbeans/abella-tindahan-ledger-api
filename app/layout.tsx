import { NavTabs } from "@/app/ui/nav-tabs";
import "./globals.css";

export const metadata = { title: "Tindahan Ledger" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-neutral-200 px-16">
          <NavTabs />
        </header>
        {children}
      </body>
    </html>
  );
}
