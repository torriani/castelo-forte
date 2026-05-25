import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground mt-2">
          Análise do seu próprio perfil do Instagram. Configure seu handle e veja métricas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração do Perfil</CardTitle>
          <CardDescription>
            Conecte seu perfil do Instagram para análise de métricas e benchmarking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em breve: formulário de configuração do perfil, métricas de engajamento,
            análise de conteúdo próprio e comparação com concorrentes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
