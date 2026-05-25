import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Rss, BarChart3, Lightbulb } from "lucide-react";

const stats = [
  { title: "Concorrentes", value: "0", description: "Monitorados", icon: Users },
  { title: "Posts Coletados", value: "0", description: "No feed", icon: Rss },
  { title: "Análises", value: "0", description: "Realizadas", icon: BarChart3 },
  { title: "Sugestões", value: "0", description: "Pendentes", icon: Lightbulb },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral da inteligência competitiva do seu perfil.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Começar</CardTitle>
          <CardDescription>
            Configure seu perfil e adicione concorrentes para iniciar a análise.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Configure seu perfil na seção &quot;Meu Perfil&quot;</li>
            <li>Adicione concorrentes (5 BR + 5 US recomendado)</li>
            <li>Execute o scraping para coletar posts</li>
            <li>Analise os posts coletados com IA</li>
            <li>Receba sugestões de conteúdo baseadas nos insights</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
