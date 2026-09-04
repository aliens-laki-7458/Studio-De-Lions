'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { Category } from '@/types/admin';
import { supabase } from '@/lib/supabase';

interface ManageCategoriesProps {
  categories: Category[];
  onAddCategory: (categoryName: string, imageUrl: string) => Promise<void>;
  onDeleteCategory: (categoryId: number) => Promise<void>;
  submittingCat: boolean;
}

export default function ManageCategories({ categories, onAddCategory, onDeleteCategory, submittingCat }: ManageCategoriesProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryFile, setCategoryFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const getStorageUrl = (fileName: string) => {
    const { data } = supabase.storage.from('gallery').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setUploading(true);
    try {
      let imageUrl = '';

      // Upload category thumbnail from device if selected
      if (categoryFile) {
        const fileName = `cat_${Date.now()}_${categoryFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(fileName, categoryFile, { contentType: 'image/jpeg', upsert: true });

        if (uploadError) throw uploadError;
        imageUrl = getStorageUrl(fileName);
      }

      await onAddCategory(newCategoryName, imageUrl);
      setNewCategoryName('');
      setCategoryFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      console.error(err);
      alert('Error uploading category image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (catId: number, catName: string) => {
    if (window.confirm(`Are you sure you want to delete the category "${catName}"?`)) {
      setDeletingId(catId);
      try {
        await onDeleteCategory(catId);
      } catch (err: any) {
        console.error(err);
        alert('Error deleting category: ' + err.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">Category Management</h1>
        <p className="text-xs text-[#9CA3AF] mt-1">Organize your studio work into dedicated portfolios with cover thumbnails.</p>
      </div>

      <div className="bg-[#141419] p-6 rounded-2xl border border-[#262630]">
        <h2 className="text-md font-serif font-semibold text-[#D97706] mb-4 uppercase tracking-wider">Add New Category</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs text-[#9CA3AF] uppercase mb-1">Category Name</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. WILDLIFE"
              className="w-full bg-[#0B0B0E] border border-[#262630] text-white p-3 rounded-xl text-sm outline-none focus:border-[#D97706]"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-[#9CA3AF] uppercase mb-1">Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full bg-[#0B0B0E] border border-[#262630] text-[#9CA3AF] p-2.5 rounded-xl text-xs outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#D97706] file:text-black cursor-pointer"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={submittingCat || uploading}
              className="w-full bg-[#D97706] hover:bg-[#b56203] text-black font-semibold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-[#D97706]/20 cursor-pointer"
            >
              {submittingCat || uploading ? 'Adding...' : '+ Add Category'}
            </button>
          </div>
        </form>

        {previewUrl && (
          <div className="mt-4 flex items-center gap-4">
            <span className="text-xs text-[#9CA3AF]">Preview:</span>
            <img src={previewUrl} alt="Thumbnail preview" className="w-16 h-16 object-cover rounded-xl border border-[#262630]" />
          </div>
        )}

        {/* Categories Grid with Thumbnails and Delete Option */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {categories.map((cat: any) => (
            <div key={cat.id} className="bg-[#0B0B0E] border border-[#262630] rounded-xl overflow-hidden flex flex-col group relative">
              
              <button
                type="button"
                onClick={() => handleDelete(cat.id, cat.name)}
                disabled={deletingId === cat.id}
                className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors z-10 cursor-pointer backdrop-blur-sm"
                title="Delete Category"
              >
                {deletingId === cat.id ? '...' : '✕'}
              </button>

              <div className="h-28 bg-[#141419] relative overflow-hidden">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="flex items-center justify-center h-full text-[10px] text-gray-600 uppercase">No Image</div>
                )}
              </div>
              <div className="p-3 text-center">
                <span className="text-white text-xs font-semibold tracking-wide uppercase">{cat.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}