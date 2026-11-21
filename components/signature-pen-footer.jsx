// Signature Pen Footer — user-provided component, ported from TSX to plain JSX (types stripped).
// GLYPHS trimmed to the letters of "Manideep" (EMS Allure, SIL OFL 1.1). Palette re-tuned for cream/cobalt.

const GLYPHS = {
  "M": [1351, "224 536 302 570 343 605 378 646 406 693 428 699 365 529 287 315 205 148 129 19 63 -41 0 -60 -38 -16 -19 47 95 186 249 356 447 542 570 614 649 633 721 605 756 513 740 315 721 189 687 76 712 82 784 198 961 463 1036 570 1106 621 1156 614 1175 589 1188 539 1150 428 1112 350 1068 255 1046 180 1046 101 1084 22 1181 38 1285 129 1320 183"],
  "a": [526, "495 183 457 132 406 79 331 32 271 19 243 63 255 142 296 274 277 243 176 145 69 57 -19 19 -63 66 -57 154 35 261 148 331 230 356 312 356 324 343"],
  "d": [381, "328 312 302 356 258 369 151 334 47 265 -38 176 -63 107 -57 50 13 16 79 63 176 148 277 252 387 334 532 457 668 592 693 668 690 709 639 721 561 684 510 633 441 523 387 425 293 217 246 66 233 -44 258 -98 302 -113 340 -101"],
  "e": [346, "66 170 148 211 217 249 252 306 239 350 180 356 63 287 16 252 -35 192 -66 139 -72 88 -50 44 32 9 170 44 214 82 277 135 315 183"],
  "i": [249, "-31 183 38 236 60 328 -38 85 -19 22 54 6 132 69 183 129 217 183|123 476 95 438"],
  "n": [580, "148 328 41 25 183 186 271 280 334 318 381 337 394 312 331 195 290 101 293 47 328 16 387 25 450 69 513 132 548 183"],
  "p": [356, "25 359 -72 57 -176 -192 -227 -350 -255 -369 -91 38 -44 13 85 63 208 135 258 227 268 299 227 346 139 321 73 274 16 198 -25 148 -91 32"],
}
const ASCENT = 800
const SPACE = 378
const JOIN = 16
const r1 = (v) => Math.round(v * 10) / 10

