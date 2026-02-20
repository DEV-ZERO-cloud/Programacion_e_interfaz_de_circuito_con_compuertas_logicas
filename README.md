# 🧠 Simulador Web de Circuitos Lógicos

Aplicación web desarrollada en **JavaScript + HTML** que permite construir y simular circuitos de compuertas lógicas organizadas en forma de árbol con múltiples niveles y visualización gráfica interactiva.

---

## 📌 Requerimientos Funcionales

**F.1** Utilizar un entorno/lenguaje de programación de **JavaScript + HTML**.  
**F.2** El sistema debe ser desarrollado en **plataforma web**.  
**F.3** El producto final será una interfaz donde se podrá armar un circuito compuesto por compuertas lógicas conectadas como un árbol con diferentes niveles.  
**F.4** Las compuertas se trabajarán como **funciones booleanas**, es decir, cada compuerta recibe entradas y devuelve una salida.  
**F.5** La interfaz debe permitir elegir la **cantidad de niveles** del circuito.  
**F.6** La interfaz debe permitir seleccionar las **compuertas predominantes por nivel**.  
**F.7** La interfaz debe mostrar gráficamente el circuito armado, utilizando imágenes o símbolos representativos de cada compuerta lógica.  
**F.8** La interfaz debe permitir asignar y modificar las **entradas principales del árbol**.  
**F.9** La interfaz debe obtener:
- Resultados parciales (salida de cada compuerta).
- Resultado total (salida final del circuito).

**F.10** En los resultados parciales se puede usar:
- 🔴 Luz roja para `0`
- 🟢 Luz verde para `1`
- O mostrar directamente `0` y `1`
- O ambas formas.

**F.11 (Bonus)** Permitir agregar un **Flip-Flop RS (Set-Reset)** en cualquiera de las entradas o salidas del circuito para simular su comportamiento.

---

## 📌 Requerimientos No Funcionales

**NF.1** El nivel está asociado al número de compuertas lógicas.  
**NF.2** En un mismo nivel siempre habrá el mismo tipo de compuerta lógica.  
**NF.3** La interfaz debe mostrar el nombre de los integrantes del equipo y del profesor.

---

# 🔁 Diagrama de Flujo del Sistema

![Diagrama](docs/_Diagrama%20de%20flujo.png)
