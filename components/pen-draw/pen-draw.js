/**
 * <pen-draw> — a single-line handwriting drawn stroke by stroke, like a pen on paper.
 *
 *   <script src="components/pen-draw/pen-draw.js"></script>
 *   <pen-draw name="welcome" color="#1643AD" stroke="6" duration="2600"></pen-draw>
 *   <pen-draw name="thank-you" trigger-on-view></pen-draw>
 *
 * Drawings: "welcome", "thank-you", "once-upon" (Once upon a time), "arch-bird" (bird & leaves in an arch)
 * — stroke data from the user's Framer line-draw page.
 * Each path is revealed with stroke-dashoffset over pathLength=1; paths draw one after another,
 * each getting time in proportion to its real length, so the pen moves at an even, natural speed.
 * A soft ink dot rides the pen tip. Fires "pen-draw-done". Reduced motion: drawn instantly.
 *
 * Attributes: name, color (default currentColor), stroke (px in drawing units, default 6),
 *   (stroke default: the drawing's own width) stroke-px (on-screen line width in px, kept constant at any size; overrides stroke),
 *   duration (ms, default 2600), delay (ms, default 0), trigger-on-view (boolean), no-tip (boolean).
 */
(() => {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const DRAWINGS = {
    "welcome": {
      viewBox: "61 -6 972 154",
      stroke: 6,
      paths: [
        { x: 67, y: 0, d: "M 0 103 L 0 103 C 0 103 35.186 87.806 65.5 75 C 86.012 66.335 124.674 50.267 163.5 38.5 C 221.569 18.25 307.609 -3.842 314.5 10.244 C 321.391 24.33 254.478 92.467 245.5 108.967 C 236.522 125.467 232.19 136.606 238.5 140.967 C 244.729 145.272 258.055 139.952 277 125 C 295.281 111.696 314.5 91.467 314.5 91.467 C 314.5 91.467 292.577 129.023 304.5 131.967 C 316.423 134.911 352.957 98.771 365 80.467 C 377.043 62.162 363.42 67.58 360 71 C 356.58 74.42 338.067 105.277 358 113.467 C 377.933 121.656 419 87 419 87 C 419 87 421.246 85.256 422 82.5 C 422.531 79.891 422.688 77.641 420.5 75 C 416.672 71.172 410.777 72.69 407.5 75.967 C 404.223 79.244 373.567 108.481 389 120.467 C 404.433 132.452 467.595 85.871 479.5 73.967 C 491.405 62.062 549.889 9.922 542.5 2.497 C 535.111 -4.928 520.423 6.421 517.5 7.967 C 481.153 32.17 432.203 104.873 460 121.443 C 487.797 138.012 541.5 85.5 541.5 85.5 C 541.5 85.5 551.811 76.311 549 73.5 C 546.189 70.689 533.562 74.769 526.5 86.5 C 519.438 98.231 514.367 115.328 522.5 119.5 C 530.633 123.672 551.689 104.483 557.5 100 C 563.311 95.517 581 81.5 581 81.5 C 581 81.5 561.806 105.043 569.5 111.5 C 577.194 117.957 590.13 104.194 592.5 101.5 C 594.87 98.806 610.415 83.244 603.5 71 C 596.585 58.756 583 66.025 583 76 C 583 85.975 591.032 92.534 607.5 90 C 623.968 87.466 641.375 81.225 653 67 C 664.625 52.775 637.438 82.271 630 95 C 622.562 107.729 620.344 119.344 621.5 120.5 C 622.656 121.656 625.021 121.564 639 103 C 652.979 84.436 683.663 59.926 693.5 65.5 C 703.337 71.074 664.356 120.144 661.5 123 C 658.644 125.856 681.812 100.223 691 93.5 C 700.188 86.777 712.488 79.595 718 83.5 C 723.512 87.405 702.411 112.765 711.5 118 C 720.589 123.235 738.193 115.146 757 101.5 C 775.807 87.854 792.272 72.737 781.5 70.5 C 770.728 68.263 739.39 90.609 745.5 117.5 C 751.61 144.391 814.129 113.066 855 96.5 C 895.871 79.934 927.618 68.59 960.5 65" }
      ],
    },
    "thank-you": {
      viewBox: "-6 -6 2427 546",
      stroke: 6,
      paths: [
        { x: 0, y: 0, d: "M 0 297.397 C 0 297.397 208.165 386.141 404.715 318.525 C 601.265 250.909 666.36 74.112 666.36 74.112 C 666.36 74.112 599.035 89.214 552.477 188.102 C 505.918 286.989 499.942 316.108 523.289 333.102 C 546.637 350.095 622.257 297.63 779.2 162.539 C 857.672 94.993 923.952 18.969 907.938 5.253 C 888.043 -14.66 833.022 54.333 757.31 141.41 C 681.598 228.487 617.627 324.003 617.627 324.003 C 617.627 324.003 682.412 261.917 698.153 249.922 C 713.895 237.928 726.427 229.674 732.553 235.806 C 738.678 241.937 709.59 274.581 726.819 282.789 C 744.049 290.997 766.008 280.684 797.443 268.673 C 828.877 256.661 874.193 226.691 886.047 232.154 C 897.902 237.617 808.534 257.09 813.86 275.976 C 819.187 294.862 847.944 283.584 862.072 271.542 C 876.2 259.499 919.926 226.968 919.926 226.968 C 919.926 226.968 874.096 280.675 913.15 288.497 C 952.204 296.319 1056.038 206.513 1056.22 206.33 C 1056.403 206.147 1004.159 249.774 991.07 279.367 C 977.981 308.96 1031.216 257.52 1056.22 240.01 C 1081.225 222.5 1102.329 219.456 1097.396 240.01 C 1092.462 260.565 1082.29 281.454 1105.214 281.454 C 1128.137 281.454 1193.427 248.988 1307.702 149.496 C 1421.976 50.004 1444.064 -2.337 1417.154 0.08 C 1390.245 2.498 1270.559 132.31 1233.691 181.581 C 1196.822 230.851 1108.341 361.981 1108.341 361.981 C 1108.341 361.981 1175.225 275.407 1201.636 254.773 C 1228.048 234.139 1257.95 219.061 1265.745 226.863 C 1273.539 234.665 1240.042 279.48 1199.03 261.555 C 1199.226 261.36 1202.806 299.358 1233.691 301.204 C 1264.575 303.051 1319.351 284.413 1402.3 249.817 C 1485.249 215.222 1595.996 202.972 1603.485 217.733 C 1610.973 232.494 1538.431 280.101 1559.183 297.291 C 1579.934 314.482 1655.081 220.86 1669.938 235.731 C 1684.796 250.603 1593.966 369.968 1526.347 429.019 C 1458.727 488.07 1388.978 556.524 1364.252 526.837 C 1339.526 497.149 1489.276 401.835 1564.916 359.112 C 1640.556 316.39 1744.662 255.784 1762.452 245.383 C 1762.374 245.462 1742.13 252.346 1725.447 270.163 C 1718.382 277.235 1711.658 294.909 1722.32 301.204 C 1749.843 315.743 1760.628 248.513 1760.628 248.513 C 1760.628 248.513 1774.451 260.321 1811.967 262.86 C 1849.483 265.399 1877.899 239.905 1877.899 239.905 C 1877.899 239.905 1834.133 279.449 1844.803 288.423 C 1855.472 297.397 1933.668 232.08 1933.668 232.08 C 1933.668 232.08 1880.148 274.468 1910.474 292.074 C 1940.801 309.681 2035.418 256.518 2069.442 243.035 C 2103.465 229.552 2307.509 151.156 2415 209.647 " },
        { x: 462, y: 133, d: "M 0 67.038 C 0 67.038 3.384 19.473 41.436 12.26 C 79.487 5.047 224.418 53.344 268.16 0" },
        { x: 1097, y: 37, d: "M 49.178 113.895 C 49.178 113.895 -22.088 36.447 6.961 19.207 C 36.01 1.968 41.696 60.421 41.696 60.421 C 41.696 60.421 68.04 -14.526 94.859 2.523 C 121.679 19.572 49.254 106.338 49.254 106.338" }
      ],
    },
    "once-upon": {
      viewBox: "258 13 511 427",
      stroke: 6,
      paths: [
        { x: 280, y: 19, d: "M 50.782 62.5 C 50.782 62.5 -33.908 125.966 15.45 166.804 C 64.808 207.643 206.384 33.218 134.151 5.409 C 61.917 -22.4 -4.885 63.609 28.151 113.428 C 61.187 163.247 144.26 128.075 179.529 85.256 C 214.799 42.437 135.103 121.386 140.029 140.756 C 144.956 160.125 198.211 80.83 215.029 87.756 C 231.847 94.682 195.684 131.411 207.029 142.756 C 218.374 154.101 266.539 123.746 291.029 99.256 C 315.519 74.766 286.364 86.632 273.529 103.756 C 260.694 120.879 226.319 193.459 342.029 119.756 C 422.378 91.682 375.601 82.029 359.029 94.756 C 342.458 107.483 328.876 136.435 354.529 144.256 C 380.183 152.076 407.282 137.86 431.886 113.256" },
        { x: 292, y: 201, d: "M 24.326 12.814 C 24.326 12.814 -10.732 49.618 3.326 59.314 C 17.384 69.01 30.06 60.09 61.5 20.24 C 92.94 -19.609 31.884 58.654 53.5 64.24 C 75.116 69.827 114.307 36.705 126 25.012 C 137.693 13.319 82.933 100.025 75 119.512 C 67.067 138.999 149.78 -11.516 180.5 4.24 C 211.22 19.997 142.437 82.653 134 67.012 C 125.563 51.371 161.47 42.974 172 40.512 C 182.53 38.049 236.241 18.64 236 18.74 C 235.759 18.841 203.313 55.348 223 67.24 C 242.687 79.133 278.821 20.795 261 9.512 C 243.179 -1.771 223.36 38.537 245 50.012 C 266.64 61.486 301.452 43.868 325 9.871 C 348.548 -24.125 300.165 38.571 293.5 64.012 C 286.835 89.453 351.348 -2.344 367.5 9.24 C 383.652 20.825 343.95 52.796 358.5 61.74 C 373.05 70.684 410.643 47.148 426 25.24" },
        { x: 264, y: 340, d: "M 61.823 22 C 61.823 22 63.845 12.215 59.823 5.849 C 56.006 -0.192 46.024 -3.605 32.322 6.03 C -11.089 37.795 -0.469 54.498 6.201 57.276 C 12.871 60.054 32.165 57.526 64.51 19.094 C 96.856 -19.338 39.499 39.977 60.01 52.4 C 80.522 64.824 139.307 13.276 139.307 13.276" },
        { x: 396, y: 278, d: "M 97.5 0 C 97.5 0 62.906 44.002 39.5 80.5 C 16.094 116.998 0 156 0 156" },
        { x: 401, y: 308, d: "M 0 14.491 C 0 14.491 79.594 -3.132 133 0.491" },
        { x: 453, y: 345, d: "M 24.015 4.734 C 24.015 4.734 -13.853 48.644 5.515 60.234 C 24.882 71.824 70.947 40.359 92 8.829 C 113.053 -22.701 66.898 38.506 61 62.734 C 55.102 86.962 114.767 -2.912 129 6.571 C 143.233 16.055 108.623 52.954 114.5 57.071 C 120.377 61.189 156.152 12.137 169.5 16.571 C 182.848 21.006 153.806 56.276 164 61.071 C 174.194 65.867 279.553 24.268 263.5 10.571 C 247.447 -3.125 202.644 39.425 219.5 54.571 C 236.356 69.718 293.815 43.823 310.5 23.571" },
        { x: 483, y: 329, d: "M 6 0 L 0 9" }
      ],
    },
    "arch-bird": {
      viewBox: "-11 634 631 784",
      stroke: 11,
      paths: [
        { x: 0, y: 645, d: "M 0 762 L 609 762 L 609 284 C 609 284 601.344 0 304.5 0 C 7.656 0 9.5 295 9.5 295 Z" },
        { x: 9, y: 777, d: "M 0 626.297 C 0 626.297 138.166 581.718 176.5 465.317 C 214.834 348.916 191.23 347.948 227.5 269.317 C 263.77 190.686 328.774 176.725 341.5 116.317 C 354.226 55.909 349.639 20.079 390 4.778 C 430.361 -10.523 453 15.817 453 15.817 L 510 4.797 L 453 61.797 C 453 61.797 429.63 81.26 439 103.297 C 448.37 125.333 478.572 212.725 422 269.297 C 365.428 325.868 259.66 314.318 236.5 354.297 C 213.34 394.276 247.045 569.142 154.5 626.297" },
        { x: 411, y: 808, d: "M 8 0 C 12.418 0 16 3.358 16 7.5 C 16 11.642 12.418 15 8 15 C 3.582 15 0 11.642 0 7.5 C 0 3.358 3.582 0 8 0 Z" },
        { x: 54, y: 825, d: "M 177.334 168.693 C 177.334 168.693 191.61 37.049 114.18 9.47 C 36.749 -18.109 6.685 20.347 1.088 50.779 C -4.509 81.212 9.997 136.775 79.751 141.216 C 160.082 141.216 177.334 168.693 177.334 168.693 Z" },
        { x: 281, y: 972, d: "M 285 0 C 285 0 303.244 54.756 233 125 C 162.756 195.244 127.756 193.587 96 236 C 64.244 278.413 77.17 308.271 71.5 366.5 C 65.83 424.729 0 435.5 0 435.5" },
        { x: 174, y: 754, d: "M 57 238 C 57 238 150.802 125.887 143 68.5 C 135.198 11.113 100.972 0.294 72.402 0.003 C 43.832 -0.289 -11.805 22.617 2.232 82.869" },
        { x: 226, y: 957, d: "M 194.5 0 C 194.5 0 199.961 34.087 162.5 49.5 C 125.039 64.913 44.984 41.343 0 116.5" },
        { x: 119, y: 748, d: "M 14 0 C 21.732 0 28 5.82 28 13 C 28 20.18 21.732 26 14 26 C 6.268 26 0 20.18 0 13 C 0 5.82 6.268 0 14 0 Z" },
        { x: 400, y: 1254, d: "M 14 0 C 21.732 0 28 5.82 28 13 C 28 20.18 21.732 26 14 26 C 6.268 26 0 20.18 0 13 C 0 5.82 6.268 0 14 0 Z" },
        { x: 235, y: 807, d: "M 14.5 0 C 14.5 0 52.164 65.623 0 169.5" },
        { x: 253, y: 1132, d: "M 348.909 272.212 C 348.909 272.212 204.896 7.222 87.909 0.212 C -29.077 -6.799 60.196 162.383 52.409 208.712 C 44.623 255.04 0 272.212 0 272.212" },
        { x: 504, y: 949, d: "M 31.5 0 C 48.897 0 63 13.208 63 29.5 C 63 45.792 48.897 59 31.5 59 C 14.103 59 0 45.792 0 29.5 C 0 13.208 14.103 0 31.5 0 Z" },
        { x: 5, y: 1131, d: "M 0 274 C 0 274 60.72 231.304 76 129.5 C 91.28 27.696 137.551 10.12 169 0" },
        { x: 31, y: 1141, d: "M 0 0 C 0 0 63.637 40.27 46.5 137.5 C 29.363 234.73 0 0 0 0 Z" },
        { x: 65, y: 1059, d: "M 26.726 0 C 26.726 0 62.081 97.967 17.642 90.5 C -26.796 83.033 26.726 0 26.726 0 Z" },
        { x: 137, y: 896, d: "M 0 0.047 C 0 0.047 91 -4.731 91 82.047" },
        { x: 445, y: 999, d: "M 161.717 0 C 161.717 0 125.893 142.411 62.717 232 C -0.459 321.589 -7.838 345.349 5.717 358.5 C 19.273 371.651 86.838 342.617 116.5 244" },
        { x: 134, y: 1006, d: "M 31.5 0 C 48.897 0 63 13.208 63 29.5 C 63 45.792 48.897 59 31.5 59 C 14.103 59 0 45.792 0 29.5 C 0 13.208 14.103 0 31.5 0 Z" },
        { x: 328, y: 704, d: "M 14 0 C 21.732 0 28 5.82 28 13 C 28 20.18 21.732 26 14 26 C 6.268 26 0 20.18 0 13 C 0 5.82 6.268 0 14 0 Z" },
        { x: 509, y: 865, d: "M 14 0 C 21.732 0 28 5.82 28 13 C 28 20.18 21.732 26 14 26 C 6.268 26 0 20.18 0 13 C 0 5.82 6.268 0 14 0 Z" }
      ],
    },
  };
  // ease-in-out: the pen sets down, writes at pace, lifts off
  const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

  class PenDraw extends HTMLElement {
    connectedCallback() {
      // re-attached mid-draw (pages that rebuild their DOM): start the stroke again
      if (this._built) { this.ro?.observe(this); if (this._playing && !this._done) this.play(); return; }
      this._built = true;
      const art = DRAWINGS[this.getAttribute("name")];
      if (!art) return console.error("[pen-draw] unknown drawing:", this.getAttribute("name"), "— use", Object.keys(DRAWINGS).join(" / "));
      const [, , w, h] = art.viewBox.split(" ").map(Number);
      this.style.display = "block";
      this.style.aspectRatio = `${w} / ${h}`;
      const svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("viewBox", art.viewBox);
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", this.getAttribute("name").replace("-", " "));
      svg.style.cssText = "display:block;width:100%;height:100%;overflow:visible";
      const color = this.getAttribute("color") || "currentColor";
      const width = this.getAttribute("stroke") || String(art.stroke || 6);
      this.paths = art.paths.map(p => {
        const g = document.createElementNS(SVG_NS, "g");
        g.setAttribute("transform", `translate(${p.x} ${p.y})`);
        const path = document.createElementNS(SVG_NS, "path");
        for (const [k, v] of Object.entries({ d: p.d, fill: "none", stroke: color, "stroke-width": width, "stroke-linecap": "round", "stroke-linejoin": "round", pathLength: 1, "stroke-dasharray": "1 1", "stroke-dashoffset": 1 })) path.setAttribute(k, v);
        g.appendChild(path);
        svg.appendChild(g);
        return { path, x: p.x, y: p.y };
      });
      if (!this.hasAttribute("no-tip")) {
        this.tip = document.createElementNS(SVG_NS, "circle");
        this.tip.setAttribute("r", Number(width) * 1.4);
        this.tip.setAttribute("fill", color);
        this.tip.style.cssText = "opacity:0;filter:blur(1.5px);transition:opacity .4s";
        svg.appendChild(this.tip);
      }
      this.appendChild(svg);
      // stroke-px: keep the line the same on-screen thickness however wide the drawing is
      const px = Number(this.getAttribute("stroke-px"));
      if (px > 0) {
        const fit = () => {
          const sw = (px * w) / Math.max(1, this.clientWidth);
          this.paths.forEach(p => p.path.setAttribute("stroke-width", sw));
          this.tip?.setAttribute("r", sw * 1.4);
        };
        fit();
        this.ro = new ResizeObserver(fit);
        this.ro.observe(this);
      }
      // each path's share of the timeline, by real length
      const lens = this.paths.map(p => p.path.getTotalLength());
      const total = lens.reduce((a, b) => a + b, 0) || 1;
      let acc = 0;
      this.paths.forEach((p, i) => { p.len = lens[i]; p.from = acc / total; acc += lens[i]; p.to = acc / total; });

      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return this.finish();
      if (!this.hasAttribute("trigger-on-view")) return this.play();
      this.io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { this.io.disconnect(); this.play(); } }, { threshold: 0.4 });
      this.io.observe(this);
    }

    disconnectedCallback() {
      cancelAnimationFrame(this.raf);
      clearTimeout(this.wait);
      this.io?.disconnect();
      this.ro?.disconnect();
    }

    get duration() { const d = Number(this.getAttribute("duration")); return d > 0 ? d : 2600; }

    play() {
      cancelAnimationFrame(this.raf);
      clearTimeout(this.wait);
      this._playing = true;
      this._done = false;
      this.draw(0);
      const delay = Number(this.getAttribute("delay")) || 0;
      this.wait = setTimeout(() => {
        const t0 = performance.now(), dur = this.duration;
        const step = now => {
          const t = Math.min(1, (now - t0) / dur);
          this.draw(ease(t));
          if (t < 1) this.raf = requestAnimationFrame(step); else this.finish();
        };
        this.raf = requestAnimationFrame(step);
      }, delay);
    }

    draw(progress) {
      let active = null;
      for (const p of this.paths) {
        const local = Math.max(0, Math.min(1, (progress - p.from) / (p.to - p.from || 1)));
        p.path.setAttribute("stroke-dashoffset", 1 - local);
        if (local > 0 && local < 1) active = { p, local };
      }
      if (!this.tip) return;
      if (!active) { this.tip.style.opacity = 0; return; }
      const pt = active.p.path.getPointAtLength(active.local * active.p.len);
      this.tip.setAttribute("cx", pt.x + active.p.x);
      this.tip.setAttribute("cy", pt.y + active.p.y);
      this.tip.style.opacity = 0.55;
    }

    finish() {
      this._done = true;
      this.draw(1);
      this.dispatchEvent(new CustomEvent("pen-draw-done", { bubbles: true }));
    }

    replay() { if (this.paths) this.play(); }
  }

  if (!customElements.get("pen-draw")) customElements.define("pen-draw", PenDraw);
})();