const smoothCubics = (pts) => {
  if (pts.length < 2) return []
  const cusp = (i) => {
    if (i <= 0 || i >= pts.length - 1) return true
    const ax = pts[i][0] - pts[i - 1][0], ay = pts[i][1] - pts[i - 1][1]
    const bx = pts[i + 1][0] - pts[i][0], by = pts[i + 1][1] - pts[i][1]
    const m = Math.hypot(ax, ay) * Math.hypot(bx, by)
    return m === 0 || (ax * bx + ay * by) / m < -0.2
  }
  const out = []
  const k = 1 / 6
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i], p2 = pts[i + 1]
    const ci = cusp(i), cj = cusp(i + 1)
    const p0 = ci ? p1 : pts[i - 1]
    const p3 = cj ? p2 : pts[i + 2]
    const c1 = ci ? p1 : [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k]
    const c2 = cj ? p2 : [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k]
    out.push([p1, c1, c2, p2])
  }
  return out
}
const bez = (c, t) => {
  const u = 1 - t, a = u * u * u, b = 3 * u * u * t, d = 3 * u * t * t, e = t * t * t
  return [a * c[0][0] + b * c[1][0] + d * c[2][0] + e * c[3][0], a * c[0][1] + b * c[1][1] + d * c[2][1] + e * c[3][1]]
}
const buildStroke = (pts) => {
  const cubics = smoothCubics(pts)
  let d = "M" + r1(pts[0][0]) + " " + r1(pts[0][1])
  const s = [pts[0][0], pts[0][1]]
  const acc = [0]
  let len = 0
  for (const c of cubics) {
    d += "C" + [c[1], c[2], c[3]].map((p) => r1(p[0]) + " " + r1(p[1])).join(" ")
    const chord = Math.hypot(c[3][0] - c[0][0], c[3][1] - c[0][1])
    const n = Math.max(2, Math.ceil(chord / 8))
    for (let j = 1; j <= n; j++) {
      const p = bez(c, j / n)
      len += Math.hypot(p[0] - s[s.length - 2], p[1] - s[s.length - 1])
      s.push(p[0], p[1])
      acc.push(len)
    }
  }
  return { d, pts: s, acc, len }
}
const parseGlyph = (ch) => {
  if (ch === " ") return { adv: SPACE, strokes: [] }
  const g = GLYPHS[ch]
  if (!g) return null
  const strokes = g[1].split("|").map((part) => {
    const n = part.trim().split(/\s+/).map(Number)
    const out = []
    for (let i = 0; i + 1 < n.length; i += 2) out.push([n[i], ASCENT - n[i + 1]])
    return out
  }).filter((p) => p.length > 1)
  return { adv: g[0], strokes }
}
const plen = (p) => { let l = 0; for (let i = 1; i < p.length; i++) l += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return l }
const layoutWord = (text) => {
  const clean = String(text ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  const runs = [], late = []
  let x = 0
  let prevEnd = null
  for (const ch of clean) {
    const g = parseGlyph(ch) || parseGlyph(" ")
    g.strokes.forEach((raw, si) => {
      const p = raw.map(([a, b]) => [a + x, b])
      const last = runs[runs.length - 1]
      const touches = prevEnd && Math.hypot(p[0][0] - prevEnd[0], p[0][1] - prevEnd[1]) < JOIN
      if (touches && last) { last.push(...p.slice(1)); prevEnd = p[p.length - 1]; return }
      const cy = p.reduce((s, q) => s + q[1], 0) / p.length
      if (si > 0 && plen(p) < 260 && cy < ASCENT - 260) { late.push(p); return }
      runs.push(p)
      prevEnd = p[p.length - 1]
    })
    if (!g.strokes.length) prevEnd = null
    x += g.adv
  }
  const all = [...runs, ...late]
  if (!all.length) return { strokes: [], box: { x: 0, y: 0, w: 0, h: 0 } }
  const strokes = all.map(buildStroke)
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const k of strokes) for (let i = 0; i < k.pts.length; i += 2) {
    x0 = Math.min(x0, k.pts[i]); y0 = Math.min(y0, k.pts[i + 1]); x1 = Math.max(x1, k.pts[i]); y1 = Math.max(y1, k.pts[i + 1])
  }
  return { strokes, box: { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } }
}
const pointAt = (s, l) => {
  const { acc, pts } = s
  if (l <= 0) return [pts[0], pts[1]]
  if (l >= s.len) return [pts[pts.length - 2], pts[pts.length - 1]]
  let lo = 0, hi = acc.length - 1
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (acc[mid] < l) lo = mid; else hi = mid }
  const t = (l - acc[lo]) / (acc[hi] - acc[lo] || 1)
  return [pts[lo * 2] + (pts[hi * 2] - pts[lo * 2]) * t, pts[lo * 2 + 1] + (pts[hi * 2 + 1] - pts[lo * 2 + 1]) * t]
}
const ends = (s) => [[s.pts[0], s.pts[1]], [s.pts[s.pts.length - 2], s.pts[s.pts.length - 1]]]
const planTimeline = (strokes, box, duration = 2.6) => {
  const rest = [box.x + box.w + 70, box.y + box.h * 0.26]
  const start = [rest[0] + 2400, rest[1] - 1500]
  const segs = []
  if (!strokes.length) return { segs, total: 0, writeEnd: 0, rest, start }
  const ink = strokes.reduce((s, k) => s + k.len, 0)
  const speed = ink / Math.max(0.4, Number(duration) || 2.6)
  let t = 0
  let at = start
  const fly = (to, h0, h1, dur, arc) => { segs.push({ kind: "fly", from: at, to, h0, h1, arc, t0: t, t1: t + dur }); t += dur; at = to }
  strokes.forEach((s, i) => {
    const [a, b] = ends(s)
    if (i === 0) fly(a, 4, 0, 0.9, 0)
    else {
      const dist = Math.hypot(a[0] - at[0], a[1] - at[1])
      fly(a, 0, 0, Math.min(0.42, Math.max(0.14, dist / (speed * 1.7))), Math.min(1, 0.08 + dist / 1400))
    }
    const dur = s.len / speed
    segs.push({ kind: "draw", i, t0: t, t1: t + dur })
    t += dur
    at = b
  })
  const writeEnd = t
  fly(rest, 0, 0.55, 0.75, 0.4)
  return { segs, total: t, writeEnd, rest, start }
}
const smooth = (t) => t * t * (3 - 2 * t)
const drawEase = (t) => { const c = Math.min(1, Math.max(0, t)); return c * 0.78 + smooth(c) * 0.22 }
const penAt = (plan, strokes, t) => {
  const ink = strokes.map(() => 0)
  if (!plan.segs.length) return { x: plan.rest[0], y: plan.rest[1], lift: 0.55, ink }
  let state = null
  for (const s of plan.segs) {
    if (s.kind === "draw" && t >= s.t1) ink[s.i] = 1
    if (state || t > s.t1) continue
    const u = Math.min(1, Math.max(0, (t - s.t0) / (s.t1 - s.t0 || 1)))
    if (s.kind === "draw") {
      const p = drawEase(u)
      ink[s.i] = p
      const [x, y] = pointAt(strokes[s.i], p * strokes[s.i].len)
      state = { x, y, lift: 0, ink }
    } else {
      const e = s.h0 > 1 ? 1 - Math.pow(1 - u, 3) : smooth(u)
      state = { x: s.from[0] + (s.to[0] - s.from[0]) * e, y: s.from[1] + (s.to[1] - s.from[1]) * e, lift: s.h0 + (s.h1 - s.h0) * e + Math.sin(Math.PI * u) * s.arc, ink }
    }
  }
  if (state) return state
  return { x: plan.rest[0], y: plan.rest[1], lift: 0.55, ink }
}
const docId = (text) => {
  let h = 2166136261
  for (const c of String(text ?? "")) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0
  const hex = (h >>> 0).toString(16).toUpperCase().padStart(8, "0")
  return hex.slice(0, 4) + "-" + hex.slice(4)
}

