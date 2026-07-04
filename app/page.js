"use client";

import { useState } from "react";
import Image from "next/image";

/* ---------- tiny inline icons (no extra deps) ---------- */
const IconSearch = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
  </svg>
);
const IconDownload = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M12 3v12m0 0l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconEye = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconClock = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconChevron = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconShield = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- static content ---------- */
const HOW_TO_STEPS = [
  {
    n: "01",
    title: "Paste the link",
    body: "Copy any YouTube video, Shorts, or embed URL and drop it into the box above.",
  },
  {
    n: "02",
    title: "We fetch the details",
    body: "Title, channel, thumbnail, view count, and every available format are pulled in seconds.",
  },
  {
    n: "03",
    title: "Pick a quality & download",
    body: "Choose the resolution you want and the file downloads straight to your device.",
  },
];

const FAQS = [
  {
    q: "Is this tool free to use?",
    a: "Yes. Searching for a video and downloading it doesn't cost anything or require an account.",
  },
  {
    q: "What formats can I download?",
    a: "We surface every MP4 rendition YouTube exposes for a video, from standard definition up to the highest quality available.",
  },
  {
    q: "Does it work with YouTube Shorts?",
    a: "Yes — paste a Shorts link the same way you would a regular video URL.",
  },
  {
    q: "Will the downloaded video lose quality?",
    a: "No. We link directly to YouTube's own source files, so you get the same quality YouTube serves for that resolution.",
  },
  {
    q: "Do you store the videos I download?",
    a: "No. Nothing is uploaded to or cached on our servers — your browser downloads straight from YouTube's file source.",
  },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const getVideoId = (url) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^?&]+)/
    );

    return match ? match[1] : url;
  };

  const formatDuration = (seconds) => {
    seconds = Number(seconds);

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs) {
      return `${hrs}:${String(mins).padStart(2, "0")}:${String(
        secs
      ).padStart(2, "0")}`;
    }

    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const handleSearch = async () => {
    if (!url.trim()) return alert("Please enter a YouTube URL.");

    try {
      setLoading(true);
      setVideo(null);

      const id = getVideoId(url);

      const res = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong.");
        return;
      }

      setVideo(data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const downloads = video
    ? [...(video.formats || []), ...(video.adaptiveFormats || [])].filter(
        (item) => item.url && item.mimeType?.includes("video/mp4")
      )
    : [];

  return (
    <main className="min-h-screen bg-[#12142B] text-[#F5F1E8] selection:bg-[#F2A93B] selection:text-[#12142B]">
      {/* signature seam — fire meets ocean */}
      <div className="h-1 w-full bg-linear-to-r from-[#A31621] via-[#F2A93B] via-50% to-[#6FB3D2]" />

      {/* ---------- NAV ---------- */}
      <header className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-linear-to-br from-[#A31621] to-[#F2A93B] flex items-center justify-center font-bold text-[#12142B] text-sm">
            YT
          </span>
          <span className="font-semibold tracking-tight text-[#F5F1E8]">
           Dowty
          </span>
        </div>
        <span className="hidden sm:inline text-xs uppercase tracking-widest text-[#6FB3D2]">
          fast · free · no login
        </span>
      </header>

      {/* ---------- HERO / SEARCH ---------- */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-14 pb-10 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          Grab any YouTube video
          <span className="block text-transparent bg-clip-text bg-linear-to-r from-[#F2A93B] to-[#A31621]">
            in one paste.
          </span>
        </h1>
        <p className="mt-4 text-[#9BA3C4] text-sm sm:text-base max-w-md mx-auto">
          Drop a link below and choose the quality you want. No sign-up, no
          watermarks, no waiting rooms.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6FB3D2]" />
            <input
              type="text"
              placeholder="Paste YouTube URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full bg-[#1B2046] border border-[#2A2F5C] focus:border-[#F2A93B] focus:ring-2 focus:ring-[#F2A93B]/30 rounded-xl pl-11 pr-4 py-3.5 text-sm text-[#F5F1E8] placeholder:text-[#6C72A0] outline-none transition"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="shrink-0 rounded-xl px-6 py-3.5 font-semibold text-sm text-[#12142B] bg-linear-to-r from-[#F2A93B] to-[#A31621] hover:brightness-110 active:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg shadow-[#A31621]/20"
          >
            {loading ? "Fetching..." : "Get Video"}
          </button>
        </div>
      </section>

      {/* ---------- RESULT CARD ---------- */}
      {video && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="rounded-2xl overflow-hidden bg-[#1B2046] border border-[#2A2F5C] shadow-2xl shadow-black/30">
            <div className="relative">
              <Image
                src={
                  video.thumbnail?.[5]?.url ||
                  video.thumbnail?.[4]?.url ||
                  video.thumbnail?.[3]?.url ||
                  video.thumbnail?.[2]?.url ||
                  video.thumbnail?.[1]?.url ||
                  video.thumbnail?.[0]?.url
                }
                alt={video.title}
                width={1280}
                height={720}
                className="w-full aspect-video object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#12142B] via-transparent to-transparent opacity-60" />
            </div>

            <div className="p-5 sm:p-7">
              <h2 className="text-lg sm:text-2xl font-bold leading-snug">
                {video.title}
              </h2>

              <p className="mt-1.5 text-[#6FB3D2] text-sm font-medium">
                {video.channelTitle}
              </p>

              <div className="mt-3 flex items-center gap-5 text-xs sm:text-sm text-[#9BA3C4] font-mono">
                <span className="flex items-center gap-1.5">
                  <IconEye className="w-4 h-4 text-[#F2A93B]" />
                  {Number(video.viewCount).toLocaleString()} views
                </span>
                <span className="flex items-center gap-1.5">
                  <IconClock className="w-4 h-4 text-[#F2A93B]" />
                  {formatDuration(video.lengthSeconds)}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {downloads.length > 0 ? (
                  downloads.map((item) => (
                    <a                                  
                      key={item.itag}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 rounded-xl border border-[#2A2F5C] bg-[#12142B] hover:bg-linear-to-r hover:from-[#12142B] hover:to-[#1B2046] hover:border-[#6FB3D2] px-4 py-3 transition"
                    >
                      <span className="font-mono text-sm text-[#F5F1E8]">
                        {item.qualityLabel || `${item.height}p`}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-[#6FB3D2] group-hover:text-[#F2A93B] transition">
                        Download
                        <IconDownload className="w-3.5 h-3.5" />
                      </span>
                    </a>
                  ))
                ) : (
                  <p className="col-span-full text-center text-[#A31621] text-sm py-3">
                    No downloadable video found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------- HOW TO USE ---------- */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 border-t border-[#1B2046]">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#F2A93B] font-semibold">
            Walkthrough
          </span>
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold">How to use it</h3>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {HOW_TO_STEPS.map((step) => (
            <div
              key={step.n}
              className="rounded-xl bg-[#1B2046] border border-[#2A2F5C] p-5"
            >
              <span className="font-mono text-sm text-[#A31621] font-bold">
                {step.n}
              </span>
              <h4 className="mt-2 font-semibold text-[#F5F1E8]">
                {step.title}
              </h4>
              <p className="mt-1.5 text-sm text-[#9BA3C4] leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 border-t border-[#1B2046]">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#6FB3D2] font-semibold">
            Questions
          </span>
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold">
            Frequently asked questions
          </h3>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={faq.q}
                className="rounded-xl border border-[#2A2F5C] bg-[#1B2046] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="font-medium text-sm sm:text-base text-[#F5F1E8]">
                    {faq.q}
                  </span>
                  <IconChevron
                    className={`w-4 h-4 shrink-0 text-[#F2A93B] transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-sm text-[#9BA3C4] leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- PRIVACY POLICY ---------- */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 border-t border-[#1B2046]">
        <div className="rounded-2xl bg-linear-to-br from-[#1B2046] to-[#12142B] border border-[#2A2F5C] p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <IconShield className="w-5 h-5 text-[#6FB3D2]" />
            <h3 className="text-xl sm:text-2xl font-bold">Privacy policy</h3>
          </div>
          <div className="space-y-3 text-sm text-[#9BA3C4] leading-relaxed">
            <p>
              We don&apos;t store the videos you download or the links you
              paste. Each request is processed on the fly and discarded once
              the response is sent back to your browser.
            </p>
            <p>
              No account or personal information is required to use this
              tool. We don&apos;t sell, share, or track your download history.
            </p>
            <p>
              Downloaded files come directly from YouTube&apos;s own source
              URLs — this tool only locates them for you. Please respect
              copyright and YouTube&apos;s Terms of Service when downloading
              content.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-[#1B2046] bg-[#0F1124]">
        <div className="h-1 w-full bg-linear-to-r from-[#6FB3D2] via-[#F2A93B] via-50% to-[#A31621]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid gap-60 sm:grid-cols-3">
          {/* brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-lg bg-linear-to-br from-[#A31621] to-[#F2A93B] flex items-center justify-center font-bold text-[#12142B] text-sm">
                YT
              </span>
              <span className="font-semibold tracking-tight text-[#F5F1E8]">
                YouTube Downloader
              </span>
            </div>
            <p className="mt-3 text-sm text-[#6C72A0] leading-relaxed max-w-xs">
              Paste a link, pick a quality, done. No accounts, no watermarks,
              nothing kept on our end.
            </p>
          </div>

          

          {/* status / meta */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#6FB3D2] font-semibold mb-4">
              Status
            </h4>
            <ul className="space-y-2.5 text-sm text-[#9BA3C4]">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6FB3D2]" />
                No files stored on our servers
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F2A93B]" />
                No sign-up required
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A31621]" />
                Sourced directly from YouTube
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1B2046]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6C72A0]">
            <span>
              © {new Date().getFullYear()} YouTube Downloader. Not affiliated
              with YouTube or Google.
            </span>
            <a
              href="https://github.com/M-junaid-kha"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F2A93B] transition"
            >
              Built by @M-junaid-kha
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}