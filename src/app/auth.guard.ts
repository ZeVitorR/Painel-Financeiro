import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../environments/environment';
import { inject } from '@angular/core';
import { LoginService } from './servicos/login.service';

export const authGuard: CanActivateFn = (route, state) => {

  if(environment.ambiente === 'protheus'){
    return true;
  }

  let router = inject(Router);
  let loginService = inject(LoginService)
  let username = localStorage.getItem('username');
  let refresh_token = localStorage.getItem('refresh_token');
  let expires_in = localStorage.getItem('expires_in');

  if(!username){
    router.navigate(['login'])
    return true
  }

  if( typeof expires_in === 'string'){
    if( Number(expires_in) > Date.now()){
      return true
    }
  }

  if(typeof refresh_token === 'string'){
    loginService.refreshLogin(refresh_token)
    .subscribe({
      next: value => {
        localStorage.setItem('access_token',value.access_token)
        localStorage.setItem('refresh_token',value.refresh_token)
        localStorage.setItem('expires_in', ((value.expires_in * 1000) + Date.now() ).toString())
      },
      error: err => {
        localStorage.clear();
        console.log('erro',err)
        router.navigate(['login'])
      },
      complete: () => {}
    })

  }

  return true;
};
