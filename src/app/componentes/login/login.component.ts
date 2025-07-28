import { Component, inject } from '@angular/core';
import { PoPageLoginComponent, PoPageLoginModule } from '@po-ui/ng-templates';
import { LoginData } from '../../classes/login';
import { LoginService } from '../../servicos/login.service';
import { Router } from '@angular/router';
import { PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    PoPageLoginModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private loginService = inject(LoginService)
  private loginData!: LoginData;
  private route = inject(Router)
  private notify = inject(PoNotificationService)

  public isHiddenLoading: boolean = true;

  public confirmLogin(loginPage: PoPageLoginComponent){
    this.isHiddenLoading = false
    this.loginService.sendLogin(loginPage.login, loginPage.password)
    .subscribe({
      next: value => {
        console.log('sucess', value);

        let loginNow: number = Date.now();
        this.loginData = value;

        localStorage.setItem('access_token',this.loginData.access_token)
        localStorage.setItem('refresh_token',this.loginData.refresh_token)
        localStorage.setItem('expires_in',(loginNow + (this.loginData.expires_in*1000) ).toString())
        localStorage.setItem('token_type',this.loginData.token_type)
        localStorage.setItem('username',loginPage.login)

        this.isHiddenLoading = true
        this.route.navigate([''])
      },
      error: err => {
        let msgErro: string;
        err.error.code === 401 ? msgErro = 'Login inválido!!' : msgErro = err.error.code.message
        this.isHiddenLoading = true
        this.notify.error(msgErro)
      },
      complete: () => {
        this.isHiddenLoading = true
      }
    })
  }
}
