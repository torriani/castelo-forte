import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Análises</h1>
        <p className="text-muted-foreground mt-2">
          Análises de IA sobre hooks, estrutura, CTA e frameworks dos posts coletados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análise de Posts</CardTitle>
          <CardDescription>
            Cada post é analisado por IA para identificar padrões de copy e engajamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em breve: análise individual de posts, classificação de hooks,
            detecção de frameworks de copy, gap analysis e relatórios comparativos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
