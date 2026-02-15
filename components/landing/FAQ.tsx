"use client";

const faqs = [
  {
    q: "Can the web app auto-measure RSSI?",
    a: "No. The web app requires manual entry. You measure RSSI using your device (e.g., Option-click Wi-Fi on macOS or airport -I) and type the value in. Only the Mac desktop app has an Auto Measure button that runs the airport utility locally.",
  },
  {
    q: "How do I measure RSSI on macOS?",
    a: "Two ways: (1) Hold Option and click the Wi-Fi icon in the menu bar — look for 'RSSI: -xx dBm'. (2) In Terminal, run: airport -I (or the full path: /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I) and find the agrCtlRSSI line.",
  },
  {
    q: "Does this work on Windows?",
    a: "The web app works on any device — you can manually enter RSSI from any Wi-Fi diagnostic tool. Auto Measure (one-click capture) is macOS only for now. A Windows build is not currently available.",
  },
  {
    q: "What does RSSI mean?",
    a: "RSSI (Received Signal Strength Indicator) is a measure of how strong the Wi-Fi signal is at your device. It's expressed in dBm (decibels relative to 1 milliwatt). More negative = weaker signal.",
  },
  {
    q: "What's a good RSSI?",
    a: "Rough guide: Excellent (-50 or higher), Good (-50 to -60), Fair (-60 to -70), Weak (-70 to -80), Unusable (below -80). Below -70 dBm, you may see slower speeds and more latency.",
  },
];

export default function FAQ() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 text-center">
          Frequently asked questions
        </h2>

        <dl className="mt-16 space-y-8">
          {faqs.map(({ q, a }) => (
            <div key={q}>
              <dt className="text-lg font-semibold text-slate-900">{q}</dt>
              <dd className="mt-2 text-slate-600 leading-relaxed">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
