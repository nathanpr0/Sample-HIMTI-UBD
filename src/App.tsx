import { useEffect, useState, useRef, useCallback } from "react";
import logoHimti from "@/imports/Logo_HIMTI.png";
import logoUbd from "@/imports/Logo_UBD.png";
import maskotHero from "@/imports/Maskot_Hero.png";
import maskotTentang from "@/imports/Maskot_Tentang.png";
import maskotStruktur from "@/imports/Maskot_Struktur.png";
import maskotBerita from "@/imports/Maskot_Berita.png";

// ─── Scroll fade hook ────────────────────────────────────────────────────────
function useSectionFade() {
  useEffect(() => {
    const els = document.querySelectorAll(".section-fade");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ─── Active section hook ──────────────────────────────────────────────────────
const NAV_SECTIONS = ["beranda", "tentang", "struktur", "berita", "kontak"];

function useActiveSection() {
  const [active, setActive] = useState("beranda");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    NAV_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
const navLinks = [
  { label: "Beranda", href: "#beranda", id: "beranda" },
  { label: "Tentang HIMTI", href: "#tentang", id: "tentang" },
  { label: "Struktur HIMTI", href: "#struktur", id: "struktur" },
  { label: "Berita", href: "#berita", id: "berita" },
  { label: "Kontak", href: "#kontak", id: "kontak" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection();

  // Sliding indicator state
  const navRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const updateIndicator = useCallback((id: string) => {
    const el = linkRefs.current[id];
    const container = navRef.current;
    if (!el || !container) return;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicator({
      left: elRect.left - containerRect.left,
      width: elRect.width,
      opacity: 1,
    });
  }, []);

  useEffect(() => {
    updateIndicator(active);
  }, [active, updateIndicator]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0B1220]/90 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/5"
          : "bg-[#0B1220]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo – clickable, scrolls to top */}
          <a
            href="#beranda"
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label="Kembali ke Beranda"
          >
            <img
              src={logoHimti}
              alt="Logo HIMTI"
              className="h-9 w-9 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-bold text-lg text-white tracking-tight group-hover:text-blue-400 transition-colors duration-200">
              HIMTI
            </span>
          </a>

          {/* Center nav – desktop with sliding indicator */}
          <div ref={navRef} className="hidden lg:flex items-center gap-1 relative">
            {/* Sliding underline indicator */}
            <span
              className="absolute bottom-0 h-0.5 rounded-full bg-blue-500 transition-all duration-300 ease-out"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.opacity,
              }}
            />
            {navLinks.map((l) => (
              <a
                key={l.id}
                href={l.href}
                ref={(el) => { linkRefs.current[l.id] = el; }}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  active === l.id
                    ? "text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right CTA */}
          <div className="hidden lg:block">
            <a
              href="#tentang"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-900/40"
            >
              Bergabung Mengenal HIMTI
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/5 pb-4 pt-2 space-y-1">
            {navLinks.map((l) => (
              <a
                key={l.id}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  active === l.id
                    ? "text-blue-400 bg-blue-500/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {l.label}
              </a>
            ))}
            <div className="px-4 pt-2">
              <a
                href="#tentang"
                onClick={() => setMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors"
              >
                Bergabung Mengenal HIMTI
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-[#0B1220]"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-10 w-80 h-80 bg-blue-700/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-700/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #38BDF8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Corner accent lines */}
        <svg className="absolute top-0 right-0 opacity-10" width="300" height="300" viewBox="0 0 300 300">
          <line x1="300" y1="0" x2="0" y2="300" stroke="#2563EB" strokeWidth="1" />
          <line x1="300" y1="50" x2="50" y2="300" stroke="#38BDF8" strokeWidth="0.5" />
          <line x1="300" y1="100" x2="100" y2="300" stroke="#06B6D4" strokeWidth="0.5" />
        </svg>
        <div className="absolute top-36 left-[14%] w-2 h-2 rounded-full bg-blue-400 opacity-50" />
        <div className="absolute top-64 left-[9%] w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-40" />
        <div className="absolute bottom-44 left-[18%] w-2.5 h-2.5 rounded-full bg-sky-400 opacity-30" />
        <div className="absolute top-48 right-[9%] w-2 h-2 rounded-full bg-blue-500 opacity-40" />
        <svg className="absolute bottom-28 left-[6%] opacity-10" width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="35" fill="none" stroke="#2563EB" strokeWidth="1.5" />
          <circle cx="40" cy="40" r="20" fill="none" stroke="#38BDF8" strokeWidth="1" />
        </svg>
        <svg className="absolute top-20 right-[11%] opacity-10" width="60" height="60" viewBox="0 0 60 60">
          <rect x="5" y="5" width="50" height="50" rx="8" fill="none" stroke="#06B6D4" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left */}
          <div className="animate-fade-in-up">
            {/* Eyebrow label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
                Himpunan Mahasiswa Teknik Informatika
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-none tracking-tight mb-4"
              style={{
                background: "linear-gradient(135deg, #FFFFFF 0%, #E0EEFF 40%, #38BDF8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.03em",
              }}
            >
              HIMTI
            </h1>

            <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold leading-snug mb-6">
              <span className="text-white">Himpunan Mahasiswa</span>{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #38BDF8, #06B6D4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Teknik Informatika
              </span>
              <br />
              <span className="text-slate-300 font-semibold text-lg lg:text-xl">
                Universitas Buddhi Dharma
              </span>
            </h2>

            <p className="text-base lg:text-lg text-slate-400 leading-relaxed max-w-lg mb-8">
              HIMTI merupakan organisasi kemahasiswaan Program Studi Teknik Informatika Universitas Buddhi Dharma yang menjadi wadah bagi mahasiswa untuk berkembang, berkolaborasi, berinovasi, serta memberikan kontribusi nyata melalui teknologi.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#tentang"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-900/50"
              >
                Jelajahi HIMTI
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#berita"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-slate-300 font-semibold hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/5 active:scale-95 transition-all duration-200"
              >
                Lihat Berita
              </a>
            </div>
          </div>

          {/* Right – mascot */}
          <div className="flex justify-center lg:justify-end items-center relative">
            <div className="relative">
              <div className="absolute inset-0 -m-8 bg-blue-600/20 rounded-full blur-3xl" />
              <div className="absolute inset-0 -m-4 bg-cyan-500/10 rounded-full blur-2xl" />
              <img
                src={maskotHero}
                alt="Maskot HIMTI"
                className="relative w-72 sm:w-80 lg:w-96 xl:w-105 h-auto object-contain animate-float drop-shadow-2xl"
                style={{ filter: "drop-shadow(0 0 40px rgba(37,99,235,0.35))" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Visi & Misi ─────────────────────────────────────────────────────────────
const misiData = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Lingkungan Kolaboratif",
    desc: "Membentuk organisasi yang aktif, dinamis, dan penuh semangat kebersamaan.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Budaya Saling Mendukung",
    desc: "Menumbuhkan rasa saling menghargai dan mendukung antar anggota secara tulus.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Pengembangan Potensi",
    desc: "Menjadi tempat tumbuhnya minat dan bakat setiap mahasiswa agar dapat berkembang secara optimal.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Kegiatan Teknologi",
    desc: "Mengadakan program berbasis teknologi dan kreativitas yang relevan dengan perkembangan zaman.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "Jiwa Kepemimpinan",
    desc: "Menanamkan rasa tanggung jawab serta membangun karakter sebagai pemimpin masa depan.",
  },
];

function VisiMisi() {
  return (
    <section id="visi-misi" className="py-20 lg:py-28 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 section-fade">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 mb-4">
            Visi &amp; Misi
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white">
            Visi &amp; Misi
          </h2>
        </div>

        {/* Vision card */}
        <div className="section-fade mb-10">
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-700 via-blue-600 to-cyan-600 p-8 lg:p-10 shadow-xl shadow-blue-900/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-white/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-white/90 uppercase tracking-wide">Visi</span>
              </div>
              <p className="text-lg lg:text-xl font-medium leading-relaxed text-white/95 max-w-3xl">
                Menjadi wadah pengembangan mahasiswa Teknik Informatika yang kreatif, inovatif, dan mampu memberikan kontribusi nyata melalui teknologi.
              </p>
            </div>
          </div>
        </div>

        {/* Mission cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 section-fade">
          {misiData.map((m, i) => (
            <div
              key={i}
              className="group bg-[#1A2332] rounded-2xl p-6 border border-white/5 shadow-sm hover:shadow-blue-900/30 hover:shadow-lg hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-300 cursor-default"
            >
              <div className="inline-flex p-3 rounded-xl bg-blue-500/10 text-blue-400 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {m.icon}
              </div>
              <h3 className="font-bold text-white mb-2 text-sm leading-snug">{m.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Tentang HIMTI ───────────────────────────────────────────────────────────
function TentangHimti() {
  return (
    <section id="tentang" className="py-20 lg:py-28 bg-[#0B1220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left – mascot */}
          <div className="flex justify-center section-fade">
            <div className="relative">
              <div className="absolute inset-0 -m-8 bg-blue-600/20 rounded-full blur-3xl" />
              <img
                src={maskotTentang}
                alt="Maskot Tentang HIMTI"
                className="relative w-64 sm:w-80 lg:w-96 h-auto object-contain animate-float-slow drop-shadow-2xl"
                style={{ filter: "drop-shadow(0 0 30px rgba(56,189,248,0.25))" }}
              />
            </div>
          </div>

          {/* Right */}
          <div className="section-fade">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 mb-4">
              Tentang Kami
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6 leading-tight">
              Tentang HIMTI
            </h2>
            <p className="text-base lg:text-lg text-slate-400 leading-relaxed mb-6">
              HIMTI adalah Himpunan Mahasiswa Teknik Informatika Universitas Buddhi Dharma yang menjadi wadah bagi mahasiswa untuk mengembangkan kemampuan akademik, kepemimpinan, kreativitas, kerja sama, dan inovasi di bidang teknologi. Melalui berbagai kegiatan yang inspiratif, HIMTI berkomitmen menciptakan lingkungan yang aktif, kolaboratif, serta mampu memberikan manfaat bagi mahasiswa maupun masyarakat.
            </p>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#1A2332] border border-white/5">
              <img src={logoUbd} alt="Logo UBD" className="h-10 w-10 object-contain shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">Universitas Buddhi Dharma</p>
                <p className="text-xs text-slate-400">Program Studi Teknik Informatika</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Struktur HIMTI ──────────────────────────────────────────────────────────
const struktur = {
  BPH: {
    label: "BPH",
    members: [
      { name: "Andi Saputra", position: "Ketua" },
      { name: "Budi Santoso", position: "Wakil Ketua" },
      { name: "Citra Lestari", position: "Sekretaris 1" },
      { name: "Dina Puspita", position: "Sekretaris 2" },
      { name: "Eko Prasetyo", position: "Bendahara" },
    ],
  },
  "Humas Luar": {
    label: "Humas Luar",
    members: [
      { name: "Farah Aulia", position: "Koordinator" },
      { name: "Gilang Ramadhan", position: "Anggota" },
      { name: "Hana Dewi", position: "Anggota" },
      { name: "Ivan Kurniawan", position: "Anggota" },
    ],
  },
  "Humas Dalam": {
    label: "Humas Dalam",
    members: [
      { name: "Joko Widodo", position: "Koordinator" },
      { name: "Kartika Sari", position: "Anggota" },
      { name: "Luthfi Hakim", position: "Anggota" },
      { name: "Maya Indah", position: "Anggota" },
    ],
  },
  RND: {
    label: "RND",
    members: [
      { name: "Nanda Pratiwi", position: "Koordinator" },
      { name: "Oscar Fernando", position: "Anggota" },
      { name: "Putri Rahayu", position: "Anggota" },
      { name: "Rizky Maulana", position: "Anggota" },
      { name: "Siti Aisyah", position: "Anggota" },
    ],
  },
  "Design & Konten Kreator": {
    label: "Design & Konten Kreator",
    members: [
      { name: "Toni Setiawan", position: "Koordinator Design" },
      { name: "Ulfa Nurhayati", position: "Koordinator Konten Kreator" },
      { name: "Vina Kusuma", position: "Anggota" },
      { name: "Wahyu Hidayat", position: "Anggota" },
      { name: "Xena Putri", position: "Anggota" },
      { name: "Yoga Pratama", position: "Anggota" },
    ],
  },
};

function MemberCard({ name, position }: { name: string; position: string }) {
  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#202B3D] shrink-0 shadow-sm group-hover:shadow-blue-900/30 transition-shadow border border-white/5">
        <img
          src={maskotStruktur}
          alt={name}
          className="w-full h-full object-contain p-1"
        />
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-slate-200 leading-tight">{name}</p>
        <p className="text-[10px] text-blue-400 font-medium leading-tight mt-0.5">{position}</p>
      </div>
    </div>
  );
}

function StrukturHimti() {
  return (
    <section id="struktur" className="py-20 lg:py-28 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 section-fade">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 mb-4">
            Organisasi
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">
            Struktur HIMTI
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Susunan kepengurusan HIMTI Universitas Buddhi Dharma.
          </p>
        </div>

        {/* BPH */}
        <div className="section-fade mb-8">
          <div className="bg-[#1A2332] rounded-2xl border border-white/5 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-blue-500" />
              <h3 className="font-bold text-white text-lg">{struktur.BPH.label}</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {struktur.BPH.members.map((m) => (
                <MemberCard key={m.name} name={m.name} position={m.position} />
              ))}
            </div>
          </div>
        </div>

        {/* Divisi cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 section-fade">
          {(["Humas Luar", "Humas Dalam", "RND", "Design & Konten Kreator"] as const).map((key) => {
            const divisi = struktur[key];
            return (
              <div
                key={key}
                className="bg-[#1A2332] rounded-2xl border border-white/5 shadow-sm p-5 hover:shadow-blue-900/20 hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-5 rounded-full bg-cyan-500" />
                  <h3 className="font-bold text-white text-sm">{divisi.label}</h3>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  {divisi.members.map((m) => (
                    <MemberCard key={m.name} name={m.name} position={m.position} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Berita ──────────────────────────────────────────────────────────────────
const beritaData = [
  {
    category: "Seminar",
    title: "HIMTI Mengadakan Seminar Teknologi Artificial Intelligence",
    excerpt: "Seminar yang membahas perkembangan Artificial Intelligence serta penerapannya di dunia industri bersama narasumber profesional.",
    date: "15 Juli 2026",
    color: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  },
  {
    category: "Workshop",
    title: "Workshop Web Development untuk Mahasiswa Teknik Informatika",
    excerpt: "Workshop interaktif yang memperkenalkan teknologi web modern mulai dari HTML, CSS, JavaScript hingga framework terkini.",
    date: "8 Juli 2026",
    color: "bg-green-500/15 text-green-400 border border-green-500/20",
  },
  {
    category: "Kegiatan",
    title: "Sharing Session Bersama Alumni Teknik Informatika",
    excerpt: "Kegiatan berbagi pengalaman mengenai dunia kerja, pengembangan karier, dan persiapan mahasiswa menghadapi industri digital.",
    date: "1 Juli 2026",
    color: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  },
];

function NewsCard({ item }: { item: typeof beritaData[0] }) {
  return (
    <div className="group bg-[#1A2332] rounded-2xl border border-white/5 shadow-sm overflow-hidden hover:shadow-blue-900/20 hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/20 transition-all duration-300 flex flex-col">
      {/* Image placeholder */}
      <div className="h-44 bg-linear-to-br from-[#202B3D] to-[#111827] flex items-center justify-center shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 left-4 w-8 h-8 rounded-full border border-blue-700" />
          <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full border border-cyan-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-blue-600" />
        </div>
        <div
          className="text-4xl font-mono font-bold opacity-10"
          style={{
            background: "linear-gradient(135deg, #38BDF8, #06B6D4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {"{ }"}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.color}`}>
            {item.category}
          </span>
          <span className="text-xs text-slate-500">{item.date}</span>
        </div>
        <h3 className="font-bold text-white leading-snug mb-2 text-sm lg:text-base line-clamp-2">
          {item.title}
        </h3>
        <p className="text-xs lg:text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4 flex-1">
          {item.excerpt}
        </p>
        <button className="w-full py-2 rounded-xl text-sm font-semibold text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200">
          Baca Selengkapnya
        </button>
      </div>
    </div>
  );
}

function Berita() {
  return (
    <section id="berita" className="py-20 lg:py-28 bg-[#0B1220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-14 section-fade">
          <div className="flex-1">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 mb-4">
              Informasi Terkini
            </span>
            <div className="flex items-center gap-4">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white">
                Berita HIMTI
              </h2>
              <img
                src={maskotBerita}
                alt="Maskot Berita"
                className="h-16 w-16 object-contain animate-float-slow"
                style={{ filter: "drop-shadow(0 0 12px rgba(56,189,248,0.3))" }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 section-fade">
          {beritaData.map((item, i) => (
            <NewsCard key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Kontak ──────────────────────────────────────────────────────────────────
function Kontak() {
  const leftContacts = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: "Email",
      value: "himti@buddhidharma.ac.id",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
      label: "Instagram",
      value: "@himti.ubd",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: "WhatsApp",
      value: "+62 813-1975-5386",
    },
  ];

  return (
    <section id="kontak" className="py-20 lg:py-28 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 section-fade">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 mb-4">
            Hubungi Kami
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white">Kontak</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start section-fade">
          {/* Left – intro + Email / Instagram / WhatsApp */}
          <div>
            <p className="text-base lg:text-lg text-slate-400 leading-relaxed mb-8">
              Memiliki pertanyaan, masukan, atau ingin mengenal HIMTI lebih dekat? Jangan ragu untuk menghubungi kami melalui informasi kontak berikut.
            </p>
            <div className="space-y-4">
              {leftContacts.map((c) => (
                <div
                  key={c.label}
                  className="flex items-start gap-4 bg-[#1A2332] rounded-xl p-4 border border-white/5 shadow-sm hover:border-blue-500/20 hover:shadow-blue-900/20 hover:shadow-md transition-all"
                >
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
                      {c.label}
                    </p>
                    <p className="text-sm font-medium text-slate-200">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – Address card + Map */}
          <div className="space-y-5">
            {/* Address card */}
            <div className="flex items-start gap-4 bg-[#1A2332] rounded-xl p-4 border border-white/5 shadow-sm hover:border-blue-500/20 hover:shadow-blue-900/20 hover:shadow-md transition-all">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
                  Alamat
                </p>
                <p className="text-sm font-medium text-slate-200 leading-relaxed whitespace-pre-line">
                  {"Universitas Buddhi Dharma\nJalan Imam Bonjol, Kecamatan Karawaci, Kelurahan Karawaci, Kota Tangerang 15115"}
                </p>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="relative rounded-2xl overflow-hidden border border-white/5 shadow-sm h-56 bg-linear-to-br from-[#1A2332] to-[#202B3D] flex flex-col items-center justify-center gap-3">
              <div className="p-4 rounded-full bg-blue-500/10">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-200">Universitas Buddhi Dharma</p>
                <p className="text-xs text-slate-500 mt-1">Jl. Imam Bonjol, Karawaci, Tangerang 15115</p>
              </div>
              <a
                href="https://maps.google.com/?q=Universitas+Buddhi+Dharma+Tangerang"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Buka di Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#0B1220] border-t border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <img src={logoHimti} alt="Logo HIMTI" className="h-10 w-10 object-contain" />
            <div>
              <p className="font-bold text-white text-base leading-tight">HIMTI</p>
              <p className="text-xs text-slate-500 leading-tight">Universitas Buddhi Dharma</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 font-medium text-center">
            HIMTI Universitas Buddhi Dharma
          </p>
          <img src={logoUbd} alt="Logo UBD" className="h-10 w-10 object-contain opacity-60" />
        </div>
        <div className="border-t border-white/5 pt-6 text-center">
          <p className="text-xs text-slate-600">
            © 2026 HIMTI Universitas Buddhi Dharma. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  useSectionFade();
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <Hero />
      <VisiMisi />
      <TentangHimti />
      <StrukturHimti />
      <Berita />
      <Kontak />
      <Footer />
    </div>
  );
}
