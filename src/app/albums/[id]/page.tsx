'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Album {
  id: number;
  title: string;
  category: string;
  date: string;
}

interface Photo {
  id: number;
  image_url: string;
}

export default function AlbumViewPage() {
  const params = useParams();
  const id = params?.id;

  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchAlbumDetails() {
      // Fetch Album Info
      const { data: albumData } = await supabase.from('albums').select('*').eq('id', id).single();
      if (albumData) setAlbum(albumData);

      // Fetch Photos inside this Album
      const { data: photoData } = await supabase.from('album_photos').select('*').eq('album_id', id);
      if (photoData) setPhotos(photoData);

      setLoading(false);
    }
    fetchAlbumDetails();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#0B0B0E] text-white flex items-center justify-center">Loading Album...</div>;
  }

  return (
    <main className="min-h-screen bg-[#0B0B0E] text-[#F3F4F6] p-6 sm:p-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-[#D97706] text-xs uppercase tracking-widest hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>

        {album && (
          <div className="mb-12 border-b border-[#262630] pb-6">
            <span className="text-[#D97706] text-xs uppercase tracking-widest font-semibold">{album.category}</span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mt-1">{album.title}</h1>
            <p className="text-xs text-[#9CA3AF] mt-2 uppercase tracking-wider">{album.date} • {photos.length} Photos</p>
          </div>
        )}

        {/* Photos Grid inside the Sub-folder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#262630] bg-[#141419]">
              <Image src={photo.image_url} alt="Shoot photo" fill className="object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}