// import { BrowserModule } from '@angular/platform-browser';
// import { NgModule } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
// import { RouterModule } from '@angular/router';

// import { AppComponent } from './app.component';
// import { NavMenuComponent } from './nav-menu/nav-menu.component';
// import { HomeComponent } from './home/home.component';
// import { CounterComponent } from './counter/counter.component';
// import { FetchDataComponent } from './fetch-data/fetch-data.component';
// import { ProductosComponent } from './productos/productos.component';
// //import { ProductosFormComponent } from './productos/productos-form/productos-form.component';



// @NgModule({
//   declarations: [
//     AppComponent,
//     NavMenuComponent,
//     HomeComponent,
//     CounterComponent,
//     FetchDataComponent,
//     ProductosComponent,

//   ],
//   imports: [
//     BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
//     HttpClientModule,
//     FormsModule,
//     ReactiveFormsModule,

//     RouterModule.forRoot([
//       { path: '', component: HomeComponent, pathMatch: 'full' },
//       { path: 'counter', component: CounterComponent },
//       { path: 'fetch-data', component: FetchDataComponent },
//       { path: 'productos', component: ProductosComponent },


//     ])
//   ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }



import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';

import { PersonasComponent } from './personas/personas.component';
import { PersonasService } from './personas/personas.service';
import { PersonasFormComponent } from './personas/personas-form/personas-form.component';

import { CommonModule, DatePipe } from '@angular/common';
import { LogInterceptorService } from './services/log-interceptor.service';
import { DireccionesService } from './direcciones/direcciones.service';
import { LeaveFormService } from './personas/personas-form/leave-form.service';
import { RegisterComponent } from './account/register/register.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AccountService } from './account/account.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';

import { EventosComponent } from './eventos/eventos.component';
import { EventosService } from './eventos/eventos.service';
import { ConfirmarEventoComponent } from './eventos/confirmar-evento/confirmar-evento.component';
import { EventosFormComponent } from './eventos/eventos-form/eventos-form.component';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,

    PersonasComponent,
    PersonasFormComponent,
    RegisterComponent,

    EventosComponent,
    ConfirmarEventoComponent,
    EventosFormComponent

  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },


      { path: 'personas', component: PersonasComponent, canActivate:[AuthGuardService] },
      { path: 'personas-agregar', component: PersonasFormComponent, canDeactivate: [LeaveFormService] },
      { path: 'personas-editar/:id', component: PersonasFormComponent, canDeactivate: [LeaveFormService] }, // parametros /:id, truco para que parezca otro form
      { path: 'register-login', component: RegisterComponent },

      { path: 'eventos', component: EventosComponent},
      { path: 'confirmar-evento', component: ConfirmarEventoComponent},
      { path: 'evento-agregar-individual', component: EventosFormComponent},
      { path: 'eventos-detalle/:id', component: EventosFormComponent},

      { path: 'inscribir-participante/:id', component: EventosFormComponent},


      

    ])
  ],
  providers: [PersonasService,
    DatePipe,
    DireccionesService,
    LeaveFormService,
    AuthGuardService,
    AccountService,

    EventosService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LogInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
