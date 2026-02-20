class Compuerta {
    constructor(tipo) {
        this.tipo = tipo.toUpperCase();
        this.valor = 0;
        this.A1 = null;
        this.B1 = null;
        this.F1 = null;
        this.estado = 0;

        this.operaciones = {
            AND: (A, B) => A & B,
            OR: (A, B) => A | B,
            NOT: (A) => A ? 0 : 1,
            XOR: (A, B) => A ^ B,
            NAND: (A, B) => ~(A & B) & 1,
            FFSR: (A, B) => {
                if (A === 1 && B === 0) this.estado = 1;
                else if (A === 0 && B === 1) this.estado = 0;
                return this.estado;
            }
        };
    }
    mostrar() {
        return {
            A1: this.A1,
            B1: this.B1,
            F1: this.F1,
            valor: this.valor,
            tipo: this.tipo
        };
    }
    operar() {
        const A = this.A1?.valor ?? 0;
        const B = this.B1?.valor ?? 0;

        const operacion = this.operaciones[this.tipo];

        if (!operacion) {
            throw new Error("Tipo de compuerta no válido");
        }

        return operacion(A, B);
    }

    calcular() {
        this.valor = this.operar();
        return this.valor;
    }
}