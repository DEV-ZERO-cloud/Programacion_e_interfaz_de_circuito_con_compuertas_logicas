# Alternativas de Implementación: Flip-Flops entre Niveles

## Contexto

En el simulador de compuertas lógicas, cada nivel procesa `2^n` señales de entrada a través de compuertas del mismo tipo. La integración de **Flip-Flops** entre niveles permite introducir **memoria** y **estado** en el circuito, convirtiendo el simulador de combinacional a **secuencial**. A continuación se presentan tres alternativas de implementación, con sus ventajas, desventajas y esquema visual propuesto.

---

## Alternativa 1: Flip-Flop como "Capa de Transición" Visual entre Niveles

### Descripción
Agregar un bloque visual especial **entre columnas de niveles** (en el espacio de separación entre Nivel N y Nivel N+1). Este bloque actúa como una "barrera de clock" donde las señales se retienen hasta que el usuario hace clic en "TICK" (avance manual de reloj) o activa un clock automático.

### Estructura Visual
```
[Nivel N]  ──► [FF-Block] ──► [Nivel N+1]
                  │
               [Q / Q̄]
```

### Cómo implementarlo en el código actual
- Se agrega un objeto `FlipFlopTransicion` que tiene `D` (entrada), `Q` (salida), `Qbar` (salida negada).
- En el HTML se renderiza como una columna intermedia más estrecha con el SVG del FF-D o FF-SR.
- Un botón global "CLOCK TICK" llama a `ff.latch()` en todos los flip-flops registrados.
- La señal `Q` alimenta como entrada al nivel siguiente.

```javascript
class FlipFlopD {
  constructor() {
    this.D = 0;
    this.Q = 0;
    this.Qbar = 1;
  }
  latch() {
    this.Q = this.D;
    this.Qbar = this.D ? 0 : 1;
  }
}
```

### Ventajas
- ✅ Separación clara entre lógica combinacional (niveles) y secuencial (entre niveles).
- ✅ Fácil de entender visualmente para estudiantes.
- ✅ El "TICK" manual es didácticamente poderoso.

### Desventajas
- ❌ El flujo de datos se interrumpe en cada FF; el usuario debe gestionar el clock.
- ❌ La cantidad de FF aumenta con 2^n señales entre niveles (puede ser grande).

---

## Alternativa 2: Flip-Flop como Tipo de Compuerta Seleccionable por Nivel

### Descripción
Agregar **FF-SR**, **FF-D**, **FF-JK** como opciones en el `<select>` de tipo de compuerta de cada nivel. Cuando el usuario selecciona FF-D en el Nivel 2, todas las 2^2 = 4 "compuertas" de ese nivel se comportan como Flip-Flops D.

### Estructura Visual
```
Nivel 1 (AND): [AND][AND]
Nivel 2 (FF-D): [D-FF][D-FF][D-FF][D-FF]
Nivel 3 (OR): [OR][OR][OR][OR][OR][OR][OR][OR]
```

### Cómo implementarlo en el código actual
- En `compuerta_universal.js` ya existe `FFSR`. Se extiende para FF-D y FF-JK.
- El selector incluye íconos/etiquetas diferenciadas para FFs vs compuertas estándar.
- Al evaluar el circuito, si el tipo es FF, se llama `latch()` en vez de `calcular()`.
- Se agrega una señal de clock global o by-level.

```javascript
// En Compuerta (compuerta_universal.js)
operaciones: {
  ...
  FFD: function(D) {
    // Se activa en flanco de subida del clock
    if (this.clockRising) this.estado = D;
    return this.estado;
  },
  FFJK: function(J, K) {
    if (J === 0 && K === 0) return this.estado;       // Hold
    if (J === 0 && K === 1) { this.estado = 0; }     // Reset
    if (J === 1 && K === 0) { this.estado = 1; }     // Set
    if (J === 1 && K === 1) { this.estado ^= 1; }    // Toggle
    return this.estado;
  }
}
```

