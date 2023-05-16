import { Component, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';
import { PaginatorComponent } from './paginator/paginator.component'; //permite el cambio del formato de hora
import { ClienteService } from './clientes/cliente.service';
import { RouterModule, Routes } from '@angular/router';
//* con esta libreria importada vamos a poder conectar el backend con el front end/
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import localeES from '@angular/common/locales/es';
import { formatDate, DatePipe, registerLocaleData} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';



registerLocaleData(localeES,'es');

//* agregamos una constante con el nombre routes donde pasaremos los parametros siguientes
//para poder navegar sin refrescar, de aqui agregamos el router outlet al body*/
const routes: Routes = [
  {path:'', redirectTo: '/clientes', pathMatch: 'full'},
  {path: 'directivas', component: DirectivaComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'clientes/page/:page', component: ClientesComponent},
  {path: 'clientes/form', component: FormComponent, canActivate:[AuthGuard, RoleGuard], data:{role:'ROLE_ADMIN'}}, //mapeo de la ruta al componente formulario
  {path: 'clientes/form/:id', component: FormComponent, canActivate:[AuthGuard, RoleGuard], data:{role:'ROLE_ADMIN'}}, //mapeo de la ruta del boton editar cliente
  {path: 'login', component: LoginComponent}

];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    //aqui agregamos el import del httpModule para que funcione el cors/
    HttpClientModule,
    // modulo para trabajar con formularios
    FormsModule,
    //agregamos la ruta que creamos arriba/
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,MatNativeDateModule, MatDatepickerModule

  ],
  providers: [ClienteService,
    {provide: LOCALE_ID, useValue: 'es'},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },],
  bootstrap: [AppComponent]

})
export class AppModule { }
