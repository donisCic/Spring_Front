import { Component, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from 'src/app/usuarios/auth.service';

import { FacturaService } from 'src/app/facturas/services/factura.service';
import { Factura } from 'src/app/facturas/models/factura';


@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent {

  @Input() cliente:Cliente;
  titulo: string ="Detalle del cliente";
  public fotoSeleccionada: File;
  progreso:number =0;

  constructor(private clienteService: ClienteService,
    public facturaService: FacturaService,
    public authService: AuthService,
    public modalService: ModalService){

  }
ngOnInit(){

}
seleccionarFoto(event){
  this.fotoSeleccionada = event.target.files[0];
  this.progreso = 0;
  console.log(this.fotoSeleccionada);
if(this,this.fotoSeleccionada.type.indexOf('image') < 0){

  swal('Error al seleccionar imagen: ', 'El archivo debe de ser de tipo imagen', 'error');
  this.fotoSeleccionada = null;
}
}

subirFoto(){
  if (!this.fotoSeleccionada) {
    swal('Error Upload: ', 'Debe seleccionar una foto', 'error');
  } else {
  this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
  .subscribe(event =>{
  if(event.type === HttpEventType.UploadProgress){
    this.progreso = Math.round((event.loaded/event.total)*100);
  }else if(event.type===HttpEventType.Response){
    let response: any =event.body;
    this.cliente = response.cliente as Cliente;

    this.modalService._notificarUpload.emit(this.cliente);

    swal ('la foto se ha subido completamente!',response.mensaje,'success');
  }



  })
}
}
cerrarModal(){
  this.modalService.cerrarModal();
  this.fotoSeleccionada = null;
  this.progreso = null;
}

delete(factura: Factura):void{
    swal({
   title: 'Esta seguro?',
   text: `¿Seguro quieres eliminar la factura? ${factura.descripcion}?`,
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

     this.facturaService.delete(factura.id).subscribe(
       () => {
         this.cliente.facturas=this.cliente.facturas.filter(f => f !== factura)
         swal(
           'Factura Eliminada !',
           `Factura ${factura.descripcion} eliminada con exito.`,
           'success'
         )
       }
     )
   }
 });

}

}
