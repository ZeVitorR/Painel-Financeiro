import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { MasterComponent } from './componentes/master/master.component';
import { PainelComponent } from './componentes/painel/painel.component';
import { ErroComponent } from './componentes/erro/erro.component';
import { authGuard } from './auth.guard';
import { environment } from '../environments/environment';
import { AdminComponent } from './componentes/admin/admin.component';
let rotas: Routes = [];

if(environment.ambiente === 'protheus'){
  rotas = [
    {path: '', component: MasterComponent},
    {path: 'painel', component: PainelComponent}
  ];
}else{
  rotas = [
    {path: 'login', component: LoginComponent},
    {path: '', component: MasterComponent, children:[
      {path: 'painel', component: PainelComponent},
      {path: 'admin', component: AdminComponent}
    ], canActivate: [authGuard]},
    {path: '**', component: ErroComponent}
  ];
}
export const routes: Routes = rotas
