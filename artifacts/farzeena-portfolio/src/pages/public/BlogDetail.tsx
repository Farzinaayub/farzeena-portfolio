import { useGetBlog } from "@workspace/api-client-react";
import { Link, useParams } from "wouter";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import { ArrowLeft, Clock } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { format } from "date-fns";

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: blog, isLoading, isError } = useGetBlog(slug || '');

  if (isLoading) return <div className="min-h-screen pt-32 pb-24 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  if (isError || !blog) return <div className="min-h-screen pt-32 text-center"><h1 className="text-2xl font-bold">Article Not Found</h1><Link href="/blogs" className="text-primary mt-4 inline-block hover:underline">Back to all</Link></div>;

  return (
    <div className="min-h-screen pb-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24">
        <Link href="/blogs" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> All Articles
        </Link>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {blog.tags?.map(tag => (
            <span key={tag} className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">{tag}</span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy mb-8 leading-tight">
          {blog.title}
        </h1>
        
        <div className="flex items-center text-slate-500 text-sm font-medium mb-12 border-b border-slate-100 pb-8">
          <span>{blog.createdAt ? format(new Date(blog.createdAt), "MMMM d, yyyy") : 'Recently published'}</span>
          <span className="mx-3 text-slate-300">•</span>
          <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {blog.readingTime || 5} min read</span>
        </div>
      </div>

      {blog.coverImageUrl && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <img 
            src={getGoogleDriveImageUrl(blog.coverImageUrl)} 
            alt={blog.title} 
            className="w-full aspect-[2/1] object-cover rounded-3xl bg-slate-100 border shadow-sm" 
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="prose prose-slate prose-lg md:prose-xl max-w-none">
           {blog.content ? (
             <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{blog.content}</ReactMarkdown>
           ) : (
             <p className="italic text-slate-400 text-center">Full content coming soon.</p>
           )}
        </article>
      </div>
    </div>
  );
}
