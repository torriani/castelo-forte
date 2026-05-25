// Widget de aprovação — modal fullscreen com lightbox
// Clica no carrossel/frase, abre tela grande, navega slides, dá feedback embaixo
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "/assets/aprovacao/config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const CLIENTE = "castelo-forte";
const LS_KEY = "aprovacao_user_v1";

function getUser() {
  try {
    const v = JSON.parse(localStorage.getItem(LS_KEY) || "null");
    if (v && v.nome && v.email) return v;
  } catch {}
  return null;
}
function setUser(u) { localStorage.setItem(LS_KEY, JSON.stringify(u)); }
function clearUser() { localStorage.removeItem(LS_KEY); }

// ---------- modal de identificação
function modalIdentificar() {
  return new Promise((resolve) => {
    const m = document.createElement("div");
    m.className = "ap-modal";
    m.innerHTML = `
      <div class="ap-modal-card">
        <h3>Antes de aprovar, quem é você?</h3>
        <p>Identifique-se uma vez. Suas escolhas ficam registradas com seu nome.</p>
        <label>Nome completo<input type="text" id="ap-nome" autocomplete="name"></label>
        <label>Email<input type="email" id="ap-email" autocomplete="email"></label>
        <div class="ap-modal-actions">
          <button class="ap-btn ap-btn-primary" id="ap-ok">Continuar</button>
          <button class="ap-btn ap-btn-ghost" id="ap-cancel">Cancelar</button>
        </div>
      </div>`;
    document.body.appendChild(m);
    setTimeout(() => m.classList.add("show"), 20);
    const close = (v) => { m.classList.remove("show"); setTimeout(() => m.remove(), 200); resolve(v); };
    m.querySelector("#ap-ok").addEventListener("click", () => {
      const nome = m.querySelector("#ap-nome").value.trim();
      const email = m.querySelector("#ap-email").value.trim();
      if (!nome || !email || !email.includes("@")) { alert("Preencha nome e email válidos."); return; }
      const u = { nome, email: email.toLowerCase() };
      setUser(u); close(u);
    });
    m.querySelector("#ap-cancel").addEventListener("click", () => close(null));
  });
}

// ---------- cache de posts/decisoes
let postsCache = null;
async function getPostsMap() {
  if (postsCache) return postsCache;
  const { data, error } = await supabase
    .from("aprovacao_posts").select("id, identificador, imagens, titulo, legenda, tipo")
    .eq("cliente_slug", CLIENTE);
  if (error) throw error;
  postsCache = Object.fromEntries(data.map((p) => [p.identificador, p]));
  return postsCache;
}

async function getDecisao(postId, email) {
  if (!email) return null;
  const { data } = await supabase
    .from("aprovacao_decisoes").select("*")
    .eq("post_id", postId).eq("email_aprovador", email).maybeSingle();
  return data || null;
}

// Pega a decisão mais recente de QUALQUER aprovador (pra mostrar badge sem login)
let decisoesTodasCache = null;
async function getDecisoesTodas() {
  if (decisoesTodasCache) return decisoesTodasCache;
  const { data } = await supabase
    .from("aprovacao_decisoes")
    .select("post_id, status, nome_aprovador, decidido_em, corrigido")
    .order("decidido_em", { ascending: false });
  decisoesTodasCache = {};
  for (const d of data || []) {
    if (!decisoesTodasCache[d.post_id]) decisoesTodasCache[d.post_id] = d;
  }
  return decisoesTodasCache;
}

async function salvarDecisao(postId, status, observacao, user) {
  const { error } = await supabase.rpc("aprovacao_registrar_decisao_v2", {
    p_cliente_slug: CLIENTE, p_post_id: postId,
    p_status: status, p_observacao: observacao || "",
    p_nome: user.nome, p_email: user.email,
  });
  if (error) throw error;
}

