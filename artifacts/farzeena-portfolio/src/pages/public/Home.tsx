import { 
  useGetHeroSection, useListCaseStudies, useListBlogs, 
  useGetAboutSection, useGetSiteSettings, useSubmitContact 
} from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, FileText, Database, Server, BarChart3, CheckCircle2, ExternalLink, BookOpen, Linkedin, Send, X, LineChart, Layers } from "lucide-react";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_HEADLINES = [
  "Analytics Engineering for Data-Driven Decisions",
  "Transforming Raw Data into Business Intelligence",
  "Building Scalable Pipelines & BI Dashboards",
  "Helping Teams Make Confident Data-Backed Decisions",
];

const PIPELINE_DEFAULTS = [
  { label: "Data Sources", icon: "Database", desc: "APIs, databases, flat files & event streams" },
  { label: "ETL / ELT", icon: "Server", desc: "Python pipelines, dbt transformations" },
  { label: "Data Warehouse", icon: "Layers", desc: "BigQuery, Snowflake, Redshift schemas" },
  { label: "BI Dashboards", icon: "BarChart3", desc: "Power BI, Tableau, Looker reports" },
];

function PipelineIcon({ name }: { name: string }) {
  if (name === "Database") return <Database className="w-6 h-6" />;
  if (name === "Server") return <Server className="w-6 h-6" />;
  if (name === "BarChart3") return <BarChart3 className="w-6 h-6" />;
  if (name === "LineChart") return <LineChart className="w-6 h-6" />;
  return <Layers className="w-6 h-6" />;
}

