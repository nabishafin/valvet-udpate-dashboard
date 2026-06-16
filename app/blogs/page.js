'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  PlusCircle,
  Edit3,
  Trash2,
  Loader2,
  FileText,
  Eye,
  EyeOff,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import {
  useGetAllBlogsQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from '../redux/features/blogs/blogsApi';

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: response, isLoading: isFetching } = useGetAllBlogsQuery({
    search: searchQuery,
    page,
    limit: 10,
  });

  const blogs =
    response?.data?.posts ??
    response?.data?.blogs ??
    (Array.isArray(response?.data) ? response.data : []);
  const pagination = response?.data?.pagination ?? null;

  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const handleTogglePublish = async (blog) => {
    try {
      await updateBlog({ id: blog._id, isPublished: !blog.isPublished }).unwrap();
      toast.success(blog.isPublished ? 'Moved to drafts.' : 'Blog published.');
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteBlog(deleteTarget.id).unwrap();
      toast.success('Blog post deleted.');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete post.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (str) => {
    if (!str) return '—';
    return new Date(str).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#fcfbf9]/90 backdrop-blur-md pb-4 pt-2 -mx-8 px-8 border-b border-zinc-100/50">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-widest text-maroon mb-1">Velvet Rouge</p>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Blog Management</h1>
          <p className="text-zinc-400 mt-1 text-sm">Create and manage editorial content.</p>
        </div>
        <Link
          href="/blogs/new"
          className="bg-maroon text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-maroon/90 transition-all shadow-xl shadow-maroon/20 active:scale-95"
        >
          <PlusCircle size={20} />
          <span>New Post</span>
        </Link>
      </header>

      {/* Table card */}
      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        {/* Search */}
        <div className="p-6 border-b border-zinc-100 bg-white">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Search by title or category…"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-maroon focus:border-maroon transition-all text-zinc-900"
            />
          </div>
        </div>

        {/* Body */}
        {isFetching ? (
          <div className="flex items-center justify-center h-52">
            <div className="text-center space-y-3">
              <Loader2 size={32} className="animate-spin text-maroon mx-auto" />
              <p className="text-zinc-400 text-sm font-medium">Loading posts…</p>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-52 gap-3">
            <FileText size={36} className="text-zinc-200" />
            <p className="text-zinc-400 text-sm font-medium">No blog posts yet. Create the first one!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-zinc-900 text-[10px] uppercase tracking-[0.2em] font-black border-b border-zinc-50">
                  <th className="px-8 py-5">Post</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Author</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="group hover:bg-zinc-50/40 transition-colors">
                    {/* Post */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        {blog.coverImage ? (
                          <div className="relative w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                            <Image
                              src={blog.coverImage}
                              alt={blog.title}
                              fill
                              sizes="64px"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-12 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                            <FileText size={18} className="text-zinc-300" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-900 text-base line-clamp-1">{blog.title}</p>
                          {blog.excerpt && (
                            <p className="text-zinc-400 text-[13px] line-clamp-1 mt-0.5">{blog.excerpt}</p>
                          )}
                          {blog.tags?.length > 0 && (
                            <div className="flex gap-1 mt-1.5 flex-wrap">
                              {blog.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-bold rounded uppercase tracking-wide">
                                  {tag}
                                </span>
                              ))}
                              {blog.tags.length > 3 && (
                                <span className="text-[10px] text-zinc-400 font-bold">+{blog.tags.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-8 py-5">
                      {blog.category ? (
                        <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-[11px] font-bold uppercase tracking-wider rounded-full">
                          {blog.category}
                        </span>
                      ) : (
                        <span className="text-zinc-300 text-sm">—</span>
                      )}
                    </td>

                    {/* Author */}
                    <td className="px-8 py-5 text-zinc-600 text-sm font-medium">
                      {blog.author || <span className="text-zinc-300">—</span>}
                    </td>

                    {/* Status */}
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${
                        blog.isPublished
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                      }`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-8 py-5 text-zinc-500 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-zinc-400" />
                        {formatDate(blog.publishedAt ?? blog.createdAt)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Toggle publish */}
                        <button
                          onClick={() => handleTogglePublish(blog)}
                          title={blog.isPublished ? 'Move to drafts' : 'Publish'}
                          className={`p-2.5 rounded-lg transition-all border border-transparent ${
                            blog.isPublished
                              ? 'text-emerald-500 hover:bg-emerald-50 hover:border-emerald-100'
                              : 'text-zinc-300 hover:bg-zinc-100 hover:text-zinc-500 hover:border-zinc-200'
                          }`}
                        >
                          {blog.isPublished ? <Eye size={17} /> : <EyeOff size={17} />}
                        </button>

                        {/* Edit */}
                        <Link
                          href={`/blogs/${blog._id}/edit`}
                          className="p-2.5 rounded-lg text-zinc-300 hover:bg-zinc-100 hover:text-[#BA8C43] transition-all border border-transparent hover:border-zinc-200"
                          title="Edit post"
                        >
                          <Edit3 size={17} />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget({ id: blog._id, title: blog.title })}
                          title="Delete"
                          className="p-2.5 rounded-lg text-zinc-300 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="p-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <span className="text-sm text-zinc-500 font-medium">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!pagination.hasPrev}
                    className="px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-lg text-sm font-semibold disabled:opacity-50 transition-all hover:bg-zinc-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination.hasNext}
                    className="px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-lg text-sm font-semibold disabled:opacity-50 transition-all hover:bg-zinc-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        title="Delete Blog Post"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-5 bg-red-50 rounded-2xl border border-red-100">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <div>
              <p className="font-bold text-zinc-900">Are you absolutely sure?</p>
              <p className="text-zinc-500 text-sm mt-1 leading-relaxed">
                <span className="font-semibold text-zinc-700">&ldquo;{deleteTarget?.title}&rdquo;</span>
                {' '}will be permanently deleted and cannot be recovered.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-xl font-bold transition-colors border border-zinc-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isDeleting && <Loader2 size={16} className="animate-spin" />}
              Delete Post
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
