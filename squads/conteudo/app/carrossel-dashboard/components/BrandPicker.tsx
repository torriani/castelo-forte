import React, { useState, useRef } from 'react';
import { ChevronDown, Plus, X, Upload, Palette, Check } from 'lucide-react';
import { BrandProfile } from '../types';
import { NewBrandData } from '../hooks/useBrands';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

interface BrandPickerProps {
  brands: BrandProfile[];
  selectedBrand: BrandProfile | null;
  loading: boolean;
  onSelect: (id: string) => void;
  onCreate: (data: NewBrandData) => Promise<BrandProfile | null>;
}

// Formulario de novo brand
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

export const BrandPicker: React.FC<BrandPickerProps> = ({
  brands,
  selectedBrand,
  loading,
  onSelect,
  onCreate,
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewBrandData>({ ...EMPTY_FORM });
  const [creating, setCreating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsOpen(false);
  };

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
      setIsOpen(false);
    }
    setCreating(false);
  };

  const handleCancel = () => {
    setForm({ ...EMPTY_FORM });
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-[#121214] rounded-lg border border-white/10">
        <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
        <span className="text-[10px] text-zinc-500">Carregando brands...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Hidden input para upload de avatar */}
      <input
        type="file"
        ref={avatarInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
      />

      {/* Dropdown trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-[#121214] rounded-lg border border-white/10 hover:border-white/20 transition-colors"
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          {selectedBrand?.avatarUrl ? (
            <img
              src={selectedBrand.avatarUrl}
              alt=""
              className="w-6 h-6 rounded-full object-cover shrink-0"
            />
          ) : (
            <div
              className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center"
              style={{ backgroundColor: selectedBrand?.corAccent || '#333' }}
            >
              <span className="text-[8px] font-bold text-white">
                {selectedBrand?.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
          )}
          <div className="flex flex-col items-start min-w-0">
            <span className="text-xs text-white font-medium truncate max-w-[180px]">
              {selectedBrand?.name || 'Selecionar brand'}
            </span>
            {selectedBrand?.handle && (
              <span className="text-[9px] text-zinc-500">@{selectedBrand.handle}</span>
            )}
          </div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#0c0c0e] border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden">
          {/* Lista de brands */}
          <div className="max-h-48 overflow-y-auto">
            {brands.map(brand => (
              <button
                key={brand.id}
                onClick={() => handleSelect(brand.id!)}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 text-left transition-colors ${
                  brand.id === selectedBrand?.id
                    ? 'bg-white/5'
                    : 'hover:bg-white/5'
                }`}
              >
                {brand.avatarUrl ? (
                  <img src={brand.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                ) : (
                  <div
                    className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: brand.corAccent || '#333' }}
                  >
                    <span className="text-[7px] font-bold text-white">{brand.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] text-white block truncate">{brand.name}</span>
                  <span className="text-[9px] text-zinc-600 block">@{brand.handle}</span>
                </div>
                {/* Cores preview */}
                <div className="flex items-center space-x-0.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: brand.corPrimaria || '#000' }} />
                  <div className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: brand.corAccent || '#d4b995' }} />
                </div>
                {brand.id === selectedBrand?.id && (
                  <Check className="w-3 h-3 text-green-500 shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Separador */}
          <div className="border-t border-white/5" />

          {/* Botao novo brand ou formulario */}
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center space-x-2 px-3 py-2.5 text-left hover:bg-white/5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[11px] text-zinc-400">Novo brand</span>
            </button>
          ) : (
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Novo Brand</span>
                <button onClick={handleCancel} className="text-zinc-600 hover:text-zinc-400">
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Nome + Handle */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] text-zinc-600 font-bold uppercase mb-0.5">Nome</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu Nome"
                    className="w-full bg-[#18181b] border border-white/10 rounded px-2 py-1.5 text-[11px] text-white outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-[8px] text-zinc-600 font-bold uppercase mb-0.5">Handle</label>
                  <input
                    type="text"
                    value={form.handle}
                    onChange={e => setForm(prev => ({ ...prev, handle: e.target.value.replace('@', '') }))}
                    placeholder="seunome"
                    className="w-full bg-[#18181b] border border-white/10 rounded px-2 py-1.5 text-[11px] text-white outline-none focus:border-white/20"
                  />
                </div>
              </div>

              {/* Marca + Tagline */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] text-zinc-600 font-bold uppercase mb-0.5">Marca</label>
                  <input
                    type="text"
                    value={form.marcaNome || ''}
                    onChange={e => setForm(prev => ({ ...prev, marcaNome: e.target.value }))}
                    placeholder="F2L"
                    className="w-full bg-[#18181b] border border-white/10 rounded px-2 py-1.5 text-[11px] text-white outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-[8px] text-zinc-600 font-bold uppercase mb-0.5">Categoria</label>
                  <input
                    type="text"
                    value={form.categoria || ''}
                    onChange={e => setForm(prev => ({ ...prev, categoria: e.target.value }))}
                    placeholder="IA FIRST"
                    className="w-full bg-[#18181b] border border-white/10 rounded px-2 py-1.5 text-[11px] text-white outline-none focus:border-white/20"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-[8px] text-zinc-600 font-bold uppercase mb-0.5">Tagline</label>
                <input
                  type="text"
                  value={form.tagline || ''}
                  onChange={e => setForm(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="FAMILIA, LUCRO E LIBERDADE"
                  className="w-full bg-[#18181b] border border-white/10 rounded px-2 py-1.5 text-[11px] text-white outline-none focus:border-white/20"
                />
              </div>

              {/* Avatar upload */}
              <div>
                <label className="block text-[8px] text-zinc-600 font-bold uppercase mb-0.5">Avatar</label>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="w-full bg-[#18181b] border border-white/10 border-dashed rounded px-2 py-1.5 flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  {uploadingAvatar ? (
                    <div className="flex items-center space-x-1.5">
                      <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-[9px] text-zinc-500">Enviando...</span>
                    </div>
                  ) : form.avatarUrl ? (
                    <div className="flex items-center space-x-2 w-full">
                      <img src={form.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                      <span className="text-[9px] text-zinc-400">Alterar avatar</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-zinc-600">
                      <Upload className="w-3 h-3" />
                      <span className="text-[9px]">Upload avatar</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Cores */}
              <div>
                <div className="flex items-center space-x-1.5 mb-1.5">
                  <Palette className="w-3 h-3 text-zinc-500" />
                  <label className="text-[8px] text-zinc-600 font-bold uppercase">Cores</label>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="color"
                      value={form.corPrimaria || '#000000'}
                      onChange={e => setForm(prev => ({ ...prev, corPrimaria: e.target.value }))}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      title="Cor primaria"
                    />
                    <span className="text-[8px] text-zinc-600">Prim.</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="color"
                      value={form.corSecundaria || '#666666'}
                      onChange={e => setForm(prev => ({ ...prev, corSecundaria: e.target.value }))}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      title="Cor secundaria"
                    />
                    <span className="text-[8px] text-zinc-600">Sec.</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="color"
                      value={form.corAccent || '#d4b995'}
                      onChange={e => setForm(prev => ({ ...prev, corAccent: e.target.value }))}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      title="Cor accent"
                    />
                    <span className="text-[8px] text-zinc-600">Accent</span>
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
                <span className="text-[10px] text-zinc-400">Selo de verificado</span>
              </label>

              {/* Botao criar */}
              <button
                onClick={handleCreate}
                disabled={creating || !form.name || !form.handle}
                className={`w-full py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                  creating || !form.name || !form.handle
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {creating ? 'Criando...' : 'Criar Brand'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay para fechar dropdown ao clicar fora */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setIsOpen(false); setShowForm(false); }}
        />
      )}
    </div>
  );
};
