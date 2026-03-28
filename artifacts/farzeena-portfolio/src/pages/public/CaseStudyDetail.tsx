import { useGetCaseStudy } from "@workspace/api-client-react";
import { Link, useParams } from "wouter";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import { ArrowLeft, ExternalLink } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

export default function CaseStudyDetail() {
  const { slug } = useParams();
  // using slug directly if the backend supports it, which the openapi spec implied (Get a case study by ID or slug)
  const { data: cs, isLoading, isError } = useGetCaseStudy(slug || '');

  if (isLoading) return <div className="min-h-screen pt-32 pb-24 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  
  if (isError || !cs) return <div className="min-h-screen pt-32 text-center"><h1 className="text-2xl font-bold">Case Study Not Found</h1><Link href="/case-studies" className="text-primary mt-4 inline-block hover:underline">Back to all</Link></div>;

  return (
    <div className="min-h-screen pb-24 bg-white">
      {/* Header */}
      <div className="bg-slate-50 pt-20 pb-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/case-studies" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Case Studies
          </Link>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy mb-6 leading-tight">
            {cs.title}
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            {cs.shortDescription}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {cs.tools?.map(t => (
                <span key={t} className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-bold shadow-sm">{t}</span>
              ))}
            </div>
            
            {cs.documentUrl && (
               <a href={cs.documentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors ml-auto">
                 View Final Dashboard <ExternalLink className="w-4 h-4" />
               </a>
            )}
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {cs.coverImageUrl && (
        <div className="w-full mb-16">
          <img 
            src={getGoogleDriveImageUrl(cs.coverImageUrl)} 
            alt={cs.title} 
            className="w-full h-[55vh] object-cover object-top bg-slate-100" 
            onError={(e) => { e.currentTarget.parentElement!.style.display = 'none'; }}
          />
        </div>
      )}

      {/* Content */}
      <div className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 ${!cs.coverImageUrl ? 'mt-16' : ''}`}>
        <article className="prose prose-slate prose-lg md:prose-xl max-w-none">
           {cs.content ? (
             <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{cs.content}</ReactMarkdown>
           ) : (
             <p className="italic text-slate-400 text-center">Full content coming soon.</p>
           )}
        </article>
      </div>
    </div>
  );
}
