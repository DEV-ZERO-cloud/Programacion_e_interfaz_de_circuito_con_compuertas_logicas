// ── SVG body definitions for each gate type ─────────────
// viewBox 0 0 64 44  (all gates same viewport)
// Left edge = x:0  Right edge = x:64
// Uses CSS custom properties (--gate-fill, --gate-stroke, etc.) for theming.
const GATE_W = 64, GATE_H = 44;

const GATE_DEFS = {
  // ── Binary gates ────────────────────────────────────────
  AND: {
    body: `<path d="M8,6 H34 A16,16 0 0,1 34,38 H8 Z" style="fill:var(--gate-fill);stroke:var(--gate-stroke)" stroke-width="1.6"/>`,
    outX: 50, inA_Y: 16, inB_Y: 28,
    label: "AND", labelX: 21, labelY: 26, binary: true
  },
  OR: {
    body: `<path d="M8,6 C22,6 38,6 44,22 C38,38 22,38 8,38 Q22,22 8,6 Z" style="fill:var(--gate-fill);stroke:var(--gate-stroke)" stroke-width="1.6"/>`,
    outX: 44, inA_Y: 15, inB_Y: 29,
    label: "OR", labelX: 24, labelY: 26, binary: true
  },
  XOR: {
    body: `<path d="M12,6 C26,6 40,6 46,22 C40,38 26,38 12,38 Q26,22 12,6 Z" style="fill:var(--gate-fill);stroke:var(--gate-stroke)" stroke-width="1.6"/>
           <path d="M6,6 Q20,22 6,38" fill="none" style="stroke:var(--gate-stroke)" stroke-width="1.6" stroke-linecap="round"/>`,
    outX: 46, inA_Y: 15, inB_Y: 29,
    label: "XOR", labelX: 27, labelY: 26, binary: true
  },
  NAND: {
    body: `<path d="M8,6 H32 A14,14 0 0,1 32,38 H8 Z" style="fill:var(--gate-fill);stroke:var(--gate-stroke-inv)" stroke-width="1.6"/>
           <circle cx="50" cy="22" r="4" style="fill:var(--gate-fill);stroke:var(--gate-stroke-inv)" stroke-width="1.6"/>`,
    outX: 54, inA_Y: 16, inB_Y: 28,
    label: "NAND", labelX: 20, labelY: 26, binary: true
  },
  NOR: {
    body: `<path d="M8,6 C20,6 36,6 42,22 C36,38 20,38 8,38 Q20,22 8,6 Z" style="fill:var(--gate-fill);stroke:var(--gate-stroke-inv)" stroke-width="1.6"/>
           <circle cx="46" cy="22" r="4" style="fill:var(--gate-fill);stroke:var(--gate-stroke-inv)" stroke-width="1.6"/>`,
    outX: 50, inA_Y: 15, inB_Y: 29,
    label: "NOR", labelX: 23, labelY: 26, binary: true
  },
  // ── Unary gate ──────────────────────────────────────────
  NOT: {
    body: `<path d="M8,6 L50,22 L8,38 Z" style="fill:var(--gate-fill);stroke:var(--gate-stroke)" stroke-width="1.6"/>
           <circle cx="55" cy="22" r="4" style="fill:var(--gate-fill);stroke:var(--gate-stroke)" stroke-width="1.6"/>`,
    outX: 59, inA_Y: 22, inB_Y: null,
    label: "NOT", labelX: 24, labelY: 26, binary: false
  },
  // ── Flip-Flops ──────────────────────────────────────────
  FFD: {
    body: `<rect x="8" y="4" width="46" height="36" rx="5" style="fill:var(--ff-fill);stroke:var(--ff-stroke)" stroke-width="1.6"/>
           <text x="31" y="18" style="fill:var(--ff-label)" font-size="9" text-anchor="middle" font-family="monospace" font-weight="700">FF-D</text>
           <text x="13" y="30" style="fill:var(--ff-input-s)" font-size="7" font-family="monospace">D</text>
           <text x="48" y="14" style="fill:var(--ff-q-label)" font-size="7" text-anchor="end" font-family="monospace">Q</text>`,
    outX: 54, inA_Y: 28, inB_Y: null,
    label: "", binary: false, isFF: true, ffType: "D"
  },
  FFSR: {
    body: `<rect x="8" y="4" width="46" height="36" rx="5" style="fill:var(--ff-fill);stroke:var(--ff-stroke)" stroke-width="1.6"/>
           <text x="31" y="15" style="fill:var(--ff-label)" font-size="8" text-anchor="middle" font-family="monospace" font-weight="700">FF-SR</text>
           <text x="13" y="26" style="fill:var(--ff-input-s)" font-size="7" font-family="monospace">S</text>
           <text x="13" y="36" style="fill:var(--ff-input-r)" font-size="7" font-family="monospace">R</text>
           <text x="48" y="14" style="fill:var(--ff-q-label)" font-size="7" text-anchor="end" font-family="monospace">Q</text>
           <text x="48" y="38" style="fill:var(--ff-q-label)" font-size="7" text-anchor="end" font-family="monospace">Q&#x0305;</text>`,
    outX: 54, inA_Y: 23, inB_Y: 33,
    label: "", binary: true, isFF: true, ffType: "SR"
  },
  FFJK: {
    body: `<rect x="8" y="4" width="46" height="36" rx="5" style="fill:var(--ff-fill);stroke:var(--ff-stroke)" stroke-width="1.6"/>
           <text x="31" y="15" style="fill:var(--ff-label)" font-size="8" text-anchor="middle" font-family="monospace" font-weight="700">FF-JK</text>
           <text x="13" y="26" style="fill:var(--ff-input-s)" font-size="7" font-family="monospace">J</text>
           <text x="13" y="36" style="fill:var(--ff-input-r)" font-size="7" font-family="monospace">K</text>
           <text x="48" y="14" style="fill:var(--ff-q-label)" font-size="7" text-anchor="end" font-family="monospace">Q</text>`,
    outX: 54, inA_Y: 23, inB_Y: 33,
    label: "", binary: true, isFF: true, ffType: "JK"
  },
  // ── Flip-Flop T (Toggle) ───────────────────────────────
  FFT: {
    body: `<rect x="8" y="4" width="46" height="36" rx="5" style="fill:var(--ff-fill);stroke:var(--ff-stroke)" stroke-width="1.6"/>
           <text x="31" y="18" style="fill:var(--ff-label)" font-size="9" text-anchor="middle" font-family="monospace" font-weight="700">FF-T</text>
           <text x="13" y="30" style="fill:var(--ff-input-s)" font-size="7" font-family="monospace">T</text>
           <text x="48" y="14" style="fill:var(--ff-q-label)" font-size="7" text-anchor="end" font-family="monospace">Q</text>`,
    outX: 54, inA_Y: 28, inB_Y: null,
    label: "", binary: false, isFF: true, ffType: "T"
  }
};

