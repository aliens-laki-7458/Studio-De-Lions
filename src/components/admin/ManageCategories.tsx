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

  // Edit කිරීමට අදාළ states
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFile(file);
      setEditPreviewUrl(URL.createObjectURL(file));
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

  // Edit Modal එක විවෘත කිරීම
  const handleOpenEdit = (cat: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditPreviewUrl(cat.image_url || null);
    setEditFile(null);
  };

  // Edit කළ පසු Save කිරීම (Foreign Key එක හරහා albums වල නම ස්වයංක්‍රීයව වෙනස් වේ)
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editName.trim()) return;

    setUpdating(true);
    try {
      let imageUrl = editingCategory.image_url || '';
      const newCategoryName = editName.trim();

      if (editFile) {
        const fileName = `cat_${Date.now()}_${editFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(fileName, editFile, { contentType: 'image/jpeg', upsert: true });

        if (uploadError) throw uploadError;
        imageUrl = getStorageUrl(fileName);
      }

      const { error: catError } = await supabase
        .from('categories')
        .update({ name: newCategoryName, image_url: imageUrl })
        .eq('id', editingCategory.id);

      if (catError) throw catError;

      setEditingCategory(null);
      setEditFile(null);
      setEditPreviewUrl(null);
      alert('✨ Category updated successfully!');
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert('Error updating category: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (catId: number, catName: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

        {/* Categories Grid with Thumbnails, Edit and Delete Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {categories.map((cat: any) => (
            <div key={cat.id} className="bg-[#0B0B0E] border border-[#262630] rounded-xl overflow-hidden flex flex-col group relative">
              
              {/* Delete Button */}
              <button
                type="button"
                onClick={(e) => handleDelete(cat.id, cat.name, e)}
                disabled={deletingId === cat.id}
                className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors z-10 cursor-pointer backdrop-blur-sm"
                title="Delete Category"
              >
                {deletingId === cat.id ? '...' : '✕'}
              </button>

              {/* Edit Button */}
              <button
                type="button"
                onClick={(e) => handleOpenEdit(cat, e)}
                className="absolute top-2 right-11 bg-black/70 hover:bg-[#D97706] text-white w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors z-10 cursor-pointer backdrop-blur-sm"
                title="Edit Category"
              >
                ✏️
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

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141419] border border-[#262630] w-full max-w-md rounded-2xl overflow-hidden p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#262630] pb-3">
              <h3 className="text-md font-serif font-bold text-white uppercase tracking-wider">Edit Category</h3>
              <button 
                onClick={() => setEditingCategory(null)}
                className="text-[#9CA3AF] hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#9CA3AF] uppercase mb-1">Category Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#0B0B0E] border border-[#262630] text-white p-3 rounded-xl text-sm outline-none focus:border-[#D97706]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] uppercase mb-1">Change Thumbnail Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditFileChange}
                  className="w-full bg-[#0B0B0E] border border-[#262630] text-[#9CA3AF] p-2.5 rounded-xl text-xs outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#D97706] file:text-black cursor-pointer"
                />
              </div>

              {editPreviewUrl && (
                <div className="flex items-center gap-4">
                  <span className="text-xs text-[#9CA3AF]">Thumbnail Preview:</span>
                  <img src={editPreviewUrl} alt="Edit preview" className="w-16 h-16 object-cover rounded-xl border border-[#262630]" />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="bg-[#262630] hover:bg-[#353542] text-white text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-[#D97706] hover:bg-[#b56203] text-black font-semibold text-xs uppercase px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}