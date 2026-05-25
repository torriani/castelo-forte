// Hamburguer pro sub-menu lateral. Aparece no mobile, esconde no desktop.
(function () {
  const sub = document.querySelector("nav.sub-menu");
  if (!sub) return;

  // botão
  const btn = document.createElement("button");
  btn.className = "sub-menu-toggle";
  btn.setAttribute("aria-label", "Abrir menu");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = `<span class="bars"><span></span><span></span><span></span></span>`;
  document.body.appendChild(btn);

  // backdrop
  const backdrop = document.createElement("div");
  backdrop.className = "sub-menu-backdrop";
  document.body.appendChild(backdrop);

  function open() {
    sub.classList.add("open");
    backdrop.classList.add("show");
    btn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function close() {
    sub.classList.remove("open");
    backdrop.classList.remove("show");
    btn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  function toggle() {
    sub.classList.contains("open") ? close() : open();
  }

  btn.addEventListener("click", toggle);
  backdrop.addEventListener("click", close);

  // ESC fecha
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sub.classList.contains("open")) close();
  });

  // clicou num link do menu, fecha
  sub.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => close());
  });

  // se voltar pro desktop, garante fechado
  const mq = window.matchMedia("(max-width: 900px)");
  function onMQ() {
    if (!mq.matches) close();
  }
  if (mq.addEventListener) mq.addEventListener("change", onMQ);
  else mq.addListener(onMQ);
})();
