import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CompetitorsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Concorrentes</h1>
        <p className="text-muted-foreground mt-2">
          Mapa de concorrentes monitorados. Adicione até 5 BR e 5 US para análise.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mapa de Concorrentes</CardTitle>
          <CardDescription>
            Gerencie os perfis que você monitora para inteligência competitiva.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em breve: CRUD de concorrentes, scraping manual via Apify,
            visualização de métricas por concorrente e comparação lado a lado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