// ---------- lightbox (navega entre slides E entre items da lista)
// posts: array completo de posts da página atual (mesma ordem dos data-aprovacao)
// startPostIdx: índice do post pra abrir
function abrirLightbox(posts, startPostIdx) {
  let postIdx = startPostIdx;
  let post = posts[postIdx];
  let slides = post.imagens || [];
  let idx = 0;
  let dirty = false;
  // mapa local de decisões já carregadas (pra exibir ao trocar de post)
  const decisoesLocal = {};

  const ov = document.createElement("div");
  ov.className = "ap-lightbox";
  ov.innerHTML = `
    <button class="ap-lb-close" title="Fechar (Esc)">✕</button>
    <div class="ap-lb-stage">
      <button class="ap-lb-nav ap-lb-prev" title="Anterior (←)">‹</button>
      <div class="ap-lb-imgwrap">
        <img class="ap-lb-img" alt="">
        <div class="ap-lb-counter"></div>
      </div>
      <button class="ap-lb-nav ap-lb-next" title="Próximo (→)">›</button>
    </div>
    <div class="ap-lb-bottom">
      <div class="ap-lb-titlebar">
        <div class="ap-lb-title"></div>
        <div class="ap-lb-tools">
          <button class="ap-tool-btn" data-tool="legenda" title="Ver/copiar legenda">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="17" y2="13"/><line x1="7" y1="17" x2="13" y2="17"/></svg>
            Legenda
          </button>
          <button class="ap-tool-btn" data-tool="download" title="Baixar imagens">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Baixar
          </button>
        </div>
      </div>
      <div class="ap-lb-legenda" hidden></div>
      <div class="ap-lb-actions">
        <button class="ap-btn ap-btn-aprovar" data-acao="aprovado">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Aprovar
        </button>
        <button class="ap-btn ap-btn-ajustar" data-acao="ajustar">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Ajustar
        </button>
        <button class="ap-btn ap-btn-reprovar" data-acao="reprovado">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Reprovar
        </button>
        <button class="ap-btn ap-btn-publicado" data-acao="publicado" disabled title="Disponível após aprovar">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/><circle cx="12" cy="12" r="10"/></svg>
          Publicado
        </button>
      </div>
      <textarea class="ap-lb-obs" rows="3" placeholder="O que precisa mudar? (obrigatório pra Ajustar ou Reprovar, opcional pra Aprovar)"></textarea>
      <div class="ap-lb-status"></div>
    </div>`;
  document.body.appendChild(ov);
  document.body.style.overflow = "hidden";
  setTimeout(() => ov.classList.add("show"), 20);

  const imgEl = ov.querySelector(".ap-lb-img");
  const counter = ov.querySelector(".ap-lb-counter");
  const titleEl = ov.querySelector(".ap-lb-title");
  const obsEl = ov.querySelector(".ap-lb-obs");
  const statusEl = ov.querySelector(".ap-lb-status");

  async function carregarDecisaoExistente() {
    if (decisoesLocal[post.id] !== undefined) return decisoesLocal[post.id];
    const u = getUser();
    if (!u) { decisoesLocal[post.id] = null; return null; }
    const d = await getDecisao(post.id, u.email);
    decisoesLocal[post.id] = d;
    return d;
  }

  async function refreshUI() {
    titleEl.textContent = `${post.titulo}  ·  ${postIdx + 1}/${posts.length}`;
    delete ov.dataset.decisao;
    obsEl.value = "";
    statusEl.textContent = "";
    statusEl.className = "ap-lb-status";
    render();
    const d = await carregarDecisaoExistente();
    const btnPub = ov.querySelector('[data-acao="publicado"]');
    if (d) {
      ov.dataset.decisao = d.status;
      obsEl.value = d.observacao || "";
      const labels = {
        aprovado: "Você já aprovou ✓",
        ajustar: "Você pediu ajuste — pode editar observação e re-enviar",
        reprovado: "Você reprovou — pode editar observação e re-enviar",
        publicado: "Marcado como publicado ✓",
      };
      statusEl.textContent = labels[d.status] || "Decisão existente";
      statusEl.className = "ap-lb-status ok";
      // habilita Publicado se já está aprovado ou já foi publicado
      if (btnPub) {
        btnPub.disabled = !(d.status === "aprovado" || d.status === "publicado");
        btnPub.title = btnPub.disabled ? "Aprove antes de marcar como publicado" : "";
      }
    } else {
      if (btnPub) { btnPub.disabled = true; btnPub.title = "Aprove antes de marcar como publicado"; }
    }
  }

  function render() {
    imgEl.src = slides[idx];
    counter.textContent = slides.length > 1
      ? `Slide ${idx + 1} / ${slides.length}`
      : `Peça ${postIdx + 1} / ${posts.length}`;
  }

  function prev() {
    // se tem slide anterior no mesmo post, anda nele
    if (idx > 0) { idx--; render(); return; }
    // senão volta pro post anterior, último slide
    if (postIdx > 0) {
      postIdx--;
      post = posts[postIdx];
      slides = post.imagens || [];
      idx = Math.max(0, slides.length - 1);
      refreshUI();
    }
  }
  function next() {
    // se tem próximo slide no mesmo post, anda nele
    if (idx < slides.length - 1) { idx++; render(); return; }
    // senão vai pro próximo post, slide 0
    if (postIdx < posts.length - 1) {
      postIdx++;
      post = posts[postIdx];
      slides = post.imagens || [];
      idx = 0;
      refreshUI();
    }
  }

  ov.querySelector(".ap-lb-prev").addEventListener("click", prev);
  ov.querySelector(".ap-lb-next").addEventListener("click", next);
  imgEl.addEventListener("click", next);

  // ----- ferramentas: legenda + download
  const legendaPanel = ov.querySelector(".ap-lb-legenda");
  ov.querySelector('[data-tool="legenda"]').addEventListener("click", async () => {
    if (!legendaPanel.hidden) { legendaPanel.hidden = true; return; }
    const txt = post.legenda || "(este post não tem legenda cadastrada)";
    legendaPanel.innerHTML = `
      <div class="ap-lb-legenda-head">
        <strong>Legenda do post</strong>
        <button class="ap-tool-btn ap-tool-btn-mini" data-act="copy">Copiar</button>
        <button class="ap-tool-btn ap-tool-btn-mini" data-act="close">Fechar</button>
      </div>
      <pre class="ap-lb-legenda-txt"></pre>`;
    legendaPanel.querySelector(".ap-lb-legenda-txt").textContent = txt;
    legendaPanel.hidden = false;
    legendaPanel.querySelector('[data-act="copy"]').addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(post.legenda || "");
        legendaPanel.querySelector('[data-act="copy"]').textContent = "Copiado!";
        setTimeout(() => {
          const b = legendaPanel.querySelector('[data-act="copy"]');
          if (b) b.textContent = "Copiar";
        }, 1500);
      } catch {
        prompt("Copia manualmente:", post.legenda || "");
      }
    });
    legendaPanel.querySelector('[data-act="close"]').addEventListener("click", () => {
      legendaPanel.hidden = true;
    });
  });

  ov.querySelector('[data-tool="download"]').addEventListener("click", async () => {
    const btn = ov.querySelector('[data-tool="download"]');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = "Baixando…";
    try {
      // 1 imagem: baixa direto. múltiplas: ZIP via JSZip do esm.sh
      if ((post.imagens || []).length === 1) {
        await downloadSingle(post.imagens[0], `${post.identificador}.png`);
      } else {
        await downloadZip(post);
      }
      btn.textContent = "✓";
      setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 1500);
    } catch (e) {
      console.error(e);
      btn.textContent = "Erro";
      setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 1800);
    }
  });

  // primeira renderização
  refreshUI();

  async function decidir(status) {
    let u = getUser();
    if (!u) { u = await modalIdentificar(); if (!u) return; }
    const obs = obsEl.value.trim();
    if ((status === "reprovado" || status === "ajustar") && !obs) {
      statusEl.textContent = status === "ajustar"
        ? "Pra pedir ajuste, escreve o que precisa mudar."
        : "Pra reprovar, escreve o motivo.";
      statusEl.className = "ap-lb-status err";
      obsEl.focus();
      return;
    }
    statusEl.textContent = "Salvando…";
    statusEl.className = "ap-lb-status";
    try {
      await salvarDecisao(post.id, status, obs, u);
      ov.dataset.decisao = status;
      const label = status === "aprovado" ? "Aprovado" : status === "ajustar" ? "Marcado para ajuste" : status === "publicado" ? "Marcado como publicado" : "Reprovado";
      statusEl.textContent = `${label} por ${u.nome} ✓ — use → pra próximo`;
      statusEl.className = "ap-lb-status ok";
      decisoesLocal[post.id] = { status, observacao: obs, nome_aprovador: u.nome, email_aprovador: u.email };
      // habilita botão publicado depois de aprovar
      const btnPub = ov.querySelector('[data-acao="publicado"]');
      if (btnPub) {
        btnPub.disabled = !(status === "aprovado" || status === "publicado");
        btnPub.title = btnPub.disabled ? "Aprove antes de marcar como publicado" : "";
      }
      dirty = true;
    } catch (e) {
      console.error(e);
      statusEl.textContent = "Erro ao salvar. Tenta de novo.";
      statusEl.className = "ap-lb-status err";
    }
  }

  ov.querySelectorAll(".ap-btn[data-acao]").forEach((b) => {
    b.addEventListener("click", () => decidir(b.dataset.acao));
  });

  function close() {
    ov.classList.remove("show");
    setTimeout(() => {
      ov.remove();
      document.body.style.overflow = "";
      if (dirty) refreshBadges();
    }, 200);
    document.removeEventListener("keydown", keys);
  }
  function keys(e) {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
  }
  document.addEventListener("keydown", keys);
  ov.querySelector(".ap-lb-close").addEventListener("click", close);
  ov.addEventListener("click", (e) => { if (e.target === ov) close(); });

  render();
}

