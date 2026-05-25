"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockCarousels, type Carousel } from "@/lib/mock-publicacoes";
import { Eye } from "lucide-react";

const statusConfig: Record<
  Carousel["status"],
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  pendente: { label: "Pendente", variant: "secondary" },
  aprovado: { label: "Aprovado", variant: "default" },
  publicado: { label: "Publicado", variant: "outline" },
  rejeitado: { label: "Rejeitado", variant: "destructive" },
};

function CarouselCard({ carousel }: { carousel: Carousel }) {
  const status = statusConfig[carousel.status];
  const preview = carousel.slides[0]?.text.slice(0, 80) ?? "";

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">
            {carousel.title}
          </CardTitle>
          <Badge variant={status.variant} className="shrink-0">
            {status.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Badge variant="outline" className="text-xs">
            {carousel.type}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {carousel.slideCount} slides
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {preview}
          {carousel.slides[0]?.text.length > 80 ? "..." : ""}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {carousel.createdAt}
          </span>
          <Link href={`/publicacoes/${carousel.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="mr-1 h-3 w-3" />
              Ver
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function CarouselGrid({ carousels }: { carousels: Carousel[] }) {
  if (carousels.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Nenhum carrossel encontrado nesta categoria.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {carousels.map((carousel) => (
        <CarouselCard key={carousel.id} carousel={carousel} />
      ))}
    </div>
  );
}

export default function PublicacoesPage() {
  const pendingCount = mockCarousels.filter(
    (c) => c.status === "pendente"
  ).length;

  const pendentes = mockCarousels.filter((c) => c.status === "pendente");
  const aprovados = mockCarousels.filter((c) => c.status === "aprovado");
  const publicados = mockCarousels.filter((c) => c.status === "publicado");

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">Publicacoes</h1>
        {pendingCount > 0 && (
          <Badge variant="secondary">{pendingCount} pendentes</Badge>
        )}
      </div>

      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="aprovados">Aprovados</TabsTrigger>
          <TabsTrigger value="publicados">Publicados</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <CarouselGrid carousels={mockCarousels} />
        </TabsContent>
        <TabsContent value="pendentes">
          <CarouselGrid carousels={pendentes} />
        </TabsContent>
        <TabsContent value="aprovados">
          <CarouselGrid carousels={aprovados} />
        </TabsContent>
        <TabsContent value="publicados">
          <CarouselGrid carousels={publicados} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