// ── Render gate SVG ─────────────────────────────────────
function renderGateSVG(tipo, sigA, sigB, sigOut) {
  const d = GATE_DEFS[tipo] || GATE_DEFS.AND;
  // Signal colors use CSS variables for theme support
  const ON  = "var(--sig-on)",  OFF  = "var(--sig-off)";
  const FF_ON = "var(--ff-sig-on)", FF_OFF = "var(--ff-sig-off)";
  const outColor = d.isFF ? (sigOut ? FF_ON : FF_OFF) : (sigOut ? ON : OFF);
  const inAColor = d.isFF ? (sigA ? FF_ON : FF_OFF) : (sigA ? ON : OFF);
  const inBColor = d.inB_Y != null ? (d.isFF ? (sigB ? FF_ON : FF_OFF) : (sigB ? ON : OFF)) : null;

  let svg = `<svg viewBox="0 0 ${GATE_W} ${GATE_H}" width="${GATE_W}" height="${GATE_H}">`;

  // wire in A
  svg += `<line x1="0" y1="${d.inA_Y}" x2="8" y2="${d.inA_Y}" style="stroke:${inAColor}" stroke-width="2" stroke-linecap="round"/>`;

  // wire in B (binary gates only)
  if (d.inB_Y != null) {
    svg += `<line x1="0" y1="${d.inB_Y}" x2="8" y2="${d.inB_Y}" style="stroke:${inBColor}" stroke-width="2" stroke-linecap="round"/>`;
  }

  // body
  svg += d.body;

  // label
  if (d.label) {
    svg += `<text x="${d.labelX}" y="${d.labelY}" style="fill:var(--gate-label)" font-size="7.5" text-anchor="middle" font-family="monospace" font-weight="600">${d.label}</text>`;
  }

  // wire out
  svg += `<line x1="${d.outX}" y1="22" x2="${GATE_W}" y2="22" style="stroke:${outColor}" stroke-width="2" stroke-linecap="round"/>`;

  svg += `</svg>`;
  return svg;
}

// ── Compuerta class ─────────────────────────────────────
class Compuerta {
  constructor(tipo) {
    this.tipo = tipo.toUpperCase();
    this.estado = 0;   // FF state (Q)
    this.A = 0;        // current input A value
    this.B = 0;        // current input B value
    this.Q = 0;        // current output value
  }

  calcular() {
    const A = this.A;
    const B = this.B;
    switch (this.tipo) {
      case "AND":  this.Q = A & B; break;
      case "OR":   this.Q = A | B; break;
      case "NOT":  this.Q = A ? 0 : 1; break;
      case "XOR":  this.Q = A ^ B; break;
      case "NAND": this.Q = ((A & B) ? 0 : 1); break;
      case "NOR":  this.Q = ((A | B) ? 0 : 1); break;
      case "FFD":  this.Q = this.estado; break;  // output is last latched state
      case "FFSR": this.Q = this.estado; break;
      case "FFJK": this.Q = this.estado; break;
      case "FFT":  this.Q = this.estado; break;
      default:     this.Q = 0;
    }
    return this.Q;
  }

  // Call on clock tick for FFs
  latch() {
    const A = this.A, B = this.B;
    switch (this.tipo) {
      case "FFD":
        this.estado = A;
        break;
      case "FFSR":
        if (A === 1 && B === 0) this.estado = 1;      // S=1,R=0 → Set
        else if (A === 0 && B === 1) this.estado = 0; // S=0,R=1 → Reset
        else if (A === 1 && B === 1) this.estado = 1; // S=R=1 → 1 (por conveniencia)
        // A=B=0 → hold
        break;
      case "FFJK":
        if (A === 0 && B === 0) { /* hold */ }
        else if (A === 0 && B === 1) this.estado = 0;
        else if (A === 1 && B === 0) this.estado = 1;
        else if (A === 1 && B === 1) this.estado ^= 1; // toggle
        break;
      case "FFT":
        if (A === 1) this.estado ^= 1; // toggle when T=1
        // T=0 → hold
        break;
    }
    this.Q = this.estado;
  }

  isFF() { return ["FFD","FFSR","FFJK","FFT"].includes(this.tipo); }

  mostrar() {
    return { tipo: this.tipo, A: this.A, B: this.B, Q: this.Q, estado: this.estado };
  }
}