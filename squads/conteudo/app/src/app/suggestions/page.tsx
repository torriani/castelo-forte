import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuggestionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Sugestões</h1>
        <p className="text-muted-foreground mt-2">
          Sugestões de conteúdo geradas pela IA com rastreabilidade de origem.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sugestões de Conteúdo</CardTitle>
          <CardDescription>
            Cada sugestão indica de onde veio a inspiração (concorrente, post, princípio).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em breve: lista de sugestões com brief, hook sugerido, formato recomendado,
            framework de copy e link para o post/concorrente de origem.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
