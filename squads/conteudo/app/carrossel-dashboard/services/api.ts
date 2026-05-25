import { BrowseResponse } from '../types';

export async function fetchBrowseTree(): Promise<BrowseResponse> {
  const res = await fetch('/api/browse');
  if (!res.ok) throw new Error('Falha ao carregar arvore de carrosseis');
  return res.json();
}

export async function fetchCarouselContent(path: string): Promise<string> {
  const res = await fetch(`/api/carousel?path=${encodeURIComponent(path)}`);
  if (!res.ok) throw new Error('Falha ao carregar carrossel');
  const data = await res.json();
  return data.content;
}
