import React, { useState, useEffect } from "react";
import { 
  useGetHeroSection, useUpdateHeroSection,
  useGetAboutSection, useUpdateAboutSection,
  useGetSiteSettings, useUpdateSiteSettings,
  useListContactSubmissions, useUpdateContactSubmission, useDeleteContactSubmission, useBulkDeleteContactSubmissions
} from "@workspace/api-client-react";
import type { HeroSectionInput, AboutSectionInput, SiteSettingsInput } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, Mail, MailOpen, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { getGoogleDriveImageUrl } from "@/lib/utils";

export function HeroEditor() {
  const { toast } = useToast();
  const { data: existing, isLoading } = useGetHeroSection();
  const { mutate: update, isPending } = useUpdateHeroSection({
    mutation: {
      onSuccess: () => toast({ title: "Hero Section Updated" }),
      onError: (err) => toast({ variant: "destructive", title: "Error", description: err.message }),
    }
  });

  const [formData, setFormData] = useState<HeroSectionInput>({
    heading: "",
    subtitle: "",
    cta1Text: "",
    cta1Link: "",
    cta2Text: "",
    cta2Link: "",
    pipelineSteps: [],
    toolIcons: [],
  });

  useEffect(() => {
    if (existing) {
      setFormData({
        heading: existing.heading || "",
        subtitle: existing.subtitle || "",
        cta1Text: existing.cta1Text || "",
        cta1Link: existing.cta1Link || "",
        cta2Text: existing.cta2Text || "",
        cta2Link: existing.cta2Link || "",
        pipelineSteps: existing.pipelineSteps || [],
        toolIcons: existing.toolIcons || [],
      });
    }
  }, [existing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update({ data: formData });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-navy mb-6">Edit Hero Section</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Heading</label>
              <input required type="text" value={formData.heading} onChange={e => setFormData({...formData, heading: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Subtitle</label>
              <textarea rows={3} value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 border p-4 rounded-xl bg-slate-50">
                <h4 className="font-semibold text-slate-800">Primary CTA</h4>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Text</label>
                  <input type="text" value={formData.cta1Text} onChange={e => setFormData({...formData, cta1Text: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Link</label>
                  <input type="text" value={formData.cta1Link} onChange={e => setFormData({...formData, cta1Link: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div className="space-y-4 border p-4 rounded-xl bg-slate-50">
                <h4 className="font-semibold text-slate-800">Secondary CTA</h4>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Text</label>
                  <input type="text" value={formData.cta2Text} onChange={e => setFormData({...formData, cta2Text: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Link</label>
                  <input type="text" value={formData.cta2Link} onChange={e => setFormData({...formData, cta2Link: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-navy">Pipeline Steps</h3>
            <button type="button" onClick={() => setFormData(p => ({ ...p, pipelineSteps: [...(p.pipelineSteps||[]), { label: '', iconName: '', order: (p.pipelineSteps?.length||0) }] }))} className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg font-semibold flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Step
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.pipelineSteps?.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <input type="text" placeholder="Label (e.g. Data Sources)" value={step.label} onChange={e => {
                  const newSteps = [...(formData.pipelineSteps||[])];
                  newSteps[idx].label = e.target.value;
                  setFormData({...formData, pipelineSteps: newSteps});
                }} className="flex-1 px-4 py-2 border rounded-lg" />
                <input type="text" placeholder="Icon Name" value={step.iconName} onChange={e => {
                  const newSteps = [...(formData.pipelineSteps||[])];
                  newSteps[idx].iconName = e.target.value;
                  setFormData({...formData, pipelineSteps: newSteps});
                }} className="flex-1 px-4 py-2 border rounded-lg" />
                <input type="number" placeholder="Order" value={step.order} onChange={e => {
                  const newSteps = [...(formData.pipelineSteps||[])];
                  newSteps[idx].order = Number(e.target.value);
                  setFormData({...formData, pipelineSteps: newSteps});
                }} className="w-24 px-4 py-2 border rounded-lg" />
                <button type="button" onClick={() => {
                  const newSteps = formData.pipelineSteps?.filter((_, i) => i !== idx);
                  setFormData({...formData, pipelineSteps: newSteps});
                }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {(!formData.pipelineSteps || formData.pipelineSteps.length === 0) && <p className="text-slate-500 text-sm italic">No steps added.</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-navy">Tool Icons</h3>
            <button type="button" onClick={() => setFormData(p => ({ ...p, toolIcons: [...(p.toolIcons||[]), { name: '', iconUrl: '', order: (p.toolIcons?.length||0) }] }))} className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg font-semibold flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Tool
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.toolIcons?.map((tool, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <input type="text" placeholder="Name" value={tool.name} onChange={e => {
                  const newTools = [...(formData.toolIcons||[])];
                  newTools[idx].name = e.target.value;
                  setFormData({...formData, toolIcons: newTools});
                }} className="flex-1 px-4 py-2 border rounded-lg" />
                <input type="text" placeholder="Icon URL" value={tool.iconUrl} onChange={e => {
                  const newTools = [...(formData.toolIcons||[])];
                  newTools[idx].iconUrl = e.target.value;
                  setFormData({...formData, toolIcons: newTools});
                }} className="flex-1 px-4 py-2 border rounded-lg" />
                <input type="number" placeholder="Order" value={tool.order} onChange={e => {
                  const newTools = [...(formData.toolIcons||[])];
                  newTools[idx].order = Number(e.target.value);
                  setFormData({...formData, toolIcons: newTools});
                }} className="w-24 px-4 py-2 border rounded-lg" />
                <button type="button" onClick={() => {
                  const newTools = formData.toolIcons?.filter((_, i) => i !== idx);
                  setFormData({...formData, toolIcons: newTools});
                }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {(!formData.toolIcons || formData.toolIcons.length === 0) && <p className="text-slate-500 text-sm italic">No tool icons added.</p>}
          </div>
        </div>

        <div className="flex justify-end sticky bottom-6 z-10 bg-slate-50/80 p-4 rounded-xl backdrop-blur-md border border-slate-200 shadow-lg">
          <button disabled={isPending} type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-bold shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export function AboutEditor() {
  const { toast } = useToast();
  const { data: existing, isLoading } = useGetAboutSection();
  const { mutate: update, isPending } = useUpdateAboutSection({
    mutation: {
      onSuccess: () => toast({ title: "About Section Updated" }),
      onError: (err) => toast({ variant: "destructive", title: "Error", description: err.message }),
    }
  });

  const [formData, setFormData] = useState<AboutSectionInput>({
    name: "",
    bio: "",
    profileImageUrl: "",
    focusAreas: [],
    industryTags: [],
  });

  useEffect(() => {
    if (existing) {
      setFormData({
        name: existing.name || "",
        bio: existing.bio || "",
        profileImageUrl: existing.profileImageUrl || "",
        focusAreas: existing.focusAreas || [],
        industryTags: existing.industryTags || [],
      });
    }
  }, [existing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update({ data: formData });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-navy mb-6">Edit About Section</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Bio</label>
              <textarea rows={5} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Profile Photo</label>
              <p className="text-xs text-muted-foreground mb-1.5">Paste a Google Drive image URL (right-click image → Copy link) or any direct image URL. This appears in the About section on the homepage.</p>
              <input type="text" value={formData.profileImageUrl} onChange={e => setFormData({...formData, profileImageUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" placeholder="https://drive.google.com/file/d/..." />
              {formData.profileImageUrl ? (
                <div className="mt-3 w-36 h-36 bg-slate-100 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-sm">
                  <img src={getGoogleDriveImageUrl(formData.profileImageUrl)} alt="Profile preview" className="w-full h-full object-cover object-top" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
              ) : (
                <p className="mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">No photo set — a default illustration is shown on the site.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-navy">Focus Areas</h3>
            <button type="button" onClick={() => setFormData(p => ({ ...p, focusAreas: [...(p.focusAreas||[]), { text: '', icon: '', order: (p.focusAreas?.length||0) }] }))} className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg font-semibold flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Focus Area
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.focusAreas?.map((area, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <input type="text" placeholder="Text" value={area.text} onChange={e => {
                  const newAreas = [...(formData.focusAreas||[])];
                  newAreas[idx].text = e.target.value;
                  setFormData({...formData, focusAreas: newAreas});
                }} className="flex-1 px-4 py-2 border rounded-lg" />
                <input type="text" placeholder="Icon Name" value={area.icon} onChange={e => {
                  const newAreas = [...(formData.focusAreas||[])];
                  newAreas[idx].icon = e.target.value;
                  setFormData({...formData, focusAreas: newAreas});
                }} className="w-48 px-4 py-2 border rounded-lg" />
                <input type="number" placeholder="Order" value={area.order} onChange={e => {
                  const newAreas = [...(formData.focusAreas||[])];
                  newAreas[idx].order = Number(e.target.value);
                  setFormData({...formData, focusAreas: newAreas});
                }} className="w-24 px-4 py-2 border rounded-lg" />
                <button type="button" onClick={() => {
                  const newAreas = formData.focusAreas?.filter((_, i) => i !== idx);
                  setFormData({...formData, focusAreas: newAreas});
                }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {(!formData.focusAreas || formData.focusAreas.length === 0) && <p className="text-slate-500 text-sm italic">No focus areas added.</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-navy">Industry Tags</h3>
            <button type="button" onClick={() => setFormData(p => ({ ...p, industryTags: [...(p.industryTags||[]), { label: '', order: (p.industryTags?.length||0) }] }))} className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg font-semibold flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Tag
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.industryTags?.map((tag, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <input type="text" placeholder="Label" value={tag.label} onChange={e => {
                  const newTags = [...(formData.industryTags||[])];
                  newTags[idx].label = e.target.value;
                  setFormData({...formData, industryTags: newTags});
                }} className="flex-1 px-4 py-2 border rounded-lg" />
                <input type="number" placeholder="Order" value={tag.order} onChange={e => {
                  const newTags = [...(formData.industryTags||[])];
                  newTags[idx].order = Number(e.target.value);
                  setFormData({...formData, industryTags: newTags});
                }} className="w-24 px-4 py-2 border rounded-lg" />
                <button type="button" onClick={() => {
                  const newTags = formData.industryTags?.filter((_, i) => i !== idx);
                  setFormData({...formData, industryTags: newTags});
                }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {(!formData.industryTags || formData.industryTags.length === 0) && <p className="text-slate-500 text-sm italic">No industry tags added.</p>}
          </div>
        </div>

        <div className="flex justify-end sticky bottom-6 z-10 bg-slate-50/80 p-4 rounded-xl backdrop-blur-md border border-slate-200 shadow-lg">
          <button disabled={isPending} type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-bold shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export function SiteSettingsEditor() {
  const { toast } = useToast();
  const { data: existing, isLoading } = useGetSiteSettings();
  const { mutate: update, isPending } = useUpdateSiteSettings({
    mutation: {
      onSuccess: () => toast({ title: "Site Settings Updated" }),
      onError: (err) => toast({ variant: "destructive", title: "Error", description: err.message }),
    }
  });

  const [formData, setFormData] = useState<SiteSettingsInput>({
    siteTitle: "",
    ctaBannerText: "",
    footerText: "",
    linkedinUrl: "",
    githubUrl: "",
    twitterUrl: "",
    contactEmail: "",
    metaTitleTemplate: "",
    defaultMetaDescription: "",
  });

  useEffect(() => {
    if (existing) {
      setFormData({
        siteTitle: existing.siteTitle || "",
        ctaBannerText: existing.ctaBannerText || "",
        footerText: existing.footerText || "",
        linkedinUrl: existing.linkedinUrl || "",
        githubUrl: existing.githubUrl || "",
        twitterUrl: existing.twitterUrl || "",
        contactEmail: existing.contactEmail || "",
        metaTitleTemplate: existing.metaTitleTemplate || "",
        defaultMetaDescription: existing.defaultMetaDescription || "",
      });
    }
  }, [existing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update({ data: formData });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-navy mb-6">Site Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-navy border-b pb-2">General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Site Title</label>
              <input required type="text" value={formData.siteTitle} onChange={e => setFormData({...formData, siteTitle: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Contact Email</label>
              <input type="email" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">CTA Banner Text</label>
            <input type="text" value={formData.ctaBannerText} onChange={e => setFormData({...formData, ctaBannerText: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Footer Text</label>
            <input type="text" value={formData.footerText} onChange={e => setFormData({...formData, footerText: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-navy border-b pb-2">Social Links</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">LinkedIn URL</label>
              <input type="text" value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">GitHub URL</label>
              <input type="text" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Twitter URL</label>
              <input type="text" value={formData.twitterUrl} onChange={e => setFormData({...formData, twitterUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-navy border-b pb-2">SEO Defaults</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Meta Title Template (use %s for title)</label>
              <input type="text" value={formData.metaTitleTemplate} onChange={e => setFormData({...formData, metaTitleTemplate: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" placeholder="%s | Farzeena" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Default Meta Description</label>
              <textarea rows={3} value={formData.defaultMetaDescription} onChange={e => setFormData({...formData, defaultMetaDescription: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end sticky bottom-6 z-10 bg-slate-50/80 p-4 rounded-xl backdrop-blur-md border border-slate-200 shadow-lg">
          <button disabled={isPending} type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-bold shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export function ContactSubmissions() {
  const { data: submissions, isLoading, refetch } = useListContactSubmissions();
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { mutate: updateSubmission } = useUpdateContactSubmission({
    mutation: {
      onSuccess: () => refetch()
    }
  });

  const { mutate: deleteSubmission } = useDeleteContactSubmission({
    mutation: {
      onSuccess: () => {
        toast({ title: "Submission deleted" });
        refetch();
      }
    }
  });

  const { mutate: bulkDelete, isPending: isBulkDeleting } = useBulkDeleteContactSubmissions({
    mutation: {
      onSuccess: () => {
        toast({ title: "Submissions deleted" });
        setSelectedIds([]);
        refetch();
      }
    }
  });

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(submissions?.map(s => s._id) || []);
    } else {
      setSelectedIds([]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Delete ${selectedIds.length} submissions?`)) {
      bulkDelete({ data: { ids: selectedIds } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-navy">Contact Submissions</h1>
        {selectedIds.length > 0 && (
          <button onClick={handleBulkDelete} disabled={isBulkDeleting} className="px-4 py-2 bg-destructive text-white rounded-lg font-semibold shadow-sm hover:bg-destructive/90 transition-colors flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b">
              <tr>
                <th className="px-4 py-4 w-12 text-center">
                  <input type="checkbox" checked={submissions?.length ? selectedIds.length === submissions.length : false} onChange={toggleSelectAll} className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 font-semibold">Date</th>
                <th className="px-4 py-4 font-semibold">Sender</th>
                <th className="px-4 py-4 font-semibold">Project Types</th>
                <th className="px-4 py-4 font-semibold w-1/3">Message</th>
                <th className="px-4 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-500">Loading...</td></tr>
              ) : submissions?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                    No contact submissions yet.
                  </td>
                </tr>
              ) : (
                submissions?.map(sub => (
                  <React.Fragment key={sub._id}>
                    <tr className={`hover:bg-slate-50 transition-colors cursor-pointer ${!sub.read ? 'bg-blue-50/30' : ''}`} onClick={() => setExpandedId(expandedId === sub._id ? null : sub._id)}>
                      <td className="px-4 py-4 text-center" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={selectedIds.includes(sub._id)} onChange={(e) => {
                          if (e.target.checked) setSelectedIds([...selectedIds, sub._id]);
                          else setSelectedIds(selectedIds.filter(id => id !== sub._id));
                        }} className="rounded border-gray-300" />
                      </td>
                      <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                        <button onClick={() => updateSubmission({ id: sub._id, data: { read: !sub.read } })} className={`p-1.5 rounded-md ${sub.read ? 'text-slate-400 hover:bg-slate-100' : 'text-primary bg-primary/10 hover:bg-primary/20'}`} title={sub.read ? "Mark as unread" : "Mark as read"}>
                          {sub.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-slate-500">
                        {sub.createdAt ? format(new Date(sub.createdAt), 'MMM d, yyyy') : '-'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-navy">{sub.name}</div>
                        <div className="text-slate-500 text-xs">{sub.email}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {sub.projectType?.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-600 line-clamp-1">{sub.message}</div>
                      </td>
                      <td className="px-4 py-4 text-right" onClick={e => e.stopPropagation()}>
                        <button onClick={() => {
                          if (confirm("Delete this submission?")) {
                            deleteSubmission({ id: sub._id });
                          }
                        }} className="p-2 text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    {expandedId === sub._id && (
                      <tr className="bg-slate-50 border-b border-t-0">
                        <td colSpan={7} className="px-8 py-6">
                          <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <div className="flex justify-between items-start mb-4 pb-4 border-b">
                              <div>
                                <h4 className="font-bold text-lg text-navy">{sub.name}</h4>
                                <a href={`mailto:${sub.email}`} className="text-primary hover:underline">{sub.email}</a>
                              </div>
                              <div className="text-sm text-slate-500">
                                {sub.createdAt ? format(new Date(sub.createdAt), 'PPpp') : '-'}
                              </div>
                            </div>
                            <div className="prose max-w-none text-slate-700 whitespace-pre-wrap">
                              {sub.message}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}