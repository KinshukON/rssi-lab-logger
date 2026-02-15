import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RSSI Lab Logger | Turn Wi-Fi complaints into measurable evidence",
  description:
    "Measure RSSI (dBm) across your home, visualize trends, and generate PDF-ready Wi-Fi Health Reports. Validate upgrades, optimize router placement, and prove improvements.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
