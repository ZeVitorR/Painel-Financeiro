import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { MasterComponent } from './componentes/master/master.component';
import { PainelComponent } from './componentes/painel/painel.component';
import { ErroComponent } from './componentes/erro/erro.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', component: MasterComponent, children:[
    {path: 'painel', component: PainelComponent}
  ], canActivate: [authGuard]},
  {path: '**', component: ErroComponent}
];
