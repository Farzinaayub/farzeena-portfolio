import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  useGetCaseStudy,
  useCreateCaseStudy,
  useUpdateCaseStudy,
  useGetBlog,
  useCreateBlog,
  useUpdateBlog,
} from "@workspace/api-client-react";
import type { CaseStudyInput, BlogInput } from "@workspace/api-client-react";
import { CaseStudyInputStatus, BlogInputStatus } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { generateSlug, estimateReadingTime, getGoogleDriveImageUrl } from "@/lib/utils";
import { ChevronLeft, Save, X, Plus } from "lucide-react";
import { Link } from "wouter";

// Reusable tag input component
function TagInput({ tags, setTags, placeholder }: { tags: string[]; setTags: (tags: string[]) => void; placeholder: string }) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()]);
      }
      setInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium border border-slate-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
    </div>
  );
}

export function CaseStudyEditor({ params }: { params?: { id?: string } }) {
  const id = params?.id;
  const isEditing = !!id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: existingCaseStudy, isLoading: isFetching } = useGetCaseStudy(id || "", {
    query: { enabled: isEditing, queryKey: ["/api/case-studies", id] },
  });

  const { mutate: createCaseStudy, isPending: isCreating } = useCreateCaseStudy({
    mutation: {
      onSuccess: () => {
        toast({ title: "Case Study Created" });
        setLocation("/admin/case-studies");
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: err.message }),
    },
  });

  const { mutate: updateCaseStudy, isPending: isUpdating } = useUpdateCaseStudy({
    mutation: {
      onSuccess: () => {
        toast({ title: "Case Study Updated" });
        setLocation("/admin/case-studies");
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: err.message }),
    },
  });

  const [formData, setFormData] = useState<CaseStudyInput>({
    title: "",
    slug: "",
    shortDescription: "",
    content: "",
    coverImageUrl: "",
    tools: [],
    status: CaseStudyInputStatus.draft,
    featured: false,
    sortOrder: 0,
    documentUrl: "",
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    if (existingCaseStudy) {
      setFormData({
        title: existingCaseStudy.title || "",
        slug: existingCaseStudy.slug || "",
        shortDescription: existingCaseStudy.shortDescription || "",
        content: existingCaseStudy.content || "",
        coverImageUrl: existingCaseStudy.coverImageUrl || "",
        tools: existingCaseStudy.tools || [],
        status: existingCaseStudy.status as CaseStudyInputStatus || CaseStudyInputStatus.draft,
        featured: existingCaseStudy.featured || false,
        sortOrder: existingCaseStudy.sortOrder || 0,
        documentUrl: existingCaseStudy.documentUrl || "",
        metaTitle: existingCaseStudy.metaTitle || "",
        metaDescription: existingCaseStudy.metaDescription || "",
      });
    }
  }, [existingCaseStudy]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: isEditing ? prev.slug : generateSlug(newTitle),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && id) {
      updateCaseStudy({ id, data: formData });
    } else {
      createCaseStudy({ data: formData });
    }
  };

  if (isEditing && isFetching) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/case-studies" className="p-2 bg-white rounded-lg border shadow-sm hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-navy">{isEditing ? "Edit Case Study" : "New Case Study"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Title</label>
              <input required type="text" value={formData.title} onChange={handleTitleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Slug</label>
              <input required type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-semibold text-slate-700">Short Description</label>
              <span className={`text-xs ${formData.shortDescription?.length && formData.shortDescription.length > 160 ? "text-red-500" : "text-slate-400"}`}>
                {formData.shortDescription?.length || 0} / 160
              </span>
            </div>
            <textarea rows={3} value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Content (Markdown)</label>
            <textarea rows={15} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Cover Image URL</label>
            <input type="text" value={formData.coverImageUrl} onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="https://" />
            {formData.coverImageUrl && (
              <div className="mt-2 aspect-video w-full rounded-xl overflow-hidden border bg-slate-100">
                <img src={getGoogleDriveImageUrl(formData.coverImageUrl)} alt="Cover Preview" className="w-full h-full object-cover object-top" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Tools (Type and hit Enter)</label>
            <TagInput tags={formData.tools || []} setTags={(tools) => setFormData({ ...formData, tools })} placeholder="Add a tool..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as CaseStudyInputStatus })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                <option value={CaseStudyInputStatus.draft}>Draft</option>
                <option value={CaseStudyInputStatus.published}>Published</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Sort Order</label>
              <input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="featured" className="text-sm font-semibold text-slate-700">Featured Case Study</label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Document / External URL</label>
            <input type="text" value={formData.documentUrl} onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Optional external link" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-navy">SEO Meta</h3>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Meta Title</label>
            <input type="text" value={formData.metaTitle} onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Meta Description</label>
            <textarea rows={2} value={formData.metaDescription} onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
        </div>

        <div className="flex justify-end gap-4 sticky bottom-6 z-10 bg-slate-50/80 p-4 rounded-xl backdrop-blur-md border border-slate-200 shadow-lg">
          <Link href="/admin/case-studies" className="px-6 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
            Cancel
          </Link>
          <button disabled={isCreating || isUpdating} type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-bold shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" /> {isEditing ? "Save Changes" : "Create Case Study"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function BlogEditor({ params }: { params?: { id?: string } }) {
  const id = params?.id;
  const isEditing = !!id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: existingBlog, isLoading: isFetching } = useGetBlog(id || "", {
    query: { enabled: isEditing, queryKey: ["/api/blogs", id] },
  });

  const { mutate: createBlog, isPending: isCreating } = useCreateBlog({
    mutation: {
      onSuccess: () => {
        toast({ title: "Blog Post Created" });
        setLocation("/admin/blogs");
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: err.message }),
    },
  });

  const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog({
    mutation: {
      onSuccess: () => {
        toast({ title: "Blog Post Updated" });
        setLocation("/admin/blogs");
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: err.message }),
    },
  });

  const [formData, setFormData] = useState<BlogInput>({
    title: "",
    slug: "",
    shortDescription: "",
    content: "",
    coverImageUrl: "",
    tags: [],
    status: BlogInputStatus.draft,
    featured: false,
    sortOrder: 0,
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    if (existingBlog) {
      setFormData({
        title: existingBlog.title || "",
        slug: existingBlog.slug || "",
        shortDescription: existingBlog.shortDescription || "",
        content: existingBlog.content || "",
        coverImageUrl: existingBlog.coverImageUrl || "",
        tags: existingBlog.tags || [],
        status: existingBlog.status as BlogInputStatus || BlogInputStatus.draft,
        featured: existingBlog.featured || false,
        sortOrder: existingBlog.sortOrder || 0,
        metaTitle: existingBlog.metaTitle || "",
        metaDescription: existingBlog.metaDescription || "",
      });
    }
  }, [existingBlog]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: isEditing ? prev.slug : generateSlug(newTitle),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && id) {
      updateBlog({ id, data: formData });
    } else {
      createBlog({ data: formData });
    }
  };

  const currentReadingTime = estimateReadingTime(formData.content);

  if (isEditing && isFetching) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/blogs" className="p-2 bg-white rounded-lg border shadow-sm hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-navy">{isEditing ? "Edit Blog Post" : "New Blog Post"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Title</label>
              <input required type="text" value={formData.title} onChange={handleTitleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Slug</label>
              <input required type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-semibold text-slate-700">Short Description</label>
              <span className={`text-xs ${formData.shortDescription?.length && formData.shortDescription.length > 160 ? "text-red-500" : "text-slate-400"}`}>
                {formData.shortDescription?.length || 0} / 160
              </span>
            </div>
            <textarea rows={3} value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">Content (Markdown)</label>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md font-medium">Est. {currentReadingTime} min read</span>
            </div>
            <textarea rows={15} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Cover Image URL</label>
            <input type="text" value={formData.coverImageUrl} onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="https://" />
            {formData.coverImageUrl && (
              <div className="mt-2 aspect-video w-full rounded-xl overflow-hidden border bg-slate-100">
                <img src={getGoogleDriveImageUrl(formData.coverImageUrl)} alt="Cover Preview" className="w-full h-full object-cover object-top" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Tags (Type and hit Enter)</label>
            <TagInput tags={formData.tags || []} setTags={(tags) => setFormData({ ...formData, tags })} placeholder="Add a tag..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as BlogInputStatus })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                <option value={BlogInputStatus.draft}>Draft</option>
                <option value={BlogInputStatus.published}>Published</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Sort Order</label>
              <input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="featured" className="text-sm font-semibold text-slate-700">Featured Blog Post</label>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-navy">SEO Meta</h3>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Meta Title</label>
            <input type="text" value={formData.metaTitle} onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Meta Description</label>
            <textarea rows={2} value={formData.metaDescription} onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
        </div>

        <div className="flex justify-end gap-4 sticky bottom-6 z-10 bg-slate-50/80 p-4 rounded-xl backdrop-blur-md border border-slate-200 shadow-lg">
          <Link href="/admin/blogs" className="px-6 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
            Cancel
          </Link>
          <button disabled={isCreating || isUpdating} type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-bold shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" /> {isEditing ? "Save Changes" : "Create Blog Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
