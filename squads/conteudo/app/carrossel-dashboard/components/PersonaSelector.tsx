import React, { useState, useRef } from 'react';
import { User, Plus, X, Upload, Palette, Sparkles, Check } from 'lucide-react';
import { BrandProfile } from '../types';
import { NewBrandData } from '../hooks/useBrands';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

interface PersonaSelectorProps {
  brands: BrandProfile[];
  brandsLoading: boolean;
  onSelect: (brand: BrandProfile) => void;
  onCreate: (data: NewBrandData) => Promise<BrandProfile | null>;
}

const EMPTY_FORM: NewBrandData = {
  name: '',
  handle: '',
  avatarUrl: '',
  isVerified: false,
  marcaNome: '',
  tagline: '',
  categoria: '',
  corPrimaria: '#000000',
  corSecundaria: '#666666',
  corAccent: '#d4b995',
};

const BUCKET = 'carrossel-images';

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  brands,
  brandsLoading,
  onSelect,
  onCreate,
}) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewBrandData>({ ...EMPTY_FORM });
  const [creating, setCreating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
      const filename = `brands/${user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filename, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        return;
      }

      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filename);

      setForm(prev => ({ ...prev, avatarUrl: urlData.publicUrl }));
    } catch (err) {
      console.error('Erro no upload de avatar:', err);
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleCreate = async () => {
    if (!form.name || !form.handle) return;
    setCreating(true);
    const result = await onCreate(form);
    if (result) {
      setForm({ ...EMPTY_FORM });
      setShowForm(false);
      onSelect(result);
    }
    setCreating(false);
  };

  if (brandsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 text-xs">Carregando personas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-black">
      <div className="max-w-lg w-full px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#18181b] border border-white/10 flex items-center justify-center mx-auto mb-5">
            <User className="w-5 h-5 text-zinc-400" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Escolha sua Persona</h1>
          <p className="text-sm text-zinc-500 mt-2">Quem vai postar hoje?</p>
        </div>

        {/* Brand cards */}
        {brands.length > 0 && !showForm && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {brands.map(brand => (
              <button
                key={brand.id}
                onClick={() => onSelect(brand)}
                className="group flex flex-col items-center p-5 bg-[#09090b] border border-white/5 rounded-xl hover:border-white/20 hover:bg-[#0c0c0e] transition-all"
              >
                {brand.avatarUrl ? (
                  <img
                    src={brand.avatarUrl}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover mb-3 ring-2 ring-transparent group-hover:ring-white/20 transition-all"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-3 ring-2 ring-transparent group-hover:ring-white/20 transition-all"
                    style={{ backgroundColor: brand.corAccent || '#333' }}
                  >
                    <span className="text-lg font-bold text-white">
                      {brand.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <span className="text-sm text-white font-medium truncate max-w-full">{brand.name}</span>
                <span className="text-[10px] text-zinc-500 mt-0.5">@{brand.handle}</span>
                {brand.tagline && (
                  <span className="text-[9px] text-zinc-600 mt-1.5 uppercase tracking-wider font-bold truncate max-w-full">
                    {brand.tagline}
                  </span>
                )}
                {/* Cores preview */}
                <div className="flex items-center space-x-1 mt-3">
                  <div className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: brand.corPrimaria || '#000' }} />
                  <div className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: brand.corSecundaria || '#666' }} />
                  <div className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: brand.corAccent || '#d4b995' }} />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Nenhuma persona */}
        {brands.length === 0 && !showForm && (
          <div className="text-center py-8 bg-[#09090b] border border-white/5 rounded-xl mb-6">
            <User className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-500">Nenhuma persona cadastrada</p>
            <p className="text-xs text-zinc-600 mt-1">Crie sua primeira persona para comecar</p>
          </div>
        )}

        {/* Formulario de nova persona */}
        {showForm && (
          <div className="bg-[#09090b] border border-white/10 rounded-xl p-5 space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-widest">Nova Persona</span>
              <button onClick={() => { setShowForm(false); setForm({ ...EMPTY_FORM }); }} className="text-zinc-600 hover:text-zinc-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hidden input para avatar */}
            <input
              type="file"
              ref={avatarInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />

            {/* Avatar upload */}
            <div className="flex justify-center">
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="w-20 h-20 rounded-full bg-[#18181b] border-2 border-dashed border-white/10 hover:border-white/30 flex items-center justify-center transition-all overflow-hidden"
              >
                {uploadingAvatar ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : form.avatarUrl ? (
                  <img src={form.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Upload className="w-4 h-4 text-zinc-500 mx-auto" />
                    <span className="text-[8px] text-zinc-600 mt-1 block">Avatar</span>
                  </div>
                )}
              </button>
            </div>

            {/* Nome + Handle */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] text-zinc-500 font-bold uppercase mb-1">Nome *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Seu Nome"
                  className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-white/20"
                />
              </div>
              <div>
                <label className="block text-[9px] text-zinc-500 font-bold uppercase mb-1">Handle *</label>
                <input
                  type="text"
                  value={form.handle}
                  onChange={e => setForm(prev => ({ ...prev, handle: e.target.value.replace('@', '') }))}
                  placeholder="seunome"
                  className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-white/20"
                />
              </div>
            </div>

            {/* Marca + Categoria */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] text-zinc-500 font-bold uppercase mb-1">Marca</label>
                <input
                  type="text"
                  value={form.marcaNome || ''}
                  onChange={e => setForm(prev => ({ ...prev, marcaNome: e.target.value }))}
                  placeholder="F2L"
                  className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-white/20"
                />
              </div>
              <div>
                <label className="block text-[9px] text-zinc-500 font-bold uppercase mb-1">Categoria</label>
                <input
                  type="text"
                  value={form.categoria || ''}
                  onChange={e => setForm(prev => ({ ...prev, categoria: e.target.value }))}
                  placeholder="IA FIRST"
                  className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-white/20"
                />
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-[9px] text-zinc-500 font-bold uppercase mb-1">Tagline</label>
              <input
                type="text"
                value={form.tagline || ''}
                onChange={e => setForm(prev => ({ ...prev, tagline: e.target.value }))}
                placeholder="FAMILIA, LUCRO E LIBERDADE"
                className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-white/20"
              />
            </div>

            {/* Cores */}
            <div>
              <div className="flex items-center space-x-1.5 mb-2">
                <Palette className="w-3 h-3 text-zinc-500" />
                <label className="text-[9px] text-zinc-500 font-bold uppercase">Cores</label>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5">
                  <input
                    type="color"
                    value={form.corPrimaria || '#000000'}
                    onChange={e => setForm(prev => ({ ...prev, corPrimaria: e.target.value }))}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-[9px] text-zinc-600">Primaria</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="color"
                    value={form.corSecundaria || '#666666'}
                    onChange={e => setForm(prev => ({ ...prev, corSecundaria: e.target.value }))}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-[9px] text-zinc-600">Secundaria</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="color"
                    value={form.corAccent || '#d4b995'}
                    onChange={e => setForm(prev => ({ ...prev, corAccent: e.target.value }))}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-[9px] text-zinc-600">Accent</span>
                </div>
              </div>
            </div>

            {/* Verificado */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isVerified || false}
                onChange={e => setForm(prev => ({ ...prev, isVerified: e.target.checked }))}
                className="rounded border-white/20 bg-[#18181b] text-blue-500"
              />
              <span className="text-[11px] text-zinc-400">Selo de verificado</span>
            </label>

            {/* Botao criar */}
            <button
              onClick={handleCreate}
              disabled={creating || !form.name || !form.handle}
              className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                creating || !form.name || !form.handle
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {creating ? 'Criando...' : 'Criar Persona'}
            </button>
          </div>
        )}

        {/* Botao criar nova persona */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center space-x-2 py-3 border border-dashed border-white/10 rounded-xl text-zinc-500 hover:text-white hover:border-white/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Criar nova persona</span>
          </button>
        )}
      </div>
    </div>
  );
};