// ---------- aplicar badges + click handler em cada bloco
async function refreshBadges() {
  const blocks = document.querySelectorAll("[data-aprovacao]");
  if (!blocks.length) return;
  const postsMap = await getPostsMap();
  // sempre mostra a decisão mais recente (qualquer aprovador), nao só a do usuário logado
  decisoesTodasCache = null;
  const decisoesTodas = await getDecisoesTodas();

  for (const block of blocks) {
    const ident = block.dataset.aprovacao;
    const post = postsMap[ident];
    if (!post) continue;
    let badge = block.querySelector(".ap-badge");
    if (!badge) {
      badge = document.createElement("div");
      badge.className = "ap-badge";
      block.style.position = "relative";
      block.style.cursor = "pointer";
      block.appendChild(badge);
    }
    const dec = decisoesTodas[post.id];
    block.dataset.decisao = dec ? dec.status : "pendente";
    if (dec) {
      badge.dataset.status = dec.status;
      const txt = { aprovado: "Aprovado", ajustar: "Ajustar", reprovado: "Reprovado", publicado: "Publicado" };
      const label = txt[dec.status] || dec.status;
      badge.textContent = dec.nome_aprovador ? `${label} · ${dec.nome_aprovador.split(" ")[0]}` : label;
    } else {
      delete badge.dataset.status;
      badge.textContent = "Pendente";
    }

    // toolbar inline: Legenda + Baixar (sem precisar abrir lightbox)
    if (!block.querySelector(".ap-inline-tools")) {
      const tools = document.createElement("div");
      tools.className = "ap-inline-tools";
      const temLegenda = !!(post.legenda && post.legenda.trim());
      const podePublicar = dec && (dec.status === "aprovado" || dec.status === "publicado");
      const jaPublicado = dec && dec.status === "publicado";
      tools.innerHTML = `
        ${temLegenda ? `<button class="ap-tool-btn" data-inline="legenda" type="button">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="17" y2="13"/><line x1="7" y1="17" x2="13" y2="17"/></svg>
          Legenda
        </button>` : ""}
        <button class="ap-tool-btn" data-inline="download" type="button">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Baixar
        </button>
        <button class="ap-tool-btn ap-tool-publicar ${jaPublicado ? "is-publicado" : ""}" data-inline="publicar" type="button" ${podePublicar ? "" : "disabled"} title="${podePublicar ? "" : "Aprove antes de marcar como publicado"}">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M5 12l5 5L20 7"/></svg>
          ${jaPublicado ? "Publicado" : "Publicar"}
        </button>
      `;
      // se for um carrossel-block grande, coloca no head; senão coloca no fim do card
      const head = block.querySelector(".head") || block.querySelector(".meta");
      if (head) head.appendChild(tools);
      else block.appendChild(tools);

      // handlers
      const btnLeg = tools.querySelector('[data-inline="legenda"]');
      if (btnLeg) btnLeg.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirModalLegenda(post);
      });
      const btnPub = tools.querySelector('[data-inline="publicar"]');
      if (btnPub) btnPub.addEventListener("click", async (e) => {
        e.stopPropagation();
        let u = getUser();
        if (!u) { u = await modalIdentificar(); if (!u) return; }
        const b = e.currentTarget;
        const orig = b.innerHTML;
        b.disabled = true; b.textContent = "Marcando…";
        try {
          await salvarDecisao(post.id, "publicado", "", u);
          // atualiza badge na hora
          decisoesTodasCache = null;
          await refreshBadges();
        } catch (err) {
          console.error(err);
          b.innerHTML = orig;
          b.disabled = false;
        }
      });

      tools.querySelector('[data-inline="download"]').addEventListener("click", async (e) => {
        e.stopPropagation();
        const b = e.currentTarget;
        const orig = b.innerHTML;
        b.disabled = true;
        b.textContent = "Baixando…";
        try {
          if ((post.imagens || []).length === 1) {
            await downloadSingle(post.imagens[0], `${post.identificador}.png`);
          } else {
            await downloadZip(post);
          }
          b.textContent = "✓";
        } catch (err) {
          console.error(err);
          b.textContent = "Erro";
        }
        setTimeout(() => { b.innerHTML = orig; b.disabled = false; }, 1500);
      });
    }
  }
}

