class Mapa{
    constructor(tamano=0){
        this.tamano = tamano;
        this.mapa = new Array(tamano);
    }

    mostrar(){
        return{
            tamano: this.tamano,
            mapa: this.nivel
        }
    }
}