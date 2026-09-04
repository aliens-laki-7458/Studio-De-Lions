'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { Offer } from '@/types/admin';

interface ManageOffersProps {
  offers: Offer[];
  onAddOffer: (data: { title: string; discountText: string; description: string; validUntil: string }) => Promise<void>;
  onDeleteOffer: (id: number) => Promise<void>;
  submittingOffer: boolean;
}

export default function ManageOffers({ offers, onAddOffer, onDeleteOffer, submittingOffer }: ManageOffersProps) {
  const [offerTitle, setOfferTitle] = useState('');
  const [discountText, setDiscountText] = useState('');
  const [offerDesc, setOfferDesc] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddOffer({ title: offerTitle, discountText, description: offerDesc, validUntil });
    setOfferTitle('');
    setDiscountText('');
    setOfferDesc('');
    setValidUntil('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">Special & Time-Limit Offers</h1>
        <p className="text-xs text-[#9CA3AF] mt-1">Publish promotional discounts and limited-time deals.</p>
      </div>

      <div className="bg-[#141419] p-6 rounded-2xl border border-[#262630]">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-xs text-[#9CA3AF] uppercase mb-1">Offer Title</label>
            <input
              type="text"
              value={offerTitle}
              onChange={(e) => setOfferTitle(e.target.value)}
              placeholder="e.g. August Wedding Special"
              className="w-full bg-[#0B0B0E] border border-[#262630] text-white p-3 rounded-xl text-sm outline-none focus:border-[#D97706]"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-[#9CA3AF] uppercase mb-1">Discount Tag</label>
            <input
              type="text"
              value={discountText}
              onChange={(e) => setDiscountText(e.target.value)}
              placeholder="e.g. 10% OFF"
              className="w-full bg-[#0B0B0E] border border-[#262630] text-white p-3 rounded-xl text-sm outline-none focus:border-[#D97706]"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-[#9CA3AF] uppercase mb-1">Valid Until</label>
            <input
              type="text"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              placeholder="e.g. August 31, 2026"
              className="w-full bg-[#0B0B0E] border border-[#262630] text-white p-3 rounded-xl text-sm outline-none focus:border-[#D97706]"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={submittingOffer}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-widest px-8 py-3 rounded-xl transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              {submittingOffer ? 'Publishing...' : '+ Publish Special Offer'}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-[#0B0B0E] border border-[#262630] p-4 rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-semibold uppercase">{offer.discount_text}</span>
                <h4 className="text-white text-sm font-semibold mt-1">{offer.title}</h4>
                <p className="text-xs text-[#9CA3AF]">Valid until: {offer.valid_until}</p>
              </div>
              <button
                onClick={() => onDeleteOffer(offer.id)}
                className="text-red-400 hover:text-red-300 text-xs border border-red-500/30 px-3 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}