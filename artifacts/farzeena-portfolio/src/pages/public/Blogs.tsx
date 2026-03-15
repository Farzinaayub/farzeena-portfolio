import { useListBlogs } from "@workspace/api-client-react";
import { Link } from "wouter";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import { FileText, ChevronRight } from "lucide-react";

export default function Blogs() {
  const { data: blogs, isLoading } = useListBlogs({ status: "published" });

  return (
    <div className="min-h-screen pt-12 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy mb-4">Analytics Insights</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">Articles on data modeling, SQL optimization, BI tool reviews, and engineering best practices.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1,2,3,4].map(i => (
               <div key={i} className="animate-pulse bg-slate-100 rounded-2xl h-[400px]"></div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs?.map((blog) => (
               <Link key={blog._id} href={`/blogs/${blog.slug}`} className="group flex flex-col p-4 rounded-3xl hover:bg-slate-50 border border-transparent hover:border-border transition-all">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-slate-100 relative shadow-sm group-hover:shadow-md transition-shadow">
                  {blog.coverImageUrl ? (
                    <img src={getGoogleDriveImageUrl(blog.coverImageUrl)} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-700">
                    {blog.readingTime || 5} min read
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  {blog.tags?.slice(0,3).map(tag => (
                    <span key={tag} className="text-xs font-bold text-primary uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-navy mb-3 group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h3>
                <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">{blog.shortDescription}</p>
                <div className="mt-auto flex items-center text-primary font-bold">
                  Read Article <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
