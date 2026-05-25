import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DigestPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Digest</h1>
        <p className="text-muted-foreground mt-2">
          Relatórios semanais e mensais consolidados da inteligência competitiva.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Digest Semanal</CardTitle>
          <CardDescription>
            Resumo automático dos principais insights do período.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em breve: relatório semanal com top posts, hooks em tendência,
            novos gaps identificados e sugestões geradas no período.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
