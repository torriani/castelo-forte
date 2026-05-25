"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { mockCarousels, type Carousel } from "@/lib/mock-publicacoes";
import {
  ArrowLeft,
  Check,
  X,
  Send,
  Calendar,
  Image,
  ChevronDown,
} from "lucide-react";

const statusConfig: Record<
  Carousel["status"],
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  pendente: { label: "Pendente", variant: "secondary" },
  aprovado: { label: "Aprovado", variant: "default" },
  publicado: { label: "Publicado", variant: "outline" },
  rejeitado: { label: "Rejeitado", variant: "destructive" },
};

export default function CarouselDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const carousel = mockCarousels.find((c) => c.id === id);
  const [imageMethod, setImageMethod] = useState<string | null>(null);

  if (!carousel) {
    return (
      <div className="space-y-4">
        <Link href="/publicacoes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <p className="text-muted-foreground">Carrossel nao encontrado.</p>
      </div>
    );
  }

  const status = statusConfig[carousel.status];
  const isApproved = carousel.status === "aprovado";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/publicacoes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{carousel.title}</h1>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Slides preview */}
        <div className="space-y-4 lg:col-span-3">
          <h2 className="text-lg font-semibold">
            Slides ({carousel.slideCount})
          </h2>
          <div className="space-y-3">
            {carousel.slides.map((slide) => (
              <Card key={slide.number}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">
                    Slide {slide.number}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">{slide.text}</p>
                  {slide.imagePath && (
                    <div className="flex items-center gap-2 rounded-md border border-dashed border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                      <Image className="h-4 w-4" />
                      {slide.imagePath}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Actions panel */}
        <div className="space-y-6 lg:col-span-2">
          {/* Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Informacoes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo</span>
                <Badge variant="outline">{carousel.type}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Framework</span>
                <span>{carousel.framework}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Criado em</span>
                <span>{carousel.createdAt}</span>
              </div>
              {carousel.publishedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Publicado em</span>
                  <span>{carousel.publishedAt}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Arquivo</span>
                <span className="max-w-[180px] truncate text-xs">
                  {carousel.sourceFile}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Caption */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Legenda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="whitespace-pre-line text-sm">{carousel.caption}</p>
              <div className="flex flex-wrap gap-1">
                {carousel.hashtags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Image method */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Metodo de Imagem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-2">
                {["Sharp", "HTML", "IA"].map((method) => (
                  <label
                    key={method}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      name="imageMethod"
                      value={method}
                      checked={imageMethod === method}
                      onChange={() => setImageMethod(method)}
                      className="accent-primary"
                    />
                    {method}
                  </label>
                ))}
              </div>
              <Button
                className="w-full"
                variant="outline"
                disabled={!imageMethod}
              >
                <Image className="mr-1 h-4 w-4" />
                Gerar Imagens
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Acoes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Check className="mr-1 h-4 w-4" />
                Aprovar
              </Button>
              <Button variant="destructive" className="w-full">
                <X className="mr-1 h-4 w-4" />
                Rejeitar
              </Button>

              <Separator />

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!isApproved}
              >
                <Send className="mr-1 h-4 w-4" />
                Publicar no Instagram
              </Button>

              <Button variant="outline" className="w-full" disabled={!isApproved}>
                <Calendar className="mr-1 h-4 w-4" />
                Agendar
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={!isApproved}
                  >
                    Publicar via...
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>Instagram Direto</DropdownMenuItem>
                  <DropdownMenuItem>Blotato</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {carousel.postUrl && (
                <a
                  href={carousel.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-xs text-blue-500 hover:underline"
                >
                  Ver post publicado
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