### Ventajas
- ✅ Integración total con la arquitectura existente de `Compuerta`.
- ✅ No requiere nueva columna visual; los FFs conviven con las compuertas.
- ✅ Permite mezclar compuertas y FFs en diferentes niveles.

### Desventajas
- ❌ La lógica de clock dentro del objeto `Compuerta` rompe la distinción combinacional/secuencial.
- ❌ El SVG del FF es más complejo que el de compuertas básicas.
- ❌ Puede confundir a estudiantes si no queda claro qué niveles tienen memoria.

---

## Alternativa 3: Panel Lateral de Flip-Flops "Auxiliares" con Registro de Estado

### Descripción
Crear un panel separado (en el sidebar derecho o como un modal) donde el usuario agrega **Flip-Flops manualmente**, los conecta a señales específicas de cualquier nivel, y gestiona su estado. Los FFs no están en el flujo principal de niveles sino como **elementos auxiliares**.

### Estructura Visual
```
[ WORKSPACE: Nivel 1 | Nivel 2 | ... ]

[ PANEL FF ]
  FF#1: D=señal(N2,salida3)  Q→señal(N3,entrada2)
  FF#2: SR: S=..., R=...
  [TICK CLOCK] [RESET ALL]
```

### Cómo implementarlo en el código actual
- Se agrega un `Map<id, FlipFlop>` en el estado global del circuito.
- El PDF del panel muestra: ID, tipo, entradas (D/S/R o J/K), salida Q.
- Cada FF puede ser "conectado" a una señal específica mediante un selector desplegable.
- Al hacer TICK, todos los FFs leen su entrada D/SR/JK y actualizan Q.

```javascript
class RegistroFlipFlops {
  constructor() {
    this.flops = new Map();
  }
  agregar(id, tipo) {
    this.flops.set(id, { tipo, D: 0, Q: 0, estado: 0 });
  }
  tick(circuito) {
    this.flops.forEach((ff, id) => {
      const entrada = circuito.obtenerSenal(ff.entradaRef);
      if (ff.tipo === 'D') ff.Q = entrada;
      if (ff.tipo === 'SR') { /* lógica SR */ }
    });
  }
}
```

### Ventajas
- ✅ Los FFs son opcionales y no alteran la estructura de niveles.
- ✅ Muy flexible: cualquier señal puede conectarse a cualquier FF.
- ✅ Escalable sin rediseñar el workspace principal.

### Desventajas
- ❌ La UI del panel de FFs es más compleja de construir.
- ❌ Las conexiones visuales (cables entre FF y niveles) son difíciles de representar en el layout actual.
- ❌ Menos intuitivo para ver el efecto secuencial dentro del flujo de niveles.

---

## Comparativa Rápida

| Criterio                     | Alt. 1 (Transición) | Alt. 2 (Tipo de nivel) | Alt. 3 (Panel auxiliar) |
|-----------------------------|---------------------|------------------------|--------------------------|
| Integración visual          | ⭐⭐⭐⭐           | ⭐⭐⭐                 | ⭐⭐                    |
| Didáctica / claridad        | ⭐⭐⭐⭐⭐         | ⭐⭐⭐                 | ⭐⭐                    |
| Esfuerzo de implementación  | ⭐⭐⭐             | ⭐⭐⭐⭐               | ⭐⭐⭐⭐⭐             |
| Flexibilidad                | ⭐⭐               | ⭐⭐⭐                 | ⭐⭐⭐⭐⭐             |
| Compatibilidad con código   | ⭐⭐⭐             | ⭐⭐⭐⭐⭐             | ⭐⭐⭐                 |

---

## Recomendación

Para este proyecto, **la Alternativa 2** es la más compatible con la arquitectura actual (`Compuerta`, `Nivel`), ya que solo requiere extender los tipos soportados. Sin embargo, si el objetivo es enfatizar el comportamiento **secuencial y temporal** (ciclos de clock), **la Alternativa 1** es la más didáctica y visualmente clara, con la noción de "barrera de clock" entre niveles siendo muy fácil de entender para un curso de Arquitectura del Computador.

---

*Documento generado para el Taller Práctico #1 - Arquitectura del Computador*
