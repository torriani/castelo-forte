import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, storage: localStorage },
});

const loginEl = document.getElementById("login");
const painelEl = document.getElementById("painel");
const loginErr = document.getElementById("loginErr");

async function checkSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    showPainel();
  } else {
    showLogin();
  }
}

function showLogin() {
  loginEl.hidden = false;
  painelEl.hidden = true;
}

function showPainel() {
  loginEl.hidden = true;
  painelEl.hidden = false;
  carregar();
}

document.getElementById("btnLogin").addEventListener("click", async () => {
  loginErr.hidden = true;
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) {
    loginErr.textContent = "Email ou senha incorretos";
    loginErr.hidden = false;
    return;
  }
  showPainel();
});

document.getElementById("btnLogout").addEventListener("click", async () => {
  await supabase.auth.signOut();
  showLogin();
});

let clienteAtivo = null;
let clientesCache = [];
let postsCache = [];
let decisoesCache = [];

async function carregar() {
  // lista clientes
  const { data: clientes, error: errCli } = await supabase.from("aprovacao_clientes").select("*");
  if (errCli) {
    alert("erro: " + errCli.message);
    return;
  }
  clientesCache = clientes;
  const sel = document.getElementById("selCliente");
  sel.innerHTML = "";
  clientes.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.slug;
    opt.textContent = c.nome;
    sel.appendChild(opt);
  });
  sel.addEventListener("change", () => renderCliente(sel.value));
  if (clientes.length) renderCliente(clientes[0].slug);
}

async function renderCliente(slug) {
  clienteAtivo = slug;
  const { data: posts } = await supabase
    .from("aprovacao_posts")
    .select("*")
    .eq("cliente_slug", slug)
    .order("ordem");
  const { data: decisoes } = await supabase.from("aprovacao_decisoes").select("*");
  postsCache = posts || [];
  decisoesCache = decisoes || [];
  const decByPost = Object.fromEntries((decisoes || []).map((d) => [d.post_id, d]));

  let pend = 0, aprov = 0, ajust = 0, rep = 0, corr = 0;
  (posts || []).forEach((p) => {
    const d = decByPost[p.id];
    if (!d) pend++;
    else if (d.status === "aprovado") aprov++;
    else if (d.status === "ajustar") { ajust++; if (d.corrigido) corr++; }
    else if (d.status === "reprovado") { rep++; if (d.corrigido) corr++; }
  });
  document.getElementById("sTotal").textContent = posts.length;
  document.getElementById("sPend").textContent = pend;
  document.getElementById("sAprov").textContent = aprov;
  const sAjust = document.getElementById("sAjust"); if (sAjust) sAjust.textContent = ajust;
  document.getElementById("sRep").textContent = rep;
  document.getElementById("sCorrig").textContent = corr;

  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  for (const p of posts) {
    const card = document.createElement("article");
    card.className = "card";
    const d = decByPost[p.id];
    if (d) card.dataset.decisao = d.status;

    const imgs = (p.imagens || [])
      .map((src) => `<img src="${src}" loading="lazy" alt="" />`)
      .join("");

    const obsHtml = d && d.observacao
      ? `<div class="card-obs" style="display:block"><label>Observação do aprovador:</label><p>${escapeHTML(d.observacao)}</p></div>`
      : "";

    const statusLabel = (s, corrigido) => {
      if (s === "aprovado") return "Aprovado ✓";
      if (s === "ajustar") return corrigido ? "Ajustar · corrigido" : "Ajustar · pendente";
      if (s === "reprovado") return corrigido ? "Reprovado · corrigido" : "Reprovado · pendente";
      return "Pendente";
    };
    const statusHtml = d
      ? `<div class="card-status ok">${statusLabel(d.status, d.corrigido)}</div>`
      : `<div class="card-status">Pendente</div>`;

    card.innerHTML = `
      <div class="card-head">
        <div class="card-titulo">${escapeHTML(p.titulo)}</div>
        <span class="card-tipo">${escapeHTML(p.tipo)}</span>
      </div>
      <div class="card-imagens">${imgs}</div>
      <div class="card-legenda">${escapeHTML(p.legenda || "")}</div>
      ${obsHtml}
      ${statusHtml}
    `;
    lista.appendChild(card);
  }
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

document.getElementById("btnExport").addEventListener("click", () => {
  const decByPost = Object.fromEntries(decisoesCache.map((d) => [d.post_id, d]));
  const reprovados = postsCache
    .filter((p) => {
      const d = decByPost[p.id];
      return d && d.status === "reprovado" && !d.corrigido;
    })
    .map((p) => ({
      id: p.id,
      identificador: p.identificador,
      titulo: p.titulo,
      tipo: p.tipo,
      imagens: p.imagens,
      legenda: p.legenda,
      observacao: decByPost[p.id].observacao,
      decidido_em: decByPost[p.id].decidido_em,
    }));
  const blob = new Blob([JSON.stringify({ cliente: clienteAtivo, gerado_em: new Date().toISOString(), reprovados }, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reprovados-${clienteAtivo}-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("btnLink").addEventListener("click", async () => {
  const c = clientesCache.find((c) => c.slug === clienteAtivo);
  if (!c) return;
  const link = `${location.origin}/aprovar/?cliente=${c.slug}&token=${c.token_aprovador}`;
  try {
    await navigator.clipboard.writeText(link);
    alert("Link copiado:\n\n" + link);
  } catch {
    prompt("Copia o link:", link);
  }
});

checkSession();
