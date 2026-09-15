import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/* ─── KyioAPI code preview ─── */
const codeSnippets = {
  curl: `curl -sL "https://api.kyio.web.id/api/v2/ai/gpt-5-6-terra?q=Hello"`,
  js: `const res = await fetch("https://api.kyio.web.id/api/v2/ai/gpt-5-6-terra?q=Hello");\nconst data = await res.json();\nconsole.log(data);`,
  python: `import requests\n\nresponse = requests.get(\n    "https://api.kyio.web.id/api/v2/ai/gpt-5-6-terra",\n    params={"q": "Hello"}\n)\nprint(response.json())`,
} as const;

type CodeLanguage = keyof typeof codeSnippets;
type CopyState = 'idle' | 'copied' | 'failed';

const codeLanguageLabels: Record<CodeLanguage, string> = {
  curl: 'cURL',
  js: 'JavaScript',
  python: 'Python',
};

const externalLinkIcon = (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/* ─── Project data ─── */
const kyioCategories = [
  { label: 'AI', count: '15+', desc: 'GPT, Llama, Gemini' },
  { label: 'Download', count: '20+', desc: 'YT, TT, IG, FB' },
  { label: 'Stalk', count: '12+', desc: 'TikTok, Instagram' },
  { label: 'Tools', count: '30+', desc: 'Maker, Search, Info' },
];

const gistifyFeatures = [
  { icon: '⬚', label: 'Multi-File Snippets' },
  { icon: '⟳', label: 'GitHub Gist Sync' },
  { icon: '◈', label: 'Verified Profiles' },
  { icon: '▣', label: 'Syntax Highlighting' },
];

/* ─── Code showcase component ─── */
const CodeShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CodeLanguage>('curl');
  const [copyState, setCopyState] = useState<CopyState>('idle');

  const handleCopy = useCallback(async () => {
    const snippet = codeSnippets[activeTab];
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(snippet);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = snippet;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        try {
          textArea.select();
          const copied = document.execCommand('copy');
          if (!copied) throw new Error('Clipboard fallback failed');
        } finally {
          textArea.remove();
        }
      }
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
    window.setTimeout(() => setCopyState('idle'), 2200);
  }, [activeTab]);

  return (
    <div className="lg:col-span-6 w-full" aria-label="Contoh request KyioAPI">
      <div className="bg-[#050507] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white/[0.02] border-b border-white/5">
          <div className="flex min-w-0 items-center gap-2">
            <div aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            </div>
            <span className="truncate text-[10px] font-mono text-white/50">API_REQUEST_PREVIEW</span>
          </div>
          <button
            type="button"
            onClick={() => void handleCopy()}
            aria-live="polite"
            className="min-h-11 shrink-0 rounded-lg bg-white/5 px-3 text-[10px] font-mono font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            {copyState === 'copied' ? '✓ COPIED' : copyState === 'failed' ? 'COPY FAILED' : 'COPY CODE'}
          </button>
        </div>

        <div role="tablist" aria-label="Pilih bahasa contoh kode" className="flex overflow-x-auto border-b border-white/5 bg-black/40">
          {(Object.keys(codeSnippets) as CodeLanguage[]).map((language) => {
            const isActive = activeTab === language;
            const tabId = `kyio-tab-${language}`;
            const panelId = `kyio-panel-${language}`;
            return (
              <button
                key={language}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                onClick={() => {
                  setActiveTab(language);
                  setCopyState('idle');
                }}
                onKeyDown={(event) => {
                  const languages = Object.keys(codeSnippets) as CodeLanguage[];
                  const currentIndex = languages.indexOf(language);
                  const nextIndex = event.key === 'ArrowRight'
                    ? (currentIndex + 1) % languages.length
                    : event.key === 'ArrowLeft'
                      ? (currentIndex - 1 + languages.length) % languages.length
                      : event.key === 'Home'
                        ? 0
                        : event.key === 'End'
                          ? languages.length - 1
                          : -1;
                  if (nextIndex < 0) return;
                  event.preventDefault();
                  const nextLanguage = languages[nextIndex];
                  setActiveTab(nextLanguage);
                  document.getElementById(`kyio-tab-${nextLanguage}`)?.focus();
                }}
                className={`min-h-11 shrink-0 border-b-2 px-4 py-2 text-xs font-mono transition-colors focus-visible:outline-none ${
                  isActive
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-transparent text-white/50 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                {codeLanguageLabels[language]}
              </button>
            );
          })}
        </div>

        <div
          id={`kyio-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`kyio-tab-${activeTab}`}
          tabIndex={0}
          className="min-h-32 max-h-60 overflow-auto bg-black/80 p-4 font-mono text-xs leading-relaxed text-white/80 focus-visible:outline-none"
        >
          <pre className="whitespace-pre-wrap break-words sm:whitespace-pre"><code>{codeSnippets[activeTab]}</code></pre>
        </div>
        <p aria-live="polite" className="border-t border-white/5 px-4 py-2 text-[10px] font-mono text-white/40">
          {copyState === 'copied' ? `Snippet ${codeLanguageLabels[activeTab]} tersalin.` : copyState === 'failed' ? 'Clipboard tidak tersedia. Salin manual.' : 'Ganti bahasa untuk melihat contoh integrasi.'}
        </p>
      </div>
    </div>
  );
};

/* ─── Main Projects component ─── */
const Projects: React.FC = () => {
  return (
    <section id="projects" className="relative overflow-hidden border-t border-white/5 bg-[#050505] py-20 sm:py-28 md:py-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:mb-16 md:mb-24 md:flex-row md:items-end sm:gap-8">
          <div>
            <span className="mb-3 block font-mono text-xs uppercase tracking-[0.3em] text-accent">Portfolio Highlights</span>
            <h2 className="font-jakarta text-4xl font-black uppercase leading-none tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-[8rem]">
              FLAGSHIP <br /> <span className="text-accent">PROJECTS</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-base font-light leading-relaxed text-white/65 md:text-lg">
              Two platforms I built and maintain: a REST API gateway for developers, and a code snippet platform with GitHub Gist sync.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0d] p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] sm:p-7 md:p-12 mb-8"
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/10 blur-[100px]" />

          <div className="relative z-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col items-start gap-6 lg:col-span-6">
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
                01 — API PLATFORM
              </span>

              <div>
                <h3 className="mb-3 font-space text-3xl font-bold tracking-tight text-white md:text-5xl">KyioAPI Gateway</h3>
                <p className="text-sm font-light leading-relaxed text-white/65 md:text-base">
                  REST API gateway with 250+ endpoints for AI, media downloading, stalking, and tools. Multi-engine fallback keeps it working when individual providers go down.
                </p>
              </div>

              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-3" aria-label="Kategori endpoint KyioAPI">
                {kyioCategories.map((cat) => (
                  <div key={cat.label} className="group/cat relative rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-all hover:border-accent/30 hover:bg-white/[0.04]">
                    <span className="block text-[9px] font-mono uppercase tracking-wider text-white/40">{cat.label}</span>
                    <span className="block font-space text-xl font-black text-white transition group-hover/cat:text-accent">{cat.count}</span>
                    <span className="block text-[9px] text-white/30">{cat.desc}</span>
                  </div>
                ))}
              </div>

              <div className="grid w-full grid-cols-2 gap-4 border-t border-white/10 pt-5 sm:gap-6">
                <div>
                  <span className="block font-space text-2xl font-black text-white md:text-4xl">250+</span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-white/50">Active Endpoints</span>
                </div>
                <div>
                  <span className="block font-space text-2xl font-black text-accent md:text-4xl">Multi-Engine</span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-white/50">Fallback Redundancy</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="https://api.kyio.web.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Buka KyioAPI Gateway di tab baru"
                  className="interactive inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#4facfe] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#050505] transition duration-200 hover:brightness-110"
                >
                  <span>Buka Gateway</span>
                  {externalLinkIcon}
                </a>
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">Free · No API key needed</span>
              </div>
            </div>

            <CodeShowcase />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0d] p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] sm:p-7 md:p-12"
        >
          <div aria-hidden="true" className="pointer-events-none absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-accent/10 blur-[100px]" />

          <div className="relative z-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6 w-full order-2 lg:order-1">
              <div className="bg-[#050507] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white/[0.02] border-b border-white/5">
                  <div className="flex min-w-0 items-center gap-2">
                    <div aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="truncate text-[10px] font-mono text-white/50">gistify.web.id/snippet/akunlama-scraper</span>
                  </div>
                </div>
                <div className="bg-black/80 p-4 font-mono text-xs leading-relaxed text-white/80">
                  <div className="flex gap-4">
                    <div className="select-none text-white/20 text-right">
                      {Array.from({ length: 8 }, (_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div><span className="text-accent">const</span> <span className="text-white/60">snippet</span> = <span className="text-white/40">{'{'}</span></div>
                      <div className="pl-4"><span className="text-white/60">title:</span> <span className="text-green-400">'AkunLama Scraper'</span>,</div>
                      <div className="pl-4"><span className="text-white/60">author:</span> <span className="text-green-400">'@kyiov'</span>,</div>
                      <div className="pl-4"><span className="text-white/60">files:</span> <span className="text-white/40">[</span></div>
                      <div className="pl-8"><span className="text-green-400">'scraper.js'</span>,</div>
                      <div className="pl-8"><span className="text-green-400">'README.md'</span></div>
                      <div className="pl-4"><span className="text-white/40">]</span>,</div>
                      <div className="pl-4"><span className="text-white/60">synced:</span> <span className="text-accent">true</span></div>
                      <div><span className="text-white/40">{'}'}</span></div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/5 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_currentColor]" />
                    <span className="text-[10px] font-mono text-white/40">Gist synced · 2 files</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/30">JAVASCRIPT</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-6 lg:col-span-6 order-1 lg:order-2">
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
                02 — CODE PLATFORM
              </span>

              <div>
                <h3 className="mb-3 font-space text-3xl font-bold tracking-tight text-white md:text-5xl">Gistify</h3>
                <p className="text-sm font-light leading-relaxed text-white/65 md:text-base">
                  Platform for publishing and sharing multi-file code snippets with syntax highlighting. Syncs with GitHub Gist API v3 and gives developers a verified profile page.
                </p>
              </div>

              <div className="grid w-full grid-cols-2 gap-3" aria-label="Fitur Gistify">
                {gistifyFeatures.map((feat) => (
                  <div key={feat.label} className="group/feat flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-all hover:border-accent/30 hover:bg-white/[0.04]">
                    <span className="text-lg text-accent">{feat.icon}</span>
                    <span className="text-xs font-medium text-white/70 transition group-hover/feat:text-white">{feat.label}</span>
                  </div>
                ))}
              </div>

              <div className="grid w-full grid-cols-2 gap-4 border-t border-white/10 pt-5 sm:gap-6">
                <div>
                  <span className="block font-space text-2xl font-black text-white md:text-4xl">GitHub</span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-white/50">Gist API v3 Sync</span>
                </div>
                <div>
                  <span className="block font-space text-2xl font-black text-accent md:text-4xl">Next.js</span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-white/50">App Router</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="https://app.gistify.web.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Buka Gistify di tab baru"
                  className="interactive inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#4facfe] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#050505] transition duration-200 hover:brightness-110"
                >
                  <span>Buka Gistify</span>
                  {externalLinkIcon}
                </a>
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">Next.js · GitHub Gist API</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
