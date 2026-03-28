import { useListCaseStudies } from "@workspace/api-client-react";
import { Link } from "wouter";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

export default function CaseStudies() {
  const { data: caseStudies, isLoading } = useListCaseStudies({ status: "published" });

  return (
    <div className="min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy mb-4">Case Studies</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">Detailed walkthroughs of analytics engineering projects, data models, and business intelligence solutions I've delivered.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className="animate-pulse bg-white rounded-2xl h-[400px] border"></div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies?.map((cs) => (
               <Link key={cs._id} href={`/case-studies/${cs.slug}`} className="bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden">
                <div className="aspect-video w-full bg-gradient-to-br from-blue-100 to-indigo-50 relative overflow-hidden flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-primary/20" />
                  {cs.coverImageUrl && (
                    <img src={getGoogleDriveImageUrl(cs.coverImageUrl)} alt={cs.title} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-xl text-navy mb-3 group-hover:text-primary transition-colors">{cs.title}</h3>
                  <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">{cs.shortDescription}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {cs.tools?.map(t => (
                      <span key={t} className="px-2.5 py-1 rounded-md bg-blue-50 text-primary text-xs font-semibold border border-blue-100">{t}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
