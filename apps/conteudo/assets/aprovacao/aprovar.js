import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

const params = new URLSearchParams(location.search);
const token = params.get("token");
const cliente = params.get("cliente") || location.pathname.split("/").filter(Boolean)[1] || "castelo-forte";
const somenteCorrigidos = params.get("corrigidos") === "1";

const lista = document.getElementById("lista");
const tpl = document.getElementById("cardTpl");
const msgEl = document.getElementById("msg");

function msg(text, ms = 2200) {
  msgEl.textContent = text;
  msgEl.hidden = false;
  clearTimeout(msg._t);
  msg._t = setTimeout(() => (msgEl.hidden = true), ms);
}

function headers(extra = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function apiGET(path) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: headers() });
  if (!r.ok) throw new Error(`GET ${path} -> ${r.status} ${await r.text()}`);
  return r.json();
}

async function rpc(fn, body) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`RPC ${fn} -> ${r.status} ${await r.text()}`);
  return r.json();
}

async function carregar() {
  if (!token) {
    lista.innerHTML = `<p style="text-align:center;padding:40px;color:#888">Link inválido — token não informado.</p>`;
    return;
  }
  // valida token
  const cli = await apiGET(`aprovacao_clientes?slug=eq.${encodeURIComponent(cliente)}&select=*`);
  if (!cli.length || cli[0].token_aprovador !== token) {
    lista.innerHTML = `<p style="text-align:center;padding:40px;color:#b32a2a">Link inválido ou expirado. Peça um novo ao admin.</p>`;
    return;
  }

  // posts + decisoes
  const posts = await apiGET(
    `aprovacao_posts?cliente_slug=eq.${encodeURIComponent(cliente)}&select=*&order=ordem.asc`,
  );
  const decisoes = await apiGET(`aprovacao_decisoes?select=*`);
  const decByPost = Object.fromEntries(decisoes.map((d) => [d.post_id, d]));

  let mostrados = posts;
  if (somenteCorrigidos) {
    mostrados = posts.filter((p) => {
      const d = decByPost[p.id];
      return d && d.status === "reprovado" && d.corrigido === true;
    });
  }

  lista.innerHTML = "";
  for (const p of mostrados) {
    const node = tpl.content.cloneNode(true);
    const card = node.querySelector(".card");
    card.dataset.id = p.id;
    node.querySelector(".card-titulo").textContent = p.titulo;
    node.querySelector(".card-tipo").textContent = p.tipo;

    const imgsEl = node.querySelector(".card-imagens");
    (p.imagens || []).forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.loading = "lazy";
      img.alt = p.titulo;
      img.addEventListener("click", () => window.open(src, "_blank"));
      imgsEl.appendChild(img);
    });

    node.querySelector(".card-legenda").textContent = p.legenda || "";

    const dec = decByPost[p.id];
    if (dec) {
      card.dataset.decisao = dec.status;
      const obsEl = node.querySelector(".card-obs");
      if (dec.status === "reprovado") {
        obsEl.hidden = false;
        obsEl.querySelector("textarea").value = dec.observacao || "";
      }
      node.querySelector(".card-status").textContent =
        dec.status === "aprovado"
          ? "Aprovado ✓"
          : dec.corrigido
            ? "Reprovado · já foi corrigido"
            : "Reprovado";
      node.querySelector(".card-status").classList.add("ok");
    }

    // eventos
    node.querySelectorAll(".btn[data-acao]").forEach((b) => {
      b.addEventListener("click", () => decidir(card, b.dataset.acao));
    });
    node.querySelector(".btn-salvar-obs").addEventListener("click", () => {
      const obs = card.querySelector("textarea").value.trim();
      salvarObs(card, obs);
    });

    lista.appendChild(node);
  }

  atualizarContadores();
}

async function decidir(card, status) {
  const id = card.dataset.id;
  const obsEl = card.querySelector(".card-obs");
  const obs = status === "reprovado" ? card.querySelector("textarea").value.trim() : "";
  try {
    await rpc("aprovacao_registrar_decisao", {
      p_token: token,
      p_cliente_slug: cliente,
      p_post_id: id,
      p_status: status,
      p_observacao: obs,
    });
    card.dataset.decisao = status;
    if (status === "reprovado") {
      obsEl.hidden = false;
    } else {
      obsEl.hidden = true;
    }
    const s = card.querySelector(".card-status");
    s.textContent = status === "aprovado" ? "Aprovado ✓" : "Reprovado · adicione uma observação";
    s.className = "card-status ok";
    msg(status === "aprovado" ? "Aprovado!" : "Reprovado. Conta o que precisa mudar.");
    atualizarContadores();
  } catch (e) {
    console.error(e);
    const s = card.querySelector(".card-status");
    s.textContent = "Erro ao salvar. Tenta de novo.";
    s.className = "card-status err";
  }
}

async function salvarObs(card, observacao) {
  const id = card.dataset.id;
  try {
    await rpc("aprovacao_registrar_decisao", {
      p_token: token,
      p_cliente_slug: cliente,
      p_post_id: id,
      p_status: "reprovado",
      p_observacao: observacao,
    });
    msg("Observação salva.");
    const s = card.querySelector(".card-status");
    s.textContent = "Reprovado · observação salva";
    s.className = "card-status ok";
  } catch (e) {
    console.error(e);
    msg("Erro ao salvar observação");
  }
}

function atualizarContadores() {
  const cards = document.querySelectorAll(".card");
  let p = 0, a = 0, r = 0;
  cards.forEach((c) => {
    const d = c.dataset.decisao;
    if (d === "aprovado") a++;
    else if (d === "reprovado") r++;
    else p++;
  });
  document.getElementById("cPendente").textContent = p;
  document.getElementById("cAprovado").textContent = a;
  document.getElementById("cReprovado").textContent = r;
}

carregar().catch((e) => {
  console.error(e);
  lista.innerHTML = `<p style="text-align:center;padding:40px;color:#b32a2a">Erro: ${e.message}</p>`;
});
