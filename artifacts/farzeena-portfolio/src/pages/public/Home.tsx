import { 
  useGetHeroSection, useListCaseStudies, useListBlogs, 
  useGetAboutSection, useGetSiteSettings, useSubmitContact 
} from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, FileText, Play, Database, Server, BarChart3, CheckCircle2 } from "lucide-react";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { data: hero } = useGetHeroSection();
  const { data: caseStudies } = useListCaseStudies({ status: "published", featured: true });
  const { data: blogs } = useListBlogs({ status: "published", featured: true });
  const { data: about } = useGetAboutSection();
  const { data: settings } = useGetSiteSettings();

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-[10%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/40 blur-[140px]" />
        <div className="absolute top-[15%] -left-[15%] w-[60%] h-[60%] rounded-full bg-indigo-50/50 blur-[120px]" />
        <div className="absolute top-[50%] right-[5%] w-[40%] h-[40%] rounded-full bg-violet-50/30 blur-[100px]" />
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Data & Analytics Engineering
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy leading-[1.1] mb-6 tracking-tight">
                {hero?.heading || "Analytics Engineering for Data-Driven Decision Making"}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {hero?.subtitle || "Transforming complex raw data into clean, reliable, and actionable insights to scale your business intelligence."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href={hero?.cta1Link || "/case-studies"}
                  className="px-8 py-4 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2"
                >
                  {hero?.cta1Text || "View Case Studies"} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Pipeline Diagram Card */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-blue-900/5 border border-white/50 relative z-10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-navy">Data Pipeline Architecture</h3>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {(hero?.pipelineSteps?.length ? hero.pipelineSteps : [
                    { label: "Data Sources", iconName: "Database" },
                    { label: "Python ETL / ELT", iconName: "Server" },
                    { label: "Data Warehouse", iconName: "Cloud" },
                    { label: "BI Dashboards", iconName: "BarChart3" }
                  ]).map((step, idx, arr) => (
                    <div key={idx} className="relative">
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 group hover:bg-primary/5 hover:border-primary/20 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           {step.iconName === 'Database' ? <Database /> : 
                            step.iconName === 'Server' ? <Server /> : 
                            step.iconName === 'BarChart3' ? <BarChart3 /> : <FileText />}
                        </div>
                        <span className="font-semibold text-slate-700">{step.label}</span>
                      </div>
                      {idx < arr.length - 1 && (
                        <div className="absolute left-10 top-full h-4 w-0.5 bg-slate-200 -translate-x-1/2 flex items-center justify-center z-20">
                           <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-300 absolute top-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Tools Row */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] bg-slate-900 rounded-2xl p-4 shadow-xl flex items-center justify-around z-20">
                 {(hero?.toolIcons || []).slice(0, 5).map((tool, i) => (
                   tool.iconUrl
                     ? <img key={i} src={tool.iconUrl} alt={tool.name} className="h-6 object-contain opacity-70 hover:opacity-100 transition-opacity" title={tool.name} />
                     : <span key={i} className="text-white/60 text-xs font-mono" title={tool.name}>{tool.name}</span>
                 ))}
                 {(!hero?.toolIcons || hero.toolIcons.length === 0) && (
                    <div className="text-white/50 text-sm font-mono">Tools: SQL • Python • dbt • PowerBI</div>
                 )}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. CASE STUDIES CAROUSEL */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex items-end justify-between">
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
                  
                  <Link href={`/case-studies/${cs.slug}`} className="w-full py-2.5 rounded-lg bg-slate-50 text-slate-700 text-sm font-semibold hover:bg-primary hover:text-white transition-colors text-center">
                    Read Case Study
                  </Link>
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

      {/* 3. BLOGS GRID */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-navy mb-4">Analytics Insights</h2>
            <p className="text-muted-foreground">Articles, tutorials, and thoughts on data engineering, analytics workflows, and business intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs?.slice(0,3).map((blog) => (
              <Link key={blog._id} href={`/blogs/${blog.slug}`} className="group flex flex-col">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-slate-200 relative flex items-center justify-center">
                  <FileText className="w-12 h-12 text-slate-400" />
                  {blog.coverImageUrl && (
                    <img src={getGoogleDriveImageUrl(blog.coverImageUrl)} alt={blog.title} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-700">
                    {blog.readingTime || 5} min read
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  {blog.tags?.slice(0,2).map(tag => (
                    <span key={tag} className="text-xs font-bold text-primary uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h3>
                <p className="text-muted-foreground line-clamp-2 mb-4">{blog.shortDescription}</p>
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

      {/* 4. CTA BANNER */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 relative overflow-hidden">
         {/* Decorative circles */}
         <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full border-[20px] border-white/10"></div>
         <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full border-[10px] border-white/10"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white max-w-2xl leading-tight">
                {settings?.ctaBannerText || "Ready to build scalable data models and unlock insights?"}
              </h2>
              <Link href="/contact" className="shrink-0 px-8 py-4 rounded-xl bg-white text-primary font-bold text-lg hover:shadow-xl hover:scale-105 transition-all">
                Let's Talk Data
              </Link>
            </div>
         </div>
      </section>

      {/* 5. ABOUT ME */}
      <section className="py-24" id="about">
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
                 <div className="absolute inset-0 bg-primary/10 rounded-3xl transform translate-x-6 translate-y-6"></div>
                 <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden relative z-10 border-4 border-white shadow-xl bg-slate-100">
                   {about?.profileImageUrl ? (
                     <img src={getGoogleDriveImageUrl(about.profileImageUrl)} alt={about?.name} className="w-full h-full object-cover" />
                   ) : (
                     <img src={`${import.meta.env.BASE_URL}images/hijabi-portrait.png`} alt="Farzeena" className="w-full h-full object-cover object-top" />
                   )}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section className="py-24" id="contact">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-navy mb-4">Get in Touch</h2>
             <p className="text-muted-foreground">Looking for an analytics engineer to help with your data infrastructure? Send me a message.</p>
           </div>

           <ContactForm />
        </div>
      </section>

    </div>
  );
}

function ContactForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '', projectType: [] as string[] });
  
  const { mutate: submit, isPending } = useSubmitContact({
    mutation: {
      onSuccess: () => {
        toast({ title: "Message Sent!", description: "I'll get back to you as soon as possible." });
        setFormData({ name: '', email: '', message: '', projectType: [] });
      },
      onError: () => {
        toast({ variant: "destructive", title: "Error", description: "Failed to send message. Please try again." });
      }
    }
  });

  const handleToggleType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      projectType: prev.projectType.includes(type) 
        ? prev.projectType.filter(t => t !== type)
        : [...prev.projectType, type]
    }));
  };

  const types = ["Data Pipeline", "Dashboard/BI", "Data Modeling", "Consulting"];

  return (
    <div className="bg-white rounded-2xl p-8 border shadow-lg shadow-black/5">
      <form onSubmit={(e) => { e.preventDefault(); submit({ data: formData }); }} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Name</label>
            <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-border border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input required type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-border border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="john@company.com" />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">What do you need help with?</label>
          <div className="flex flex-wrap gap-3">
            {types.map(t => (
              <button 
                type="button" 
                key={t}
                onClick={() => handleToggleType(t)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${formData.projectType.includes(t) ? 'bg-primary/10 border-primary text-primary' : 'bg-slate-50 border-border text-slate-600 hover:border-slate-300'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Message</label>
          <textarea required rows={5} value={formData.message} onChange={e=>setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-border border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" placeholder="Tell me about your project..."></textarea>
        </div>

        <button disabled={isPending} type="submit" className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {isPending ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  )
}
