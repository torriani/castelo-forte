import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HookLabPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Hook Lab</h1>
        <p className="text-muted-foreground mt-2">
          Banco de hooks filtrado por tipo, engagement e concorrente.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Laboratório de Hooks</CardTitle>
          <CardDescription>
            Explore e filtre hooks extraídos dos posts analisados para inspiração.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em breve: banco de hooks com filtros por tipo (pergunta, polêmica, curiosidade, etc.),
            ordenação por engagement rate, e agrupamento por concorrente/nicho.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