function HeroVisualization() {
  const data = [38, 52, 44, 68, 57, 75, 82, 91];
  const W = 280, H = 148;
  const pad = { t: 8, r: 8, b: 22, l: 8 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;
  const max = Math.max(...data);
  const pts = data.map((d, i) => ({
    x: pad.l + (i / (data.length - 1)) * cW,
    y: pad.t + cH - (d / max) * cH,
  }));
  const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaD = `${lineD} L${pts[pts.length - 1].x},${H - pad.b} L${pts[0].x},${H - pad.b} Z`;

  return (
    <div className="relative w-full max-w-[300px]">
      <div className="flex gap-2 mb-3">
        <div className="flex-1 bg-white border border-slate-200/80 rounded-xl px-3 py-2.5 shadow-sm">
          <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wide leading-none mb-1.5">Data Quality</p>
          <p className="text-base font-bold text-slate-800">99.2%</p>
        </div>
        <div className="flex-1 bg-white border border-slate-200/80 rounded-xl px-3 py-2.5 shadow-sm">
          <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wide leading-none mb-1.5">Pipeline Uptime</p>
          <p className="text-base font-bold text-primary">98.7%</p>
        </div>
        <div className="flex-1 bg-white border border-slate-200/80 rounded-xl px-3 py-2.5 shadow-sm">
          <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wide leading-none mb-1.5">Rows / mo</p>
          <p className="text-base font-bold text-slate-800">1.2M</p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-2xl px-4 pt-3.5 pb-2 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-slate-500 font-medium tracking-wide">Pipeline Throughput</p>
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">↑ 23%</span>
        </div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="text-primary overflow-visible">
          <defs>
            <linearGradient id="heroAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          {[0.33, 0.66, 1].map((r, i) => (
            <line key={i}
              x1={pad.l} y1={pad.t + cH * (1 - r)}
              x2={W - pad.r} y2={pad.t + cH * (1 - r)}
              stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 5"
            />
          ))}
          <path d={areaD} fill="url(#heroAreaGrad)" />
          <path d={lineD} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {pts.slice(0, -1).map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="currentColor" opacity="0.3" />
          ))}
          <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="5.5" fill="white" stroke="currentColor" strokeWidth="2" />
          <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2.5" fill="currentColor" />
          {["Q1", "Q2", "Q3", "Q4"].map((label, i) => (
            <text key={label}
              x={pad.l + ((i * 2 + 1) / (data.length - 1)) * cW}
              y={H - 4}
              textAnchor="middle" fontSize="8" fill="#94a3b8"
              fontFamily="system-ui,sans-serif"
            >{label}</text>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: hero } = useGetHeroSection();
  const { data: caseStudies } = useListCaseStudies({ status: "published", featured: true });
  const { data: blogs } = useListBlogs({ status: "published", featured: true });
  const { data: about } = useGetAboutSection();
  const { data: settings } = useGetSiteSettings();

  // Vertical sliding carousel — cycles through headlines
  const headlines = hero?.pipelineSteps?.length
    ? hero.pipelineSteps.map(s => s.label).filter(Boolean)
    : DEFAULT_HEADLINES;

  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    if (headlines.length <= 1) return;
    const t = setInterval(() => setSlideIdx(i => (i + 1) % headlines.length), 3800);
    return () => clearInterval(t);
  }, [headlines.length]);

  const pipelineSteps = PIPELINE_DEFAULTS;

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* 1. HERO — 2-column: text left, visualization right */}
      <section className="relative pt-10 pb-14 lg:pt-20 lg:pb-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[420px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

            {/* LEFT: text content */}
            <motion.div
              className="flex-1 min-w-0 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5 border border-primary/15">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {hero?.badgeText || "Analytics Engineer · Data & Business Intelligence"}
              </div>

              <div className="relative h-[148px] sm:h-[136px] lg:h-[120px] flex items-center justify-center lg:justify-start mb-8 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h1
                    key={slideIdx}
                    initial={{ y: 44, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -44, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute w-full text-center lg:text-left text-xl sm:text-2xl lg:text-4xl text-navy tracking-tight font-medium leading-snug px-2 lg:px-0"
                  >
                    {headlines[slideIdx]}
                  </motion.h1>
                </AnimatePresence>
              </div>

              <div className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-3">
                <Link
                  href={hero?.cta1Link || "/case-studies"}
                  className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium border border-primary hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm tracking-wide"
                >
                  {hero?.cta1Text || "View Case Studies"} <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-6 py-2.5 rounded-lg text-slate-700 font-medium border border-slate-300 hover:border-navy hover:text-navy transition-colors text-sm tracking-wide"
                >
                  {hero?.cta2Text || "About Me"}
                </button>
              </div>
            </motion.div>

            {/* RIGHT: minimalist data visualization */}
            <motion.div
              className="hidden lg:flex flex-shrink-0 w-[300px] xl:w-[320px] items-center justify-center"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.25 }}
            >
              <HeroVisualization />
            </motion.div>

          </div>
        </div>
      </section>
      {/* 2. DATA PIPELINE ARCHITECTURE SECTION */}
      <section className="py-12 bg-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-indigo-400 blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Data Pipeline Architecture</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">End-to-end data engineering from raw sources to business-ready dashboards</p>
          </div>

          {/* Horizontal pipeline steps */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-0">
            {pipelineSteps.map((step, idx) => (
              <div key={idx} className="flex flex-row sm:flex-col items-center sm:items-center w-full sm:w-auto">
                {/* Card */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 sm:p-6 w-full sm:w-44 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/30 transition-colors">
                    <PipelineIcon name={step.icon} />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm sm:text-base">{step.label}</div>
                    <div className="text-slate-400 text-xs mt-1 leading-snug">{step.desc}</div>
                  </div>
                </motion.div>

                {/* Arrow connector */}
                {idx < pipelineSteps.length - 1 && (
                  <div className="text-slate-600 text-xl sm:text-2xl font-bold px-3 sm:px-4 shrink-0 rotate-90 sm:rotate-0">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* 3. CASE STUDIES CAROUSEL */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-navy mb-4">Featured Case Studies</h2>
            <p className="text-muted-foreground max-w-2xl">Deep dives into complex data problems and the engineering solutions that solved them.</p>
          </div>
          <Link href="/case-studies" className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar gap-6 snap-x snap-mandatory pb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
            {caseStudies?.map((cs) => (
              <div key={cs._id} className="min-w-[280px] w-[280px] sm:min-w-[320px] bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col snap-start group overflow-hidden">
                <div className="aspect-video w-full bg-gradient-to-br from-blue-100 to-indigo-50 relative overflow-hidden flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-primary/20" />
                  {cs.coverImageUrl && (
                    <img src={getGoogleDriveImageUrl(cs.coverImageUrl)} alt={cs.title} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-navy mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{cs.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{cs.shortDescription}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {cs.tools?.slice(0,3).map(t => (
                      <span key={t} className="px-2.5 py-1 rounded-md bg-blue-50 text-primary text-xs font-semibold border border-blue-100">{t}</span>
                    ))}
                    {(cs.tools?.length || 0) > 3 && <span className="px-2 py-1 text-xs text-slate-400">+{cs.tools!.length - 3}</span>}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link href={`/case-studies/${cs.slug}`} className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors text-center">
                      Read Case Study
                    </Link>
                    <div className="flex gap-2">
                      {(cs as any).documentUrl && (
                        <a href={(cs as any).documentUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="flex-1 py-2 rounded-lg bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-blue-50 hover:text-primary border border-slate-200 transition-colors text-center flex items-center justify-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> View Doc
                        </a>
                      )}
                      {(cs as any).dashboardUrl && (
                        <a href={(cs as any).dashboardUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="flex-1 py-2 rounded-lg bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-green-50 hover:text-green-700 border border-slate-200 transition-colors text-center flex items-center justify-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" /> Live Dashboard
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!caseStudies?.length && (
              <div className="w-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-2xl">
                No featured case studies yet.
              </div>
            )}
          </div>
          <Link href="/case-studies" className="sm:hidden w-full py-4 mt-4 rounded-xl border-2 border-primary/20 text-primary font-bold text-center block">
            View All Case Studies
          </Link>
        </div>
      </section>
      {/* 4. BLOGS GRID */}
      <section className="py-16 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-navy mb-4">Analytics Insights</h2>
            <p className="text-muted-foreground">Articles, tutorials, and thoughts on data engineering, analytics workflows, and business intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs?.slice(0,3).map((blog) => (
              <Link key={blog._id} href={`/blogs/${blog.slug}`} className="group flex flex-col">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-slate-200 relative flex items-center justify-center">
                  <FileText className="w-12 h-12 text-slate-400" />
                  {blog.coverImageUrl && (
                    <img src={getGoogleDriveImageUrl(blog.coverImageUrl)} alt={blog.title} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-700">
                    {blog.readingTime || 5} min read
                  </div>
                </div>
                <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h3>
                <p className="text-muted-foreground line-clamp-2 mb-4 text-sm">{blog.shortDescription}</p>
                <div className="mt-auto flex items-center text-primary font-semibold text-sm">
                  Read Article <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/blogs" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold transition-colors">
              Browse All Articles
            </Link>
          </div>
        </div>
      </section>
      {/* 5. ABOUT ME */}
      <section className="py-20" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
               <h2 className="text-3xl font-bold text-navy mb-6">About Me</h2>
               <div className="text-xl text-slate-700 mb-6 font-medium">
                 Hi, I'm <span className="relative inline-block">
                    <span className="relative z-10 font-bold text-navy">{about?.name || "Farzeena"}</span>
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -rotate-2 z-0"></span>
                 </span>
               </div>
               <div className="prose prose-slate mb-8 text-muted-foreground">
                 {about?.bio || "I am a Data & Analytics Engineer passionate about transforming messy data into clean, structured assets that drive business intelligence. With expertise across the modern data stack, I build robust pipelines and intuitive dashboards."}
               </div>

               <div className="mb-8">
                 <h4 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-sm">Focus Areas</h4>
                 <ul className="space-y-3">
                   {(about?.focusAreas || [
                     { text: "Data Modeling & Architecture", icon: "database" },
                     { text: "ETL/ELT Pipeline Development", icon: "server" },
                     { text: "Business Intelligence & Visualization", icon: "chart" }
                   ]).map((area, i) => (
                     <li key={i} className="flex items-center gap-3 text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        <span>{area.text}</span>
                     </li>
                   ))}
                 </ul>
               </div>

               <div>
                  <h4 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-sm">Industries</h4>
                  <div className="flex flex-wrap gap-2">
                    {(about?.industryTags?.length ? about.industryTags.map(t=>t.label) : ['E-Commerce', 'FinTech', 'SaaS', 'Healthcare']).map((tag, i) => (
                      <span key={i} className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium border border-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
               </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Soft ambient glows */}
                <div className="absolute -top-10 -right-10 w-56 h-56 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-10 w-40 h-40 bg-indigo-300/25 rounded-full blur-2xl pointer-events-none" />

                {/* Dot grid — top-left */}
                <div className="absolute -top-5 -left-5 grid grid-cols-4 gap-[6px] z-20 opacity-70">
                  {Array(16).fill(0).map((_, i) => (
                    <div key={i} className="w-[5px] h-[5px] rounded-full bg-primary/60" />
                  ))}
                </div>

                {/* Dot grid — bottom-right */}
                <div className="absolute -bottom-5 -right-5 grid grid-cols-4 gap-[6px] z-20 opacity-50">
                  {Array(16).fill(0).map((_, i) => (
                    <div key={i} className="w-[5px] h-[5px] rounded-full bg-navy/50" />
                  ))}
                </div>

                {/* Offset border layer */}
                <div className="absolute inset-0 rounded-3xl border-2 border-primary/30 translate-x-5 translate-y-5 z-0" />
                {/* Offset fill layer */}
                <div className="absolute inset-0 rounded-3xl bg-primary/10 translate-x-3 translate-y-3 z-0" />

                {/* Main image frame */}
                <div className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 md:w-[22rem] md:h-[22rem] rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-slate-100">
                  {about?.profileImageUrl ? (
                    <img
                      src={getGoogleDriveImageUrl(about.profileImageUrl)}
                      alt={about?.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <img
                      src={`${import.meta.env.BASE_URL}images/hijabi-portrait.png`}
                      alt="Farzeena"
                      className="w-full h-full object-cover object-top"
                    />
                  )}
                  {/* Theme colour tint overlay */}
                  <div className="absolute inset-0 bg-primary/10 mix-blend-multiply pointer-events-none" />
                </div>

                {/* Floating badge chip */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white rounded-full px-4 py-1.5 shadow-lg border border-slate-100 flex items-center gap-2 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-semibold text-slate-700">Analytics Engineer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 6. CONTACT SECTION */}
      <section className="py-16" id="contact">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">Let's Connect</h2>
          <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
            Interested in working together or just want to say hello? Reach out — I'd love to hear from you.
          </p>

          <ContactSection linkedinUrl={settings?.linkedinUrl || "https://www.linkedin.com/in/farzeena-ayub/"} />
        </div>
      </section>
    </div>
  );
}

function ContactSection({ linkedinUrl }: { linkedinUrl?: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const { mutate: submit, isPending } = useSubmitContact({
    mutation: {
      onSuccess: () => {
        setSent(true);
        setFormData({ name: '', email: '', message: '' });
        toast({ title: "Note sent!", description: "I'll get back to you soon." });
      },
      onError: () => {
        toast({ variant: "destructive", title: "Error", description: "Failed to send. Please try again." });
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#0A66C2] text-white font-bold text-base shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <Linkedin className="w-5 h-5" /> Connect on LinkedIn
          </a>
        )}
        {!open && !sent && (
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-slate-700 font-bold text-base border border-slate-200 shadow-sm hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-all"
          >
            <Send className="w-4 h-4" /> Get in Touch
          </button>
        )}
      </div>

      {open && !sent && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 border shadow-lg shadow-black/5 text-left"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-navy">Send a Note</h3>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit({ data: { ...formData, projectType: [] } });
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Name <span className="text-red-400">*</span></label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Email <span className="text-red-400">*</span></label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="you@company.com" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Message <span className="text-slate-400 font-normal text-xs">(optional)</span></label>
              <textarea rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" placeholder="Tell me what's on your mind…" />
            </div>

            <button disabled={isPending} type="submit" className="w-full py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {isPending ? "Sending…" : <><Send className="w-4 h-4" /> Send Note</>}
            </button>
          </form>
        </motion.div>
      )}

      {sent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <p className="font-bold text-green-800 text-lg">Message received!</p>
          <p className="text-green-700 text-sm mt-1">I'll get back to you as soon as possible.</p>
        </motion.div>
      )}
    </div>
  );
}
