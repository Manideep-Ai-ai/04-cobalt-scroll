/**
 * Cobalt's own opening and ending (needs pen-draw.js loaded first). No cards: every drawing is
 * inked straight onto the page's own colour.
 *   opening — "welcome" in cream ink on the hero's deep cobalt, then it dissolves into the hero
 *   story   — the bird-in-arch drawing beside "Once upon a time", with the real timeline
 *   ending  — "thank you" in cobalt ink on the cream page, contact actions, links, landscape strip
 * The export is a bundled page that rebuilds the document after load, so nodes are (re)attached
 * once #dc-root has rendered, and anything hidden is hidden with inline styles.
 */
(() => {
  const WAIT_MS = 10000;
  const HOLD_MS = 1100;       // pause on the finished word before dissolving
  const FADE_MS = 1100;
  const SEEN_KEY = "cobalt-welcome-seen";
  const SMALL = matchMedia("(max-width: 640px)").matches; // thinner pen on phones
  const OLD_FOOTER = ".spf";
  const INK = "#1643AD", DEEP = "#0E2F80", CREAM = "#F7EBD5";
  const EMAIL = "manideepreddyrekha@gmail.com";
  const LINKS = [
    { label: "GitHub", href: "https://github.com/Manideep-Ai-ai" },
    { label: "LinkedIn", href: "https://linkedin.com/in/rekha-v-manideep-reddy-024976297" },
    { label: "Email", href: `mailto:${EMAIL}` },
    { label: "WhatsApp", href: "https://wa.me/918686669066" },
    { label: "Website", href: "https://manideepreddy.website" },
  ];
  const TIMELINE = [
    { when: "2024", what: "AI intern at Infosys — taught a model to read emotion from faces." },
    { when: "2025", what: "B.Tech in Computer Science, Bharath Institute, Chennai." },
    { when: "Apr 2025 →", what: "Software Engineer at Delta Cubes — recruitment and geolocation platforms in production." },
    { when: "2026", what: "Artemis — an open-source AI agent that job-hunts and follows up for you." },
  ];

  const CSS = `
    /* the export pins #dc-root to the viewport height; let it grow so the ending sits after the content */
    #dc-root { height: auto !important; min-height: 100%; }
    .cb-mono { font: 400 12px/1.4 'IBM Plex Mono', monospace; letter-spacing: .16em; text-transform: uppercase; }

    /* opening: the hero's own night-cobalt, cream ink */
    #cb-welcome { position: fixed; inset: 0; z-index: 10001; cursor: pointer; display: grid; place-content: center; justify-items: center; gap: 28px; padding: 0 20px;
      background: radial-gradient(60% 55% at 50% 48%, #1B4CBF 0%, ${INK} 45%, ${DEEP} 100%); color: ${CREAM}; }
    #cb-welcome pen-draw { width: min(1040px, calc(100vw - 40px)); }
    #cb-welcome .meta { text-align: center; opacity: 0; transition: opacity .6s ease; }
    #cb-welcome.done .meta { opacity: .8; }
    #cb-welcome .skip { position: fixed; right: 32px; bottom: 30px; color: ${CREAM}; background: none; border: 1px solid rgba(247,235,213,.35); border-radius: 999px; padding: 10px 14px; cursor: pointer; }
    #cb-welcome .skip:focus-visible, #cb-story a:focus-visible, #cb-end a:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }

    /* story band */
    #cb-story { background: ${CREAM}; color: ${DEEP}; padding: clamp(72px, 10vw, 140px) clamp(20px, 6vw, 96px); font-family: 'Hanken Grotesk', system-ui, sans-serif; }
    #cb-story .inner { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: minmax(180px, 330px) 1fr; gap: clamp(40px, 7vw, 110px); align-items: center; }
    #cb-story .arch { width: 100%; }
    #cb-story .kicker { color: ${INK}; margin: 0 0 18px; }
    #cb-story .once { width: min(440px, 100%); margin: 0 0 8px -6px; }
    #cb-story .lede { margin: 0 0 28px; max-width: 46ch; font: 400 clamp(20px, 2.1vw, 26px)/1.45 'Newsreader', Georgia, serif; color: ${DEEP}; }
    #cb-story ol { list-style: none; margin: 0; padding: 0; border-top: 1px solid rgba(22,67,173,.2); }
    #cb-story li { display: grid; grid-template-columns: 120px 1fr; gap: 20px; padding: 16px 0; border-bottom: 1px solid rgba(22,67,173,.2); font-size: 16px; line-height: 1.5; color: #2B3F73; }
    #cb-story li b { font: 500 12px/1.9 'IBM Plex Mono', monospace; letter-spacing: .12em; color: ${INK}; }
    .cb-rise { opacity: 0; transform: translateY(14px); transition: opacity .8s ease, transform .8s ease; }
    .is-written .cb-rise { opacity: 1; transform: none; }
    .is-written .cb-rise:nth-child(2) { transition-delay: .08s; } .is-written .cb-rise:nth-child(3) { transition-delay: .16s; } .is-written .cb-rise:nth-child(4) { transition-delay: .24s; }

    /* ending: cobalt ink on the cream page */
    #cb-end { background: ${CREAM}; color: ${DEEP}; font-family: 'Hanken Grotesk', system-ui, sans-serif; }
    #cb-end .main { min-height: 78vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; gap: 22px; padding: clamp(48px, 8vw, 96px) clamp(20px, 5vw, 64px) 0; }
    #cb-end .main > * { margin: 0; max-width: 100%; }
    #cb-end pen-draw { width: 100%; max-width: 1180px; margin-bottom: 4px; }
    #cb-end h2 { font: 500 clamp(30px, 4.4vw, 56px)/1.08 'Newsreader', Georgia, serif; letter-spacing: -.01em; color: ${DEEP}; }
    #cb-end .main > p { max-width: 52ch; color: #3A4E80; font-size: 16px; line-height: 1.6; }
    #cb-end .actions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 6px; }
    #cb-end .btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 22px; border-radius: 999px; font: 600 15px/1 'Hanken Grotesk', sans-serif; text-decoration: none; transition: transform .2s ease, background-color .2s ease; }
    #cb-end .btn:hover { transform: translateY(-1px); }
    #cb-end .btn.primary { background: ${INK}; color: ${CREAM}; }
    #cb-end .btn.primary:hover { background: ${DEEP}; }
    #cb-end .btn.secondary { color: ${INK}; box-shadow: inset 0 0 0 1px rgba(22,67,173,.4); }
    #cb-end .btn.secondary:hover { background: rgba(22,67,173,.07); }
    #cb-end .bar { display: flex; flex-wrap: wrap; gap: 16px 28px; align-items: center; justify-content: space-between; margin: clamp(56px, 8vw, 96px) clamp(20px, 5vw, 64px) 0; padding: 22px 0; border-top: 1px solid rgba(22,67,173,.2); color: ${INK}; }
    #cb-end .bar nav { display: flex; flex-wrap: wrap; gap: 8px 22px; }
    #cb-end .bar a { color: ${INK}; text-decoration: none; }
    #cb-end .bar a:hover { text-decoration: underline; }
    #cb-end .brand { font: 600 15px/1 'Newsreader', serif; letter-spacing: .16em; color: ${DEEP}; }
    /* the image's upper half has a template footer baked in, so only its bottom third (the rider) is ever shown */
    #cb-end .strip { aspect-ratio: 4.8; background: url("images/home-landscape.png") 50% 100% / cover; }

    @media (max-width: 760px) {
      #cb-story .inner { grid-template-columns: 1fr; }
      #cb-story .arch { width: min(220px, 60%); margin: 0 auto; }
      #cb-story li { grid-template-columns: 1fr; gap: 2px; }
      #cb-story .once { width: min(300px, 80%); }
    }
    @media (max-width: 640px) {
      #cb-end .strip { aspect-ratio: auto; height: 150px; background-size: 210% auto; }
      #cb-welcome .skip { right: 20px; bottom: 20px; }
      #cb-end .bar { justify-content: center; text-align: center; }
    }
    @media (prefers-reduced-motion: reduce) { .cb-rise { transition: none; } }
  `;

  const el = (tag, attrs = {}, text) => {
    const n = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    if (text != null) n.textContent = text;
    return n;
  };
  const pen = (name, color, px, extra = {}) => el("pen-draw", { name, color, "stroke-px": String(px), ...extra });

  const seen = () => { try { return sessionStorage.getItem(SEEN_KEY) === "1"; } catch { return false; } };
  const markSeen = () => { try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* private mode: show again next time */ } };

  function addStyles() {
    const s = el("style", { id: "cb-components-css" });
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
    return s;
  }

  // ─── Opening ───
  function welcome() {
    if (seen() || matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
    const overlay = el("div", { id: "cb-welcome", "aria-label": "Welcome", role: "presentation" });
    const word = pen("welcome", CREAM, SMALL ? 3 : 4.5, { duration: "2800", delay: "300" });
    overlay.append(word, el("p", { class: "meta cb-mono" }, "Manideep · AI & Full-Stack"), el("button", { class: "skip cb-mono", type: "button" }, "Skip intro"));

    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    let gone = false;
    const dissolve = () => {
      if (gone) return;
      gone = true;
      markSeen();
      root.style.overflow = prevOverflow;
      word.animate([{ transform: "scale(1)" }, { transform: "scale(1.04)" }], { duration: FADE_MS, easing: "ease-out", fill: "forwards" });
      overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FADE_MS, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" })
        .finished.catch(() => {}).then(() => overlay.remove());
    };
    word.addEventListener("pen-draw-done", () => { overlay.classList.add("done"); setTimeout(dissolve, HOLD_MS); }, { once: true });
    overlay.addEventListener("click", dissolve);
    const onKey = e => { if (["Escape", "Enter", " "].includes(e.key)) { removeEventListener("keydown", onKey); dissolve(); } };
    addEventListener("keydown", onKey);
    setTimeout(dissolve, 7500); // never trap the visitor if anything stalls
    return { node: overlay, done: () => gone };
  }

  // reveal a block's text once its main drawing has finished writing
  const writeThenRise = (block, drawing) => drawing.addEventListener("pen-draw-done", () => block.classList.add("is-written"), { once: true });

  // ─── Story ───
  function story() {
    const wrap = el("section", { id: "cb-story", "aria-labelledby": "cb-story-title" });
    const inner = el("div", { class: "inner" });
    const arch = pen("arch-bird", INK, SMALL ? 1.6 : 2.2, { class: "arch", duration: "5200", "trigger-on-view": "", "no-tip": "" });
    const text = el("div");
    const once = pen("once-upon", INK, SMALL ? 2 : 2.6, { class: "once", duration: "3000", delay: "400", "trigger-on-view": "" });
    const title = el("h2", { id: "cb-story-title", class: "kicker cb-mono" }, "The story so far");
    const lede = el("p", { class: "lede cb-rise" }, "I was a computer-science student in Chennai, teaching machines to read faces and voices. Now I build AI products end to end — from the database schema to the agent that ships.");
    const list = el("ol", { class: "cb-rise" });
    TIMELINE.forEach(t => { const li = el("li"); li.append(el("b", {}, t.when), el("span", {}, t.what)); list.appendChild(li); });
    text.append(title, once, lede, list);
    inner.append(arch, text);
    wrap.appendChild(inner);
    writeThenRise(text, once);
    return wrap;
  }

  // ─── Ending ───
  function ending() {
    const wrap = el("footer", { id: "cb-end" });
    const main = el("div", { class: "main" });
    const thanks = pen("thank-you", INK, SMALL ? 2 : 3, { duration: "3200", "trigger-on-view": "" });
    const actions = el("div", { class: "actions cb-rise" });
    const top = el("a", { class: "btn secondary", href: "#" }, "Back to the start ↑");
    top.addEventListener("click", e => { e.preventDefault(); scrollTo({ top: 0, behavior: "smooth" }); });
    actions.append(top, el("a", { class: "btn primary", href: `mailto:${EMAIL}` }, "Get in touch →"));
    main.append(
      thanks,
      el("h2", { class: "cb-rise" }, "Let's build something meaningful."),
      el("p", { class: "cb-rise" }, "AI Engineer & Full-Stack Developer — Python, FastAPI, React, LLMs, RAG and AI agents. Open to full-time roles, freelance work and collaborations."),
      actions,
    );
    const bar = el("div", { class: "bar cb-mono" });
    const nav = el("nav", { "aria-label": "Elsewhere" });
    LINKS.forEach(l => {
      const a = el("a", { href: l.href }, l.label);
      if (!l.href.startsWith("mailto:")) { a.target = "_blank"; a.rel = "noopener"; }
      nav.appendChild(a);
    });
    bar.append(el("span", { class: "brand" }, "✦ MANIDEEP"), nav, el("span", {}, `© ${new Date().getFullYear()} · Hyderabad, India`));
    wrap.append(main, bar, el("div", { class: "strip", "aria-hidden": "true" }));
    writeThenRise(main, thanks);
    return wrap;
  }

  // hide the export's own footer + its landscape strip (ours replaces both)
  function hideOldFooter() {
    const old = document.querySelector(OLD_FOOTER);
    if (!old) return false;
    old.style.display = "none";
    old.closest(".sc-host-x")?.parentElement?.querySelectorAll(":scope > [aria-hidden='true']").forEach(n => { n.style.display = "none"; });
    return true;
  }

  let style = addStyles();
  const intro = welcome();
  const tail = [story(), ending()];
  const attachTail = () => tail.forEach(n => { if (!n.isConnected) document.body.appendChild(n); });
  const t0 = Date.now();
  // Keep our nodes attached while the bundle rebuilds the document, until it has settled.
  (function keep() {
    if (!style.isConnected) style = addStyles();
    if (intro && !intro.done() && !intro.node.isConnected && document.body) document.body.appendChild(intro.node);
    const root = document.getElementById("dc-root");
    const ready = root && root.childElementCount > 0 && hideOldFooter();
    if (ready) attachTail();
    if (Date.now() - t0 < WAIT_MS || (intro && !intro.done())) requestAnimationFrame(keep);
    else if (!ready) { console.warn("[cobalt] page did not render its footer in time; new ending added anyway"); attachTail(); }
  })();
})();