// modal standalone de legenda (chamado da grade, sem lightbox)
function abrirModalLegenda(post) {
  const m = document.createElement("div");
  m.className = "ap-modal";
  m.innerHTML = `
    <div class="ap-modal-card ap-modal-card-wide">
      <h3>Legenda · ${post.titulo}</h3>
      <pre class="ap-lb-legenda-txt"></pre>
      <div class="ap-modal-actions">
        <button class="ap-btn ap-btn-primary" data-act="copy">Copiar legenda</button>
        <button class="ap-btn ap-btn-ghost" data-act="close">Fechar</button>
      </div>
    </div>`;
  document.body.appendChild(m);
  setTimeout(() => m.classList.add("show"), 20);
  m.querySelector(".ap-lb-legenda-txt").textContent = post.legenda || "(sem legenda)";
  const close = () => { m.classList.remove("show"); setTimeout(() => m.remove(), 200); };
  m.querySelector('[data-act="close"]').addEventListener("click", close);
  m.addEventListener("click", (e) => { if (e.target === m) close(); });
  m.querySelector('[data-act="copy"]').addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(post.legenda || "");
      m.querySelector('[data-act="copy"]').textContent = "Copiado!";
      setTimeout(() => {
        const b = m.querySelector('[data-act="copy"]');
        if (b) b.textContent = "Copiar legenda";
      }, 1500);
    } catch {
      prompt("Copia manualmente:", post.legenda || "");
    }
  });
}