const NIB = 26, CONE = 300, RAD = 74, ANGLE = -31

const SPF_CSS =
  ".spf{--spf-bg:#F7EBD5;--spf-fg:#1643AD;--spf-muted:#3E5DAE;--spf-line:rgba(22,67,173,.16);--spf-card:#FBF4E6;--spf-card-line:rgba(22,67,173,.35);--spf-accent:#1643AD;--spf-accent-fg:#F7EBD5;--spf-shade:.22;--spf-pen-hi:#ffffff;--spf-pen-mid:#f6f1e7;--spf-pen-lo:#cfc8b8;--spf-pen-edge:#b2aa98;" +
  "position:relative;isolation:isolate;overflow:hidden;overflow:clip;container-type:inline-size;display:flex;flex-direction:column;width:100%;background:var(--spf-bg);color:var(--spf-fg);font-family:var(--spf-sans);-webkit-font-smoothing:antialiased;}" +
  ":where(.spf) *,:where(.spf) *::before,:where(.spf) *::after{box-sizing:border-box;}" +
  ":where(.spf) a{color:inherit;text-decoration:none;}" +
  ":where(.spf) button{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer;}" +
  ":where(.spf) h2,:where(.spf) p,:where(.spf) ul{margin:0;padding:0;}" +
  ".spf-glow{position:absolute;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(60% 55% at 50% 38%,rgba(255,250,240,.7),transparent 70%);}" +
  ".spf-main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:clamp(40px,7cqw,96px) 20px clamp(36px,5cqw,64px);text-align:center;}" +
  ".spf-stage{position:relative;width:min(100%,calc(clamp(120px,17cqw,200px) * var(--spf-ar)));aspect-ratio:var(--spf-ar);margin-bottom:clamp(10px,2cqw,22px);touch-action:pan-y;}" +
  ".spf-stage[data-live]{cursor:none;}" +
  ".spf-svg{position:absolute;inset:0;display:block;width:100%;height:100%;max-width:none;overflow:visible;}" +
  ".spf-guide{transition:opacity .9s ease;}" +
  ".spf[data-signed] .spf-guide{opacity:0;}" +
  ".spf-scrib{transition:opacity 1.4s ease;}" +
  ".spf-scrib[data-dry]{opacity:0;}" +
  ".spf-again{position:absolute;right:0;bottom:-6px;display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 11px;border-radius:99px;font-size:12px;font-weight:600;letter-spacing:.01em;color:var(--spf-muted);background:var(--spf-card);box-shadow:0 0 0 1px var(--spf-line);opacity:0;transform:translateY(4px);transition:opacity .35s ease,transform .35s ease,color .2s ease;pointer-events:none;cursor:pointer;}" +
  ".spf[data-signed] .spf-stage:hover .spf-again,.spf[data-signed] .spf-again:focus-visible{opacity:1;transform:none;pointer-events:auto;}" +
  ".spf-again:hover{color:var(--spf-fg);}" +
  ".spf-again svg{width:13px;height:13px;max-width:none;transition:transform .5s cubic-bezier(.3,1.4,.5,1);}" +
  ".spf-again:hover svg{transform:rotate(-200deg);}" +
  "@media (hover:none){.spf[data-signed] .spf-again{opacity:.85;transform:none;pointer-events:auto;}}" +
  ".spf-title{font-family:var(--spf-serif);font-size:clamp(28px,3.6cqw,46px);font-weight:500;letter-spacing:-.025em;line-height:1.1;text-wrap:balance;}" +
  ".spf-w{display:inline-block;white-space:pre;}" +
  ".spf-desc{margin-top:14px;max-width:56ch;font-size:clamp(14px,1.3cqw,16px);line-height:1.6;color:var(--spf-muted);text-wrap:pretty;}" +
  ".spf-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:26px;}" +
  ".spf-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 20px;border-radius:2px;font-size:14px;font-weight:600;letter-spacing:.01em;white-space:nowrap;transition:transform .25s cubic-bezier(.3,1.4,.5,1),box-shadow .25s ease,background-color .2s ease,filter .2s ease;}" +
  ".spf-btn-secondary{background:transparent;box-shadow:inset 0 0 0 1px var(--spf-card-line);}" +
  ".spf-btn-secondary:hover{box-shadow:inset 0 0 0 1px var(--spf-fg);transform:translateY(-1px);}" +
  ".spf-btn-primary{background:var(--spf-accent);color:var(--spf-accent-fg);}" +
  ".spf-btn-primary:hover{filter:brightness(1.12);transform:translateY(-1px);}" +
  ".spf-btn:active{transform:translateY(0) scale(.98);}" +
  ".spf-btn:focus-visible,.spf-again:focus-visible,.spf-link:focus-visible{outline:2px solid var(--spf-accent);outline-offset:3px;}" +
  ".spf-bar{display:flex;align-items:center;justify-content:space-between;gap:16px 28px;flex-wrap:wrap;margin:0 clamp(16px,3cqw,40px);padding:20px 0 24px;border-top:1px solid var(--spf-line);font-size:12.5px;color:var(--spf-muted);}" +
  ".spf-brand{display:inline-flex;align-items:center;gap:9px;color:var(--spf-fg);font-family:var(--spf-serif);font-weight:600;font-size:17px;letter-spacing:.04em;}" +
  ".spf-brand svg{width:18px;height:18px;max-width:none;flex:none;}" +
  ".spf-links{display:flex;flex-wrap:wrap;gap:6px 22px;list-style:none;}" +
  ".spf-link{position:relative;padding:2px 0;transition:color .2s ease;}" +
  ".spf-link::after{content:'';position:absolute;left:0;right:0;bottom:-1px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .35s cubic-bezier(.6,0,.2,1);}" +
  ".spf-link:hover{color:var(--spf-fg);}" +
  ".spf-link:hover::after{transform:scaleX(1);transform-origin:left;}" +
  ".spf-meta{display:flex;align-items:center;gap:14px;flex-wrap:wrap;}" +
  ".spf-stamp{display:inline-flex;align-items:center;gap:7px;font-family:'IBM Plex Mono',ui-monospace,Menlo,monospace;font-size:11.5px;letter-spacing:.01em;color:var(--spf-muted);opacity:0;transform:translateY(3px);transition:opacity .8s ease .2s,transform .8s ease .2s;}" +
  ".spf-stamp i{width:6px;height:6px;border-radius:99px;background:var(--spf-ink-to);box-shadow:0 0 0 3px color-mix(in srgb,var(--spf-ink-to) 18%,transparent);}" +
  ".spf[data-signed] .spf-stamp{opacity:1;transform:none;}" +
  ".spf-r{opacity:0;transform:translateY(12px);filter:blur(6px);transition:opacity .9s ease,transform 1.1s cubic-bezier(.2,.75,.15,1),filter .9s ease;transition-delay:calc(var(--i,0) * 70ms);}" +
  ".spf[data-revealed] .spf-r{opacity:1;transform:none;filter:blur(0);}" +
  "@container (max-width: 640px){.spf-line{stroke-width:13px;}.spf-bar{flex-direction:column;align-items:flex-start;}.spf-actions{width:100%;}.spf-btn{flex:1 1 140px;}}" +
  "@media (prefers-reduced-motion: reduce){.spf-r,.spf-stamp,.spf-guide,.spf-again,.spf-btn,.spf-scrib,.spf-link::after{transition:none;}.spf-r{opacity:1;transform:none;filter:none;}}"

