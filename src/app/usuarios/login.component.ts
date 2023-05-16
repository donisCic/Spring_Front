import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

titulo: string = 'Por favor Sing In!';
usuario: Usuario;


constructor(private authService: AuthService, private router: Router){
  this.usuario = new Usuario();
}

ngOnInit(){
  if (this,this.authService.isAuthenticated()) {
    swal('Login',`Hola ${this.authService.usuario.username} ya estas autenticado!`,'info')
    this.router.navigate(['/clientes']);
  }

}
login():void{
  console.log(this.usuario);
  if (this.usuario.username == null || this.usuario.password ==null) {
  swal('Error Login','Username o password vacias!', 'error');
  return;
  }
this.authService.login(this.usuario).subscribe(response => {
  console.log(response);



    this.authService.guardarUsuario(response.access_token);
    this.authService.guardarToken(response.access_token);
    let usuario = this.authService.usuario;
    this.router.navigate(['/clientes']);
    swal('login', `Hola ${usuario.username}, has iniciado sesion con exito! `, 'success');
  }, err =>{
    if (err.status ==400) {
      swal('Error Login','Username o password incorrecta!', 'error');

    }
  }
);

}
}
