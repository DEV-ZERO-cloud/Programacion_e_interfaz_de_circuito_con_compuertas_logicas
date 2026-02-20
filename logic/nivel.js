class Nivel{
    constructor(tamano=0){
        this.tamano = tamano;
        this.nivel = new Array(tamano);
    }

    mostrar(){
        return{
            tamano: this.tamano,
            nivel: this.nivel
        }
    }
}