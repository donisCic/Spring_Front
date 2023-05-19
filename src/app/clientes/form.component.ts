//FRONTEND DE LA APP Y CONSULTAS LISTAR, CREAR, ACTUALIZAR Y BORRAR
//ngModel: directiva que pobla con los datos del formulario al atributo cliente.ts y sus atributos
import { Component } from '@angular/core';
import { Cliente } from './cliente';
import { Region } from './region';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent {
  public cliente: Cliente = new Cliente()
  regiones: Region[];
  public titulo:string ="Crear Cliente"

  public errores: string[];

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activateRoute: ActivatedRoute){}

ngOnInit(){
   this.cargarCliente()
}

//UPDATE
//metodo que asigna la respuesta al atributo cliente
//ese es buscado por id

cargarCliente(): void{
  this.activateRoute.params.subscribe(params => {
    let id = params['id']
    if(id){
      this.clienteService.getCliente(id).subscribe((cliente)=> this.cliente = cliente)


    }
  });
  this.clienteService.getRegiones().subscribe(regiones=>this.regiones = regiones);

}

//cuando se invoque este metodo, el cliente ya esta listo para
//guardar todos sus datos
  public create(): void{
    console.log(this.cliente);
   this.clienteService.create(this.cliente)
   .subscribe(cliente => {
    this.router.navigate(['/clientes'])

    //mensaje de creado desde el backEnd
    swal('Nuevo cliente', `El cliente ${cliente.nombre} ha sido creado con exito`, 'success')
    //mensaje de creado desde el frontEnd
    //swal('Nuevo cliente', `Cliente ${json.cliente.nombre} creado con exito`, 'success')
   },
   err => {
    this.errores = err.error.errors as string[];
    console.error('Codigo del error desde el backend: '+ err.status);
    console.error(err.error.errors);
   }
   );
  }
//
update():void{
  console.log(this.cliente);
  this.cliente.facturas = null;
  this.clienteService.update(this.cliente)
  .subscribe(json =>{
    this.router.navigate(['/clientes'])
        swal('Cliente Actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success')
  },
  err => {
   this.errores = err.error.errors as string[];
   console.error('Codigo del error desde el backend: '+ err.status);
   console.error(err.error.errors);
  }
  )
}
compararRegion(o1:Region,o2:Region): boolean{
  if(o1 === undefined && o2 === undefined){
    return true;
  }
  return o1 === null|| o2 === null || o1 === undefined || o2 === undefined? false: o1.id === o2.id;

}

}