async function downloadSingle(url, filename) {
  const r = await fetch(url);
  const blob = await r.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

async function downloadZip(post) {
  const { default: JSZip } = await import("https://esm.sh/jszip@3.10.1");
  const zip = new JSZip();
  const imgs = post.imagens || [];
  for (let i = 0; i < imgs.length; i++) {
    const url = imgs[i];
    const r = await fetch(url);
    const blob = await r.blob();
    const ext = url.split(".").pop().split("?")[0] || "png";
    const idx = String(i + 1).padStart(2, "0");
    const base = url.split("/").pop().split("?")[0].replace(/\.[^.]+$/, "");
    zip.file(`${idx}-${base}.${ext}`, blob);
  }
  if (post.legenda) zip.file("legenda.txt", post.legenda);
  const out = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(out);
  a.download = `${post.identificador}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

async function init() {
  const blocks = document.querySelectorAll("[data-aprovacao]");
  if (!blocks.length) return;
  const postsMap = await getPostsMap();

  // monta lista de posts na ordem em que aparecem na página (ignora os q não estão no DB)
  // por grupo visível (carrosseis = lista única; frases = pode haver 2 abas, mas só os visíveis no momento contam)
  function getListaVisivel() {
    const arr = [];
    document.querySelectorAll("[data-aprovacao]").forEach((b) => {
      // ignora se está dentro de algum grupo escondido (class hidden)
      if (b.closest(".hidden")) return;
      const p = postsMap[b.dataset.aprovacao];
      if (p) arr.push(p);
    });
    return arr;
  }

  for (const block of blocks) {
    const ident = block.dataset.aprovacao;
    const post = postsMap[ident];
    if (!post) continue;
    block.addEventListener("click", async (e) => {
      if (e.target.closest("a,button")) return;
      const lista = getListaVisivel();
      const startIdx = lista.findIndex((p) => p.id === post.id);
      if (startIdx === -1) return;
      abrirLightbox(lista, startIdx);
    });
  }

  await refreshBadges();

  // barra de usuário
  const u = getUser();
  if (u) {
    const bar = document.createElement("div");
    bar.className = "ap-userbar";
    bar.innerHTML = `Aprovando como <b>${u.nome}</b> <button id="ap-trocar">trocar</button>`;
    document.body.appendChild(bar);
    bar.querySelector("#ap-trocar").addEventListener("click", () => { clearUser(); location.reload(); });
  } else {
    const bar = document.createElement("div");
    bar.className = "ap-userbar ap-userbar-cta";
    bar.innerHTML = `<button id="ap-identificar">Identificar-se pra aprovar</button>`;
    document.body.appendChild(bar);
    bar.querySelector("#ap-identificar").addEventListener("click", async () => {
      const u = await modalIdentificar();
      if (u) location.reload();
    });
  }
}

init().catch((e) => console.error("[aprovacao]", e));