const reducedMotion = () => typeof window !== "undefined" && !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
const formatStamp = (word) => {
  let when = ""
  try {
    when = new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date())
  } catch (e) { when = new Date().toDateString() }
  return "Signed " + when + " · ID " + docId(word)
}
const isHashLink = (href) => !href || href === "#"

function SignaturePenFooter({
  word = "Manideep",
  title = "Let's build something meaningful.",
  description = "",
  actions = [],
  brand = "MANIDEEP",
  links = [],
  legal,
  stamp,
  trigger = "view",
  duration = 2.6,
  interactive = true,
  inkFrom = "#7C98E6",
  inkTo = "#1643AD",
  height = "100svh",
  fontSans = '"Hanken Grotesk", ui-sans-serif, system-ui, sans-serif',
  fontSerif = '"Newsreader", Georgia, serif',
  onSigned,
  className = "",
}) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "")
  const layout = React.useMemo(() => layoutWord(word), [word])
  const plan = React.useMemo(() => planTimeline(layout.strokes, layout.box, duration), [layout, duration])
  const { box, strokes } = layout
  const padX = 150, padY = 150
  const vb = { x: box.x - padX, y: box.y - padY, w: Math.max(1, box.w + padX * 2 + 140), h: Math.max(1, box.h + padY * 2) }
  const baseline = ASCENT

  const rootRef = React.useRef(null)
  const stageRef = React.useRef(null)
  const svgRef = React.useRef(null)
  const penRef = React.useRef(null)
  const shadowRef = React.useRef(null)
  const contactRef = React.useRef(null)
  const inkRefs = React.useRef([])
  const bleedRefs = React.useRef([])
  const inkGroupRef = React.useRef(null)
  const scribRef = React.useRef(null)
  const onSignedRef = React.useRef(onSigned)
  onSignedRef.current = onSigned

  const [revealed, setRevealed] = React.useState(false)
  const [signed, setSigned] = React.useState(false)
  const [live, setLive] = React.useState(false)
  const [stampText, setStampText] = React.useState("")
  const [run, setRun] = React.useState(0)

  const sim = React.useRef({ x: plan.start[0], y: plan.start[1], lift: 4, angle: ANGLE, tx: plan.rest[0], ty: plan.rest[1], tl: 0.55, mode: "wait", t0: 0, scroll: 0 })

  const paint = React.useCallback(() => {
    const s = sim.current
    const pen = penRef.current, sh = shadowRef.current, ct = contactRef.current
    if (!pen || !sh || !ct) return
    const lift = Math.max(0, s.lift)
    const sc = 1 + Math.min(lift, 4) * 0.035
    pen.setAttribute("transform", "translate(" + r1(s.x) + " " + r1(s.y) + ") rotate(" + r1(s.angle) + ") scale(" + sc.toFixed(3) + ")")
    const off = lift * 90
    sh.setAttribute("transform", "translate(" + r1(s.x + off * 0.62) + " " + r1(s.y + off * 0.95) + ") rotate(" + r1(s.angle + 44) + ")")
    sh.style.opacity = String(Math.max(0.25, 1 - lift * 0.16))
    ct.setAttribute("transform", "translate(" + r1(s.x + off * 0.5) + " " + r1(s.y + off * 0.8) + ") rotate(" + r1(s.angle + 44) + ")")
    ct.style.opacity = String(Math.max(0, 1 - lift * 2.2))
  }, [])

  const setInk = React.useCallback((ink) => {
    ink.forEach((p, i) => {
      const o = String(r1(1000 * (1 - p)))
      const a = inkRefs.current[i], b = bleedRefs.current[i]
      if (a) a.style.strokeDashoffset = o
      if (b) b.style.strokeDashoffset = o
    })
  }, [])

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const s = sim.current
    s.mode = "wait"; s.x = plan.start[0]; s.y = plan.start[1]; s.lift = 4
    setSigned(false); setLive(false)
    if (reducedMotion() || !strokes.length) {
      s.mode = "rest"; s.x = plan.rest[0]; s.y = plan.rest[1]; s.lift = 0.55
      setInk(strokes.map(() => 1)); paint(); setRevealed(true); setSigned(true); setStampText(formatStamp(word))
      return
    }
    setInk(strokes.map(() => 0))
    paint()
    let raf = 0
    let last = performance.now()
    let doneFired = false, revealFired = false
    let vx = 0
    const finish = () => {
      if (doneFired) return
      doneFired = true
      setSigned(true); setStampText(formatStamp(word))
      onSignedRef.current && onSignedRef.current()
    }
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const px = s.x
      if (s.mode === "write") {
        const t = trigger === "scroll" ? s.scroll * plan.total : (now - s.t0) / 1000
        const st = penAt(plan, strokes, t)
        s.x = st.x; s.y = st.y; s.lift = st.lift
        setInk(st.ink)
        if (!revealFired && t >= plan.writeEnd * 0.72) { revealFired = true; setRevealed(true) }
        if (t >= plan.total) {
          s.mode = "rest"; s.tx = plan.rest[0]; s.ty = plan.rest[1]; s.tl = 0.55
          finish()
          if (interactive) setLive(true)
        }
      } else if (s.mode !== "wait") {
        if (trigger === "scroll" && s.mode === "rest" && s.scroll < 0.999) s.mode = "write"
        const k = 1 - Math.exp(-dt * (s.mode === "rest" ? 6 : 14))
        s.x += (s.tx - s.x) * k
        s.y += (s.ty - s.y) * k
        const breathe = s.mode === "rest" ? Math.sin(now / 900) * 0.07 : 0
        s.lift += (s.tl + breathe - s.lift) * (1 - Math.exp(-dt * 10))
      }
      vx += ((s.x - px) / Math.max(dt, 0.001) - vx) * 0.15
      const lean = Math.max(-6, Math.min(6, vx * 0.0016))
      s.angle += (ANGLE + lean - s.angle) * 0.2
      paint()
      raf = requestAnimationFrame(tick)
    }
    const begin = () => { if (s.mode !== "wait") return; s.mode = "write"; s.t0 = performance.now() }
    let io = null
    const onScroll = () => {
      const r = root.getBoundingClientRect()
      const vh = document.documentElement.clientHeight || 1
      s.scroll = Math.min(1, Math.max(0, (vh - r.top) / Math.max(1, Math.min(r.height, vh) * 0.85)))
      if (s.scroll > 0) begin()
    }
    if (trigger === "scroll") {
      onScroll()
      window.addEventListener("scroll", onScroll, { passive: true, capture: true })
      window.addEventListener("resize", onScroll)
    } else if (typeof IntersectionObserver === "undefined") {
      begin()
    } else {
      io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { begin(); io && io.disconnect() } }, { threshold: 0.35 })
      io.observe(stageRef.current || root)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io && io.disconnect()
      window.removeEventListener("scroll", onScroll, { capture: true })
      window.removeEventListener("resize", onScroll)
    }
  }, [plan, strokes, trigger, interactive, run, word, paint, setInk])

  React.useEffect(() => {
    const stage = stageRef.current, svg = svgRef.current, layer = scribRef.current
    if (!stage || !svg || !layer || !live) return
    const s = sim.current
    let path = null
    let pts = []
    const timers = []
    const toSvg = (e) => {
      const m = svg.getScreenCTM()
      if (!m) return null
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse())
      return [p.x, p.y]
    }
    const usable = (e) => e.pointerType !== "touch"
    const onMove = (e) => {
      if (!usable(e)) return
      const p = toSvg(e)
      if (!p) return
      if (s.mode === "rest") s.mode = "follow"
      if (s.mode !== "follow" && s.mode !== "draw") return
      s.tx = p[0]; s.ty = p[1]
      if (s.mode === "follow") s.tl = 0.7
      if (s.mode === "draw" && path) {
        const lastP = pts[pts.length - 1]
        if (Math.hypot(p[0] - lastP[0], p[1] - lastP[1]) < 6) return
        pts.push(p)
        let d = "M" + r1(pts[0][0]) + " " + r1(pts[0][1])
        for (let i = 1; i < pts.length - 1; i++) {
          const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2
          d += "Q" + r1(pts[i][0]) + " " + r1(pts[i][1]) + " " + r1(mx) + " " + r1(my)
        }
        d += "L" + r1(p[0]) + " " + r1(p[1])
        path.setAttribute("d", d)
      }
    }
    const onDown = (e) => {
      if (!usable(e) || e.button !== 0) return
      if (e.target.closest && e.target.closest("button")) return
      const p = toSvg(e)
      if (!p) return
      e.preventDefault()
      stage.setPointerCapture && stage.setPointerCapture(e.pointerId)
      s.mode = "draw"; s.tx = p[0]; s.ty = p[1]; s.tl = 0
      pts = [p]
      path = document.createElementNS("http://www.w3.org/2000/svg", "path")
      path.setAttribute("class", "spf-scrib")
      path.setAttribute("d", "M" + r1(p[0]) + " " + r1(p[1]) + "l0.1 0")
      layer.appendChild(path)
    }
    const onUp = () => {
      if (s.mode !== "draw") return
      s.mode = "follow"; s.tl = 0.7
      const done = path
      path = null
      if (done) {
        timers.push(window.setTimeout(() => done.setAttribute("data-dry", ""), 1600))
        timers.push(window.setTimeout(() => done.remove(), 3200))
      }
    }
    const onLeave = () => {
      if (s.mode !== "follow") return
      s.mode = "rest"; s.tx = plan.rest[0]; s.ty = plan.rest[1]; s.tl = 0.55
    }
    stage.addEventListener("pointermove", onMove)
    stage.addEventListener("pointerdown", onDown)
    stage.addEventListener("pointerup", onUp)
    stage.addEventListener("pointercancel", onUp)
    stage.addEventListener("pointerleave", onLeave)
    return () => {
      stage.removeEventListener("pointermove", onMove)
      stage.removeEventListener("pointerdown", onDown)
      stage.removeEventListener("pointerup", onUp)
      stage.removeEventListener("pointercancel", onUp)
      stage.removeEventListener("pointerleave", onLeave)
      timers.forEach((id) => clearTimeout(id))
      while (layer.firstChild) layer.removeChild(layer.firstChild)
    }
  }, [live, plan])

  const replay = () => {
    const s = sim.current
    if (s.mode === "write" || s.mode === "wait") return
    s.mode = "rest"; s.tx = plan.start[0]; s.ty = plan.start[1]; s.tl = 4
    const g = inkGroupRef.current
    if (g) g.style.opacity = "0"
    window.setTimeout(() => { if (g) g.style.opacity = ""; setRun((n) => n + 1) }, 520)
  }

  const legalText = legal ?? (brand ? "© " + new Date().getFullYear() + " " + brand : "")
  const stampShown = stamp ?? stampText
  const titleWords = String(title ?? "").split(/(\s+)/).filter(Boolean)
  const vars = { "--spf-ar": String(vb.w / vb.h), "--spf-sans": fontSans, "--spf-serif": fontSerif, "--spf-ink-to": inkTo, minHeight: height }
  const ids = { ink: "spf-ink-" + uid, body: "spf-body-" + uid, nib: "spf-nib-" + uid, spec: "spf-spec-" + uid, fade: "spf-fade-" + uid, blur: "spf-blur-" + uid, blur2: "spf-blur2-" + uid, wet: "spf-wet-" + uid }
  let n = 0

  return (
    <footer ref={rootRef} className={("spf " + className).trim()} data-revealed={revealed ? "" : undefined} data-signed={signed ? "" : undefined} style={vars}>
      <style>{SPF_CSS}</style>
      <div className="spf-glow" aria-hidden="true" />
      <div className="spf-main">
        <div ref={stageRef} className="spf-stage" data-live={live ? "" : undefined}>
          <svg ref={svgRef} className="spf-svg" viewBox={vb.x + " " + vb.y + " " + vb.w + " " + vb.h} role="img" aria-label={"Signature: " + word}>
            <defs>
              <linearGradient id={ids.ink} gradientUnits="userSpaceOnUse" x1={box.x} y1="0" x2={box.x + box.w} y2="0">
                <stop offset="0" stopColor={inkFrom} />
                <stop offset="1" stopColor={inkTo} />
              </linearGradient>
              <linearGradient id={ids.body} gradientUnits="userSpaceOnUse" x1="0" y1={-RAD} x2="0" y2={RAD}>
                <stop offset="0" style={{ stopColor: "var(--spf-pen-lo)" }} />
                <stop offset=".1" style={{ stopColor: "var(--spf-pen-mid)" }} />
                <stop offset=".3" style={{ stopColor: "var(--spf-pen-hi)" }} />
                <stop offset=".55" style={{ stopColor: "var(--spf-pen-mid)" }} />
                <stop offset=".84" style={{ stopColor: "var(--spf-pen-lo)" }} />
                <stop offset="1" style={{ stopColor: "var(--spf-pen-edge)" }} />
              </linearGradient>
              <linearGradient id={ids.nib} gradientUnits="userSpaceOnUse" x1="0" y1="-9" x2="0" y2="9">
                <stop offset="0" stopColor="#9a9a98" />
                <stop offset=".35" stopColor="#d9d9d6" />
                <stop offset="1" stopColor="#6d6d6b" />
              </linearGradient>
              <linearGradient id={ids.spec} gradientUnits="userSpaceOnUse" x1={CONE} y1="0" x2={CONE + 2600} y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset=".08" stopColor="#fff" stopOpacity=".95" />
                <stop offset="1" stopColor="#fff" stopOpacity=".6" />
              </linearGradient>
              <linearGradient id={ids.fade} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="2600" y2="0">
                <stop offset="0" style={{ stopColor: "#1b2a55", stopOpacity: "var(--spf-shade)" }} />
                <stop offset=".35" style={{ stopColor: "#1b2a55", stopOpacity: "calc(var(--spf-shade) * .55)" }} />
                <stop offset="1" stopColor="#1b2a55" stopOpacity="0" />
              </linearGradient>
              <filter id={ids.blur} x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="34" /></filter>
              <filter id={ids.blur2} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="9" /></filter>
              <filter id={ids.wet} x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="2.2" /></filter>
            </defs>
            <g className="spf-guide" aria-hidden="true" opacity=".55">
              <line x1={box.x - 40} y1={baseline + 50} x2={box.x + box.w + 40} y2={baseline + 50} style={{ stroke: "var(--spf-muted)" }} strokeOpacity=".45" strokeWidth="3" strokeDasharray="2 16" strokeLinecap="round" />
              <path d={"M" + (box.x - 30) + " " + (baseline - 20) + "l44 44m0 -44l-44 44"} style={{ stroke: "var(--spf-muted)" }} strokeOpacity=".7" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
            <g ref={inkGroupRef} className="spf-inkg" style={{ transition: "opacity .45s ease" }} fill="none" strokeLinecap="round" strokeLinejoin="round">
              <g filter={"url(#" + ids.wet + ")"} opacity=".2" stroke={"url(#" + ids.ink + ")"} strokeWidth="18">
                {strokes.map((s, i) => <path key={"b" + i} ref={(el) => { bleedRefs.current[i] = el }} d={s.d} pathLength={1000} strokeDasharray="1000 1000" strokeDashoffset="1000" />)}
              </g>
              <g className="spf-line" stroke={"url(#" + ids.ink + ")"} strokeWidth="9">
                {strokes.map((s, i) => <path key={i} ref={(el) => { inkRefs.current[i] = el }} d={s.d} pathLength={1000} strokeDasharray="1000 1000" strokeDashoffset="1000" />)}
              </g>
            </g>
            <g ref={scribRef} className="spf-inkg spf-line" fill="none" stroke={"url(#" + ids.ink + ")"} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            <g aria-hidden="true" pointerEvents="none">
              <g ref={shadowRef}><path d={"M0 0L2600 " + -RAD * 1.6 + "L2600 " + RAD * 3.2 + "Z"} fill={"url(#" + ids.fade + ")"} filter={"url(#" + ids.blur + ")"} /></g>
              <g ref={contactRef}><ellipse cx="70" cy="6" rx="80" ry="16" style={{ fill: "#1b2a55", fillOpacity: "calc(var(--spf-shade) * 1.1)" }} filter={"url(#" + ids.blur2 + ")"} /></g>
              <g ref={penRef}>
                <rect x={CONE - 2} y={-RAD} width="9000" height={RAD * 2} fill={"url(#" + ids.body + ")"} />
                <rect x={CONE} y={-RAD * 0.62} width="9000" height={RAD * 0.16} rx={RAD * 0.08} fill={"url(#" + ids.spec + ")"} opacity=".9" />
                <path d={"M" + NIB + " " + -9 + "C" + CONE * 0.45 + " " + -RAD * 0.62 + " " + CONE * 0.78 + " " + -RAD * 0.98 + " " + CONE + " " + -RAD + "L" + CONE + " " + RAD + "C" + CONE * 0.78 + " " + RAD * 0.98 + " " + CONE * 0.45 + " " + RAD * 0.62 + " " + NIB + " 9Z"} fill={"url(#" + ids.body + ")"} />
                <path d={"M" + (NIB + 30) + " " + -14 + "C" + CONE * 0.5 + " " + -RAD * 0.5 + " " + CONE * 0.8 + " " + -RAD * 0.6 + " " + CONE + " " + -RAD * 0.62} stroke="#fff" strokeOpacity=".9" strokeWidth={RAD * 0.12} strokeLinecap="round" fill="none" />
                <line x1={CONE} y1={-RAD} x2={CONE} y2={RAD} style={{ stroke: "var(--spf-pen-lo)" }} strokeWidth="3" strokeOpacity=".7" />
                <path d={"M0 0Q2 -5 " + NIB + " -9L" + NIB + " 9Q2 5 0 0Z"} fill={"url(#" + ids.nib + ")"} />
              </g>
            </g>
          </svg>
          <button type="button" className="spf-again" onClick={replay} aria-label="Sign again">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 8a5.5 5.5 0 1 0 1.7-4" /><path d="M2.2 1.8v2.6h2.6" /></svg>
            Sign again
          </button>
        </div>
        {title ? (
          <h2 className="spf-title">
            {titleWords.map((w, i) => /^\s+$/.test(w) ? w : <span key={i} className="spf-w spf-r" style={{ "--i": n++ }}>{w}</span>)}
          </h2>
        ) : null}
        {description ? <p className="spf-desc spf-r" style={{ "--i": n + 2 }}>{description}</p> : null}
        {actions.length ? (
          <div className="spf-actions">
            {actions.map((a, i) => (
              <a key={a.label + i} href={a.href ?? "#"} className={"spf-btn spf-r spf-btn-" + (a.variant ?? (i === actions.length - 1 ? "primary" : "secondary"))} style={{ "--i": n + 3 + i }}
                onClick={(e) => { if (isHashLink(a.href)) e.preventDefault(); a.onClick && a.onClick() }}>{a.label}</a>
            ))}
          </div>
        ) : null}
      </div>
      <div className="spf-bar spf-r" style={{ "--i": n + 6 }}>
        {brand ? (
          <span className="spf-brand">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0 L11.6 8.4 L20 10 L11.6 11.6 L10 20 L8.4 11.6 L0 10 L8.4 8.4 Z" fill={inkTo} /></svg>
            {brand}
          </span>
        ) : null}
        {links.length ? (
          <nav aria-label="Footer">
            <ul className="spf-links">
              {links.map((l, i) => (
                <li key={l.label + i}><a className="spf-link" href={l.href ?? "#"} onClick={(e) => { if (isHashLink(l.href)) e.preventDefault() }}>{l.label}</a></li>
              ))}
            </ul>
          </nav>
        ) : null}
        <div className="spf-meta">
          {stampShown ? <span className="spf-stamp" role="status"><i aria-hidden="true" />{stampShown}</span> : null}
          {legalText ? <span>{legalText}</span> : null}
        </div>
      </div>
    </footer>
  )
}

module.exports = { SignaturePenFooter }
