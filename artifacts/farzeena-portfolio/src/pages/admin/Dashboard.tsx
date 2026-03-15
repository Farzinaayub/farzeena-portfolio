import { useGetDashboardStats } from "@workspace/api-client-react";
import { FolderKanban, FileText, Mail, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  const statCards = [
    { label: "Published Case Studies", value: stats?.publishedCaseStudies || 0, icon: FolderKanban, color: "text-blue-600", bg: "bg-blue-100", link: "/admin/case-studies" },
    { label: "Published Blogs", value: stats?.publishedBlogs || 0, icon: FileText, color: "text-emerald-600", bg: "bg-emerald-100", link: "/admin/blogs" },
    { label: "Unread Submissions", value: stats?.unreadSubmissions || 0, icon: Mail, color: "text-amber-600", bg: "bg-amber-100", link: "/admin/contact-submissions" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <Link href={stat.link} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                 <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
            {isLoading ? (
               <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-lg mt-auto"></div>
            ) : (
              <div className="mt-auto">
                <div className="text-4xl font-extrabold text-navy">{stat.value}</div>
                <div className="text-sm font-semibold text-slate-500 mt-1">{stat.label}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Quick Actions</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
           <Link href="/admin/case-studies/new" className="py-4 px-4 rounded-xl border border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 text-center font-semibold text-slate-600 hover:text-primary transition-all">
              + Add Case Study
           </Link>
           <Link href="/admin/blogs/new" className="py-4 px-4 rounded-xl border border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 text-center font-semibold text-slate-600 hover:text-primary transition-all">
              + Add Blog Post
           </Link>
           <Link href="/admin/hero" className="py-4 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-center font-semibold text-slate-600 transition-all">
              Edit Hero Section
           </Link>
           <Link href="/admin/about" className="py-4 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-center font-semibold text-slate-600 transition-all">
              Edit About Section
           </Link>
        </div>
      </div>
    </div>
  );
}
