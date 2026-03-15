import { useListCaseStudies, useDeleteCaseStudy, useListBlogs, useDeleteBlog } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, CheckCircle2, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function CaseStudiesManager() {
  const { data: items, isLoading } = useListCaseStudies();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { mutate: del } = useDeleteCaseStudy({
    mutation: {
      onSuccess: () => {
        toast({ title: "Deleted successfully" });
        queryClient.invalidateQueries({ queryKey: ["/api/case-studies"] });
      }
    }
  });

  return <ManagerTable title="Case Studies" items={items} isLoading={isLoading} basePath="/admin/case-studies" onDelete={(id) => confirm("Are you sure?") && del({ id })} />
}

export function BlogsManager() {
  const { data: items, isLoading } = useListBlogs();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { mutate: del } = useDeleteBlog({
    mutation: {
      onSuccess: () => {
        toast({ title: "Deleted successfully" });
        queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      }
    }
  });

  return <ManagerTable title="Blogs" items={items} isLoading={isLoading} basePath="/admin/blogs" onDelete={(id) => confirm("Are you sure?") && del({ id })} />
}

function ManagerTable({ title, items, isLoading, basePath, onDelete }: any) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm">
      <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-navy">{title}</h2>
        <Link href={`${basePath}/new`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> New Item
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Featured</th>
              <th className="px-6 py-4 font-semibold">Created</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
            ) : items?.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No items found.</td></tr>
            ) : (
              items?.map((item: any) => (
                <tr key={item._id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-navy max-w-[200px] truncate" title={item.title}>{item.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.featured ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-slate-300" />}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {item.createdAt ? format(new Date(item.createdAt), 'MMM d, yyyy') : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`${basePath}/${item._id}/edit`} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => onDelete(item._id)} className="p-2 text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
