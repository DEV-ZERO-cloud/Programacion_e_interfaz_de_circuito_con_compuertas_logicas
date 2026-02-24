// ── Nivel ────────────────────────────────────────────────
// With T total levels, level i (1-indexed from LEFT) has 2^(T-i) gates.
// Level 1 (leftmost) has the MOST gates; Level T (rightmost) has 1 gate.
// Inputs to the circuit come from the dedicated Inputs column on the far left.

class Nivel {
  /**
   * @param {number} i      - position index (1 = leftmost / most gates)
   * @param {number} total  - total number of levels
   * @param {string} tipo   - gate type for this level
   */
  constructor(i, total, tipo = "AND") {
    this.i = i;
    this.total = total;
    this.tipo = tipo.toUpperCase();

    // Gate count: leftmost level has 2^(total-1) gates, rightmost has 1
    this.gateCount = Math.pow(2, total - i);

    // Number of inputs this level can accept
    // (binary: 2 per gate, unary/FF-D: 1 per gate, FF-SR/JK: 2 per gate)
    this.compuertas = Array.from({ length: this.gateCount },
      () => new Compuerta(this.tipo));
  }

  setTipo(tipo) {
    this.tipo = tipo.toUpperCase();
    this.compuertas = Array.from({ length: this.gateCount },
      () => new Compuerta(this.tipo));
  }

  // gateIndex-th gate gets inputs and calculates output
  evaluarCompuerta(gIdx) {
    return this.compuertas[gIdx].calcular();
  }

  // Tick all FFs in this level (call on clock edge)
  tick() {
    this.compuertas.forEach(c => { if (c.isFF()) c.latch(); });
  }

  // Is this a FF level?
  hasFF() {
    return this.compuertas.length > 0 && this.compuertas[0].isFF();
  }

  mostrar() {
    return {
      i: this.i, total: this.total, tipo: this.tipo,
      gateCount: this.gateCount,
      compuertas: this.compuertas.map(c => c.mostrar())
    };
  }
}