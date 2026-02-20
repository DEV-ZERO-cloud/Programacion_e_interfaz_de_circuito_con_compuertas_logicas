class Cable {
    constructor(entrada, valor, salida) {
        this.entrada = entrada;
        this.valor = valor;
        this.salida = salida;
    }

    mostrar() {
        return {
            entrada: this.entrada,
            salida: this.salida,
            valor: this.valor
        };
    }

    conectar(compuerta, entrada) {
        if (compuerta) {
            switch(entrada){
                case "A1":
                    this.salida = compuerta.A1;            
                    return true;
                case "B1":
                    this.salida = compuerta.B1;
                    return true;
            }
        } else {
            return false;
        }
    }
}