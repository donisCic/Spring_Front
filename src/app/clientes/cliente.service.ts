import { Injectable } from '@angular/core';
import { formatDate, DatePipe} from '@angular/common'; //permite el cambio del formato de hora

import { Cliente } from './cliente';
import { Region } from './region';

import { of,Observable,throwError } from 'rxjs';
import { HttpClient, HttpRequest,HttpEvent } from '@angular/common/http';   /* CONEXION BACKEND 3.importamos este modulo para que retorne una lista de clientes de forma dinamica y no estatica*/
import { map, catchError,tap } from 'rxjs/operators';


import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';        /* CONEXION BACKEND 7. se coloca el endpoint de tipo string */

  constructor(private http: HttpClient, private router: Router) { }   /* CONEXION BACKEND 4. inyectamos la dependencia http en el constructor vacio*/

  getRegiones(): Observable<Region[]>{
   return this.http.get <Region[]>(this.urlEndPoint + '/regiones');
  }

  getClientes(page: number): Observable<any>{
   //return of(CLIENTES);                    /* CONEXION BACKEND 5. comentamos el codigo anterior */

    return this.http.get(this.urlEndPoint + '/page/'+page).pipe(
      tap((response:any) =>{
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);
        })
      }),
       map((response:any)=> {
        //cambio de nombre del cliente a mayusculas
         (response.content as Cliente[]).map(cliente =>{
          cliente.nombre =cliente.nombre.toUpperCase();
          //cambio del formato de hora
          //cliente.createAt = formatDate(cliente.createAt,'dd-MM-yyy','en-US');
          //otro metodo
          //let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt,'EEE dd, MMM yyyy');
          return cliente;
        });
        return response;
      }),
      tap(response =>{
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);
        })
      })
     );
  }
//metodo post permite agregar a la bd los datos
//se pasa la url que es localhost
//se pasan los datos que es el objeto clientes
//por ultimo el httpHeades

create(cliente: Cliente) : Observable<Cliente>{
  return this.http.post(this.urlEndPoint,cliente).pipe(
    map((response: any) =>response.cliente as Cliente),
    catchError(e=>{

      if(e.status==400){
        return throwError(e);
      }
      if (e.error.mensaje) {
     console.error(e.error.mensaje);
    }
     return throwError(e);
    })
  );
}

//medoto get que permite mostrar en el form la informacion del
//cliente seleccionado por id
//adicional se muestra el manejo de errores frontend con
//catchError y en consola del navegador

getCliente(id): Observable<Cliente>{
  return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
catchError(e =>{
  if (e.status !=401 && e.error.mensaje) {

  this.router.navigate(['/clientes']);
  console.error(e.error.mensaje);

}
  return throwError(e);
  })
  );
}

//metodo que actualiza la informacion en el form
update(cliente: Cliente): Observable<any>{
  return this.http.put<any>(`${this,this.urlEndPoint}/${cliente.id}`,cliente).pipe(
    catchError(e=>{

      if(e.status==400){
        return throwError(e);
      }

      if (e.error.mensaje) {
        console.error(e.error.mensaje);
       }      return throwError(e);
     })
  );
}

//metodo que borra lso datos en la bd por id
delete (id: number): Observable<Cliente>{
  return this.http.delete<Cliente> (`${this.urlEndPoint}/${id}`).pipe(
    catchError(e=>{

      if (e.error.mensaje) {
        console.error(e.error.mensaje);
       }      return throwError(e);
     })
  );
}
subirFoto(archivo: File, id):Observable<HttpEvent<{}>>{
  let formData = new FormData();
  formData.append("archivo", archivo);
  formData.append("id",id);

const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`,formData,{
  reportProgress: true
});
  return this.http.request(req);
}

}
