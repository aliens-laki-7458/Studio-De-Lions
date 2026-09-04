'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Category {
  id: number;
  name: string;
  image_url?: string;
}

interface Album {
  id: number;
  title: string;
  category: string;
  date: string;
  cover_image_url: string;
}

interface AlbumPhoto {
  id: number;
  image_url: string;
}

interface ManageAlbumsProps {
  categories: Category[];
}

export default function ManageAlbums({ categories }: ManageAlbumsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get category from URL query parameter (e.g. ?category=Wedding)
  const categoryParam = searchParams.get('category');

  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(categoryParam);

  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [date, setDate] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [addingMore, setAddingMore] = useState(false);

  // Sync state with URL parameter if it changes externally or on refresh
  useEffect(() => {
    setSelectedMainCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].name);
    }
    fetchAlbums();
  }, [categories]);

  async function fetchAlbums() {
    const { data, error } = await supabase.from('albums').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching albums:', error);
    }
    if (data) setAlbums(data);
  }

  // Handle selecting a category and updating the URL query
  const handleSelectCategory = (catName: string | null) => {
    setSelectedMainCategory(catName);
    if (catName) {
      router.push(`?category=${encodeURIComponent(catName)}`, { scroll: false });
    } else {
      router.push('?', { scroll: false });
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setImageFiles(fileArray);
      setPreviewUrls(fileArray.map((file) => URL.createObjectURL(file)));
    }
  };

  const getStorageUrl = (fileName: string) => {
    const { data } = supabase.storage.from('gallery').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      alert('කරුණාකර අවම වශයෙන් පින්තූර එකක්වත් තෝරන්න!');
      return;
    }

    setSubmitting(true);
    try {
      const finalCategory = selectedCategory || categories[0]?.name || 'wedding';

      const coverFile = imageFiles[0];
      const coverFileName = `${Date.now()}_cover.jpg`;
      
      const { error: coverUploadError } = await supabase.storage
        .from('gallery')
        .upload(coverFileName, coverFile, { contentType: 'image/jpeg', upsert: true });

      if (coverUploadError) throw coverUploadError;
      const coverUrl = getStorageUrl(coverFileName);

      const { data: albumData, error: albumError } = await supabase
        .from('albums')
        .insert([{ title, category: finalCategory, date, cover_image_url: coverUrl }])
        .select()
        .single();

      if (albumError || !albumData) throw albumError;
      const albumId = albumData.id;

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileName = `${Date.now()}_${i}_photo.jpg`;
        
        const { error: photoUploadError } = await supabase.storage
          .from('gallery')
          .upload(fileName, file, { contentType: 'image/jpeg', upsert: true });

        if (!photoUploadError) {
          const photoUrl = getStorageUrl(fileName);
          await supabase.from('album_photos').insert([{ album_id: albumId, image_url: photoUrl }]);
        }
      }

      alert('✨ Album created successfully!');
      setTitle('');
      setDate('');
      setImageFiles([]);
      setPreviewUrls([]);
      fetchAlbums();
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message || 'Check console'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAlbum = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm('මෙම ඇල්බමය මකා දැමීමට අවශ්‍ය බව විශ්වාසද?')) {
      const { error } = await supabase.from('albums').delete().eq('id', id);
      if (!error) {
        fetchAlbums();
      } else {
        alert('Error deleting album: ' + error.message);
      }
    }
  };

  const handleOpenAlbum = async (album: Album) => {
    setActiveAlbum(album);
    fetchAlbumPhotos(album.id);
  };

  const fetchAlbumPhotos = async (albumId: number) => {
    setLoadingPhotos(true);
    const { data, error } = await supabase
      .from('album_photos')
      .select('*')
      .eq('album_id', albumId);

    if (error) {
      console.error('Error fetching photos:', error);
    }
    if (data) setAlbumPhotos(data);
    setLoadingPhotos(false);
  };

  const handleAddMorePhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeAlbum) return;

    setAddingMore(true);
    try {
      const fileArray = Array.from(files);
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const fileName = `${Date.now()}_${i}_more.jpg`;
        
        const { error: photoUploadError } = await supabase.storage
          .from('gallery')
          .upload(fileName, file, { contentType: 'image/jpeg', upsert: true });

        if (!photoUploadError) {
          const photoUrl = getStorageUrl(fileName);
          await supabase.from('album_photos').insert([{ album_id: activeAlbum.id, image_url: photoUrl }]);
        }
      }
      alert('✨ Photos added successfully!');
      fetchAlbumPhotos(activeAlbum.id);
    } catch (err: any) {
      console.error(err);
      alert('Error adding photos: ' + err.message);
    } finally {
      setAddingMore(false);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (confirm('මෙම පින්තූරය මකා දැමීමට අවශ්‍යද?')) {
      const { error } = await supabase.from('album_photos').delete().eq('id', photoId);
      if (!error && activeAlbum) {
        fetchAlbumPhotos(activeAlbum.id);
      } else {
        alert('Error deleting photo');
      }
    }
  };

  const filteredAlbums = selectedMainCategory 
    ? albums.filter(album => album.category?.toLowerCase() === selectedMainCategory.toLowerCase())
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">Albums & Folders Management</h1>
        <p className="text-xs text-[#9CA3AF] mt-1">Select a category folder to view or manage sub-albums.</p>
      </div>

      {/* Create New Album Form */}
      <div className="bg-[#141419] p-6 rounded-2xl border border-[#262630]">
        <h2 className="text-md font-serif font-semibold text-[#D97706] mb-4 uppercase tracking-wider">Create New Shoot Album</h2>
        <form onSubmit={handleCreateAlbum} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#9CA3AF] uppercase mb-1">Album / Shoot Title (e.g. Ravi & Dil Wedding)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ravi & Dil Wedding"
              className="w-full bg-[#0B0B0E] border border-[#262630] text-white p-3 rounded-xl text-sm outline-none focus:border-[#D97706]"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-[#9CA3AF] uppercase mb-1">Main Category Folder</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#0B0B0E] border border-[#262630] text-white p-3 rounded-xl text-sm outline-none focus:border-[#D97706]"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#9CA3AF] uppercase mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#0B0B0E] border border-[#262630] text-white p-3 rounded-xl text-sm outline-none focus:border-[#D97706] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-[#9CA3AF] uppercase mb-1">Upload Photos</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
              className="w-full bg-[#0B0B0E] border border-[#262630] text-[#9CA3AF] p-2.5 rounded-xl text-xs outline-none file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#D97706] file:text-black cursor-pointer"
              required
            />
          </div>

          {previewUrls.length > 0 && (
            <div className="sm:col-span-2 flex flex-wrap gap-2 mt-2">
              {previewUrls.map((url, i) => (
                <img key={i} src={url} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-[#262630]" />
              ))}
            </div>
          )}

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#D97706] hover:bg-[#b56203] text-black font-semibold text-xs uppercase tracking-widest px-8 py-3 rounded-xl transition-colors cursor-pointer"
            >
              {submitting ? 'Creating Album...' : '+ Save Album Folder'}
            </button>
          </div>
        </form>
      </div>

      {/* STEP 1: If no main category is selected, show category folders */}
      {!selectedMainCategory ? (
        <div>
          <h3 className="text-md font-serif font-semibold text-white mb-4 uppercase tracking-wider">Select Category Folder</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const count = albums.filter(a => a.category?.toLowerCase() === cat.name.toLowerCase()).length;
              return (
                <div 
                  key={cat.id} 
                  onClick={() => handleSelectCategory(cat.name)}
                  className="bg-[#141419] border border-[#262630] rounded-2xl overflow-hidden cursor-pointer hover:border-[#D97706] transition-all group flex flex-col"
                >
                  <div className="h-40 bg-[#0B0B0E] relative overflow-hidden">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-gray-600 uppercase">📁 Folder</div>
                    )}
                  </div>
                  <div className="p-4 flex justify-between items-center bg-[#141419]">
                    <div>
                      <h4 className="text-white font-serif font-semibold text-sm uppercase tracking-wide group-hover:text-[#D97706] transition-colors">{cat.name}</h4>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5">{count} Albums</p>
                    </div>
                    <span className="text-[#D97706] text-sm">➔</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* STEP 2: When a category is selected, show its sub-albums/folders */
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <button 
                onClick={() => handleSelectCategory(null)}
                className="text-xs text-[#D97706] hover:underline mb-2 flex items-center gap-1 cursor-pointer"
              >
                ⬅ Back to Categories
              </button>
              <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider">
                Category: <span className="text-[#D97706]">{selectedMainCategory}</span> ({filteredAlbums.length})
              </h3>
            </div>
          </div>

          {filteredAlbums.length === 0 ? (
            <div className="bg-[#141419] border border-[#262630] rounded-2xl p-12 text-center text-[#9CA3AF] text-sm">
              No albums found under this category yet. Create one using the form above!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlbums.map((album) => (
                <div 
                  key={album.id} 
                  onClick={() => handleOpenAlbum(album)}
                  className="bg-[#141419] border border-[#262630] rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer hover:border-[#D97706] transition-all group"
                >
                  <div>
                    <div className="h-48 overflow-hidden relative bg-[#0B0B0E]">
                      {album.cover_image_url ? (
                        <img 
                          src={album.cover_image_url} 
                          alt={album.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-500">No Image</div>
                      )}
                      <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[#D97706] text-[10px] px-2.5 py-1 rounded-full uppercase font-semibold">
                        {album.date}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-serif font-medium text-base group-hover:text-[#D97706] transition-colors">{album.title}</h4>
                    </div>
                  </div>
                  <div className="p-4 border-t border-[#262630] bg-[#0B0B0E] flex justify-between items-center">
                    <span className="text-[11px] text-[#9CA3AF]">📂 Click to view & manage photos</span>
                    <button 
                      onClick={(e) => handleDeleteAlbum(e, album.id)} 
                      className="text-red-400 hover:text-red-300 text-xs uppercase font-semibold z-10 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal to View & Manage Album Photos */}
      {activeAlbum && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141419] border border-[#262630] w-full max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-[#262630] flex justify-between items-center bg-[#0B0B0E]">
              <div>
                <h2 className="text-xl font-serif font-bold text-white">{activeAlbum.title}</h2>
                <p className="text-xs text-[#D97706] mt-0.5 uppercase tracking-wider">{activeAlbum.category} • {activeAlbum.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="bg-[#D97706] hover:bg-[#b56203] text-black text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5">
                  <span>{addingMore ? 'Uploading...' : '+ Add Photos'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleAddMorePhotos} 
                    disabled={addingMore}
                    className="hidden" 
                  />
                </label>
                <button 
                  onClick={() => setActiveAlbum(null)}
                  className="bg-[#262630] hover:bg-red-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {loadingPhotos ? (
                <div className="text-center py-12 text-[#9CA3AF] text-sm animate-pulse">Loading photos...</div>
              ) : albumPhotos.length === 0 ? (
                <div className="text-center py-12 text-[#9CA3AF] text-sm">No photos found in this album. Use "+ Add Photos" above to upload.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {albumPhotos.map((photo) => (
                    <div 
                      key={photo.id} 
                      className="h-40 bg-[#0B0B0E] rounded-xl overflow-hidden border border-[#262630] relative group flex flex-col justify-between"
                    >
                      <div 
                        onClick={() => setSelectedPhoto(photo.image_url)} 
                        className="h-28 overflow-hidden cursor-pointer relative"
                      >
                        <img 
                          src={photo.image_url} 
                          alt="album photo" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs bg-black/60 px-2 py-1 rounded-md">🔍 View</span>
                        </div>
                      </div>
                      <div className="p-2 bg-[#141419] border-t border-[#262630] flex justify-between items-center text-xs">
                        <span className="text-[10px] text-[#9CA3AF]">Photo</span>
                        <button 
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="text-red-400 hover:text-red-300 font-semibold text-[11px] cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-55 flex items-center justify-center p-4">
          <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center">
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 bg-[#262630] hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-colors cursor-pointer z-60"
            >
              ✕
            </button>
            <img 
              src={selectedPhoto} 
              alt="Fullscreen view" 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-[#262630] shadow-2xl" 
            />
          </div>
        </div>
      )}
    </div>
  );
}