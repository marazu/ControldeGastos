// variables , selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

// eventos
eventListeners();

function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}

// clases
class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

let presupuesto;


class UI {
    insertarPresupuesto(cantidad){
        const {presupuesto, restante } = cantidad;
        // ADD AL HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
     }

     imprimirAlerta(mensaje,tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');

        }
        divMensaje.textContent = mensaje;

        // add html
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        // remove
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
     }

    agregarGastoListado(gastos){
        
        this.limpiarHtml();
        // iterar sobre gastos
        gastos.forEach( gasto => {
            const {cantidad,nombre, id} = gasto;

            // crear li
            const nuevoGasto =  document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            // add html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class='badge badge-primary badge-pill'> ${cantidad}€ </span>`;

            // boton borrar gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.textContent = 'Borrar X';
            nuevoGasto.appendChild(btnBorrar);
            btnBorrar.onclick = ()=>{
                eliminarGasto(id);
            }
            // add al html
            gastoListado.appendChild(nuevoGasto);
        }); 
     }

    limpiarHtml(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;

    }

    comprobarPresupuesto(presupuestObj){   
        const {presupuesto, restante} = presupuestObj;
        const restanteDiv = document.querySelector('.restante€');

        // comprobar 25%
        if((presupuesto / 4) > restante){   
            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if((presupuesto / 2 ) > restante ){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }
        // si el total es menor a 0
        if(restante <= 0){
            ui.imprimirAlerta('El Presupuesto se ha agotado', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true;
        }        
    }
}
const ui = new UI();

// funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e){
    e.preventDefault();

    // leer datos formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // validar
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no válida', 'error');
        return;
    }

    // generar obj con el gasto
    const gasto = {nombre, cantidad, id: Date.now()}
    // add new gasto
    presupuesto.nuevoGasto(gasto);
    // imprimir alerta
    ui.imprimirAlerta('Gasto agregado');
    
    // imprimir gastos
    const {gastos, restante} = presupuesto;
    ui.agregarGastoListado(gastos);
    
    // actualizar restante
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    // reinicia formulario
    formulario.reset();
}

// 
function eliminarGasto(id){
    // elimina gastos del objeto
    presupuesto.eliminarGasto(id);

    const {gastos, restante} = presupuesto;
    // elimina los gastos del html
    ui.agregarGastoListado(gastos);

    // actualizar restante
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}