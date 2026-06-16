'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Loader2, Image as LucideImage, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { useCreateBlogMutation } from '../../redux/features/blogs/blogsApi';
import { useUploadImageMutation } from '../../redux/features/studios/studiosApi';

const RichTextEditor = dynamic(
  () => import('../../../components/RichTextEditor'),
  {
    ssr: false,
    loading: () => <div className="border border-zinc-200 rounded-xl h-[420px] bg-zinc-50 animate-pulse" />,
  }
);

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  author: '',
  category: '',
  tags: [],
  isPublished: true,
};

export default function NewBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(emptyForm);
  const [tagInput, setTagInput] = useState('');
  const [isImageUploading, setIsImageUploading] = useState(false);

  const [createBlog, { isLoading: isSaving }] = useCreateBlogMutation();
  const [uploadImage] = useUploadImageMutation();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsImageUploading(true);
    try {
      const res = await uploadImage({ file, folder: 'blogs' }).unwrap();
      const url = res?.data?.url;
      if (url) {
        setFormData((prev) => ({ ...prev, coverImage: url }));
        toast.success('Cover image uploaded!');
      }
    } catch {
      toast.error('Image upload failed.');
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleAddTag = () => {
    const val = tagInput.trim().replace(/,+$/, '');
    if (!val) return;
    const incoming = val.split(',').map((t) => t.trim()).filter(Boolean);
    const unique = [...new Set([...formData.tags, ...incoming])];
    setFormData((prev) => ({ ...prev, tags: unique }));
    setTagInput('');
  };

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error('Title is required.');
    if (!formData.content || formData.content === '<p></p>') return toast.error('Content is required.');
    try {
      await createBlog(formData).unwrap();
      toast.success('Blog post saved!');
      router.push('/blogs');
    } catch (err) {
      toast.error(err?.data?.message ?? 'Failed to create post.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#fcfbf9]/90 backdrop-blur-md pb-4 pt-2 -mx-8 px-8 border-b border-zinc-100/50">
        <div className="flex items-center gap-4">
          <Link
            href="/blogs"
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="text-[13px] font-bold uppercase tracking-widest text-maroon mb-0.5">Blog</p>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">New Post</h1>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving || isImageUploading}
          className="bg-maroon text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-maroon/90 transition-all shadow-lg shadow-maroon/20 active:scale-95 disabled:opacity-60"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          <span>Save Post</span>
        </button>
      </header>

      <form onSubmit={handleSubmit} className="max-w-5xl space-y-8">
        {/* Cover image */}
        <section className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-zinc-100 bg-zinc-50/50">
            <h2 className="text-base font-bold text-zinc-900">Cover Image</h2>
            <p className="text-zinc-400 text-sm mt-0.5">Recommended: 1200 × 630 px</p>
          </div>
          <div className="p-8">
            <label className="relative block w-full h-52 bg-zinc-50 rounded-2xl overflow-hidden border border-dashed border-zinc-300 hover:border-maroon transition-colors group cursor-pointer">
              {isImageUploading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={28} className="animate-spin text-maroon" />
                </div>
              ) : formData.coverImage ? (
                <>
                  <Image src={formData.coverImage} alt="Cover" fill sizes="100vw" className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-semibold">Click to change</p>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-400 group-hover:text-zinc-600 transition-colors">
                  <LucideImage size={36} />
                  <p className="text-sm font-semibold">Click to upload cover image</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
            </label>
          </div>
        </section>

        {/* Post details */}
        <section className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-zinc-100 bg-zinc-50/50">
            <h2 className="text-base font-bold text-zinc-900">Post Details</h2>
          </div>
          <div className="p-8 space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-zinc-700">Title *</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900 text-xl font-bold placeholder:font-normal"
                placeholder="Enter post title…"
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-zinc-700">Excerpt</label>
              <textarea
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900 resize-none"
                placeholder="Short summary shown on listing pages…"
              />
            </div>

            {/* Category + Author */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-zinc-700">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                  placeholder="e.g. Beauty, Style, Wellness"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-zinc-700">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900"
                  placeholder="Author name"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-zinc-700">Tags</label>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="pl-3 pr-1.5 py-1 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-lg flex items-center gap-1.5 border border-zinc-200">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="p-0.5 hover:bg-zinc-200 rounded text-zinc-500 transition-colors">
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAddTag(); } }}
                  className="flex-1 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-zinc-900 text-sm"
                  placeholder="Type a tag and press Enter or comma…"
                />
                <button type="button" onClick={handleAddTag} className="px-4 py-2.5 bg-zinc-100 border border-zinc-200 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-colors">
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Published toggle */}
            <div className="pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isPublished: !prev.isPublished }))}
                className="flex items-center justify-between w-full p-4 bg-zinc-50 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors group"
              >
                <div className="text-left">
                  <p className="text-sm font-bold text-zinc-800">Published</p>
                  <p className="text-[12px] text-zinc-400 mt-0.5">
                    {formData.isPublished ? 'Visible to clients on the website.' : 'Hidden from the public website.'}
                  </p>
                </div>
                <div className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${formData.isPublished ? 'bg-emerald-500' : 'bg-zinc-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.isPublished ? 'left-6' : 'left-1'}`} />
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Content editor */}
        <section className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-zinc-100 bg-zinc-50/50">
            <h2 className="text-base font-bold text-zinc-900">Content *</h2>
          </div>
          <div className="p-8">
            <RichTextEditor
              content={formData.content}
              onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
              placeholder="Write your blog post here…"
            />
          </div>
        </section>

        {/* Bottom actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Link href="/blogs" className="px-6 py-3 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-bold hover:bg-zinc-50 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving || isImageUploading}
            className="bg-maroon text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-maroon/90 transition-all shadow-lg shadow-maroon/20 disabled:opacity-60"
          >
            {isSaving && <Loader2 size={18} className="animate-spin" />}
            Save Post
          </button>
        </div>
      </form>
    </div>
  );
}
