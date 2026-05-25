import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeedPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Feed de Conteúdo</h1>
        <p className="text-muted-foreground mt-2">
          Timeline de posts coletados dos concorrentes monitorados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Posts Coletados</CardTitle>
          <CardDescription>
            Visualize todos os posts coletados via scraping, filtrados por concorrente, tipo e período.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em breve: timeline de posts, filtros por tipo (carrossel, reel, imagem),
            ordenação por engajamento e data, e preview de conteúdo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
