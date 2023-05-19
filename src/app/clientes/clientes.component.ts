import { Component } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent {

  clientes: Cliente[];
  paginador:any;
  clienteSeleccionado:Cliente;

  constructor(private clienteService: ClienteService,
    public modalService: ModalService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute){

  }

  ngOnInit(){

    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');
      if(!page){
        page =0;
      }
      this.clienteService.getClientes(page).pipe(
    tap(response => {
    console.log('ClienteComponent:tap 3');
    (response.content as Cliente[]).forEach(cliente =>{
      console.log(cliente.nombre);
    });
    })
   )
   .subscribe(response => {
  this.clientes = response.content as Cliente[];
  this.paginador =response;
      });
    });

    this.modalService.notificarUpload.subscribe(cliente =>{
      this.clientes = this.clientes.map(clienteOriginal =>{
        if(cliente.id == clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    })
  }
  delete(cliente:Cliente): void{
   swal({
  title: 'Esta seguro?',
  text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
  showCancelButton:true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si, eliminar',
  cancelButtonText: 'No, cacelar',
  confirmButtonClass: 'btn btn-success',
  cancelButtonClass: 'btn btn.danger',
  buttonsStyling: false,
  reverseButtons: true
}).then((result)=>{
  if(result.value){
    this.clienteService.delete(cliente.id).subscribe(
      response => {
        this.clientes=this.clientes.filter(cli => cli !== cliente)
        swal(
          'Cliente Eliminado!',
          `Cliente ${cliente.nombre} eliminado con exito.`,
          'success'
        )
      }
    )
  }
})
}
abrirModal(cliente: Cliente){
  this.clienteSeleccionado = cliente;
  this.modalService.abrirModal();
}
}
