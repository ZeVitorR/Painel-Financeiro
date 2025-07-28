import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
// import { Oauth1Service } from "./servicos/oauth1-service.service";
import { inject } from "@angular/core";

import OAuth from 'oauth-1.0a';
import CryptoJS from 'crypto-js';

export class jwtInterceptor implements HttpInterceptor {
  // private oauth1Service = inject(Oauth1Service)
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var consomerKey = (req.method == 'GET') ? 'UserOAuthGetFluigThCm2025' : ''
    var consomerSecret = (req.method == 'GET') ? 'Us3rFluiGTHCM2025' : ''
    var tokenKey = (req.method == 'GET') ? '2eee415a-aee0-4428-b7b6-50878326a279' : ''
    var tokenSecet = (req.method == 'GET') ? 'd410213d-fb9f-45b0-b890-4a261d2e123d4b009cbb-655d-45b5-b50a-d0f5f18780a6' : ''

    if(environment.ambiente === 'protheus'){
      return next.handle(req)
    }

    if(req.url.startsWith('https://thomasie156267.fluig.cloudtotvs.com.br/')){
      // Determine o corpo da requisição para a assinatura
      const oauth = new OAuth({
        consumer: {
          key: consomerKey,
          secret: consomerSecret,
        },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
          return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
        },
      });
      const requestData = {
        url: req.url,
        method: req.method,
      };

      const token = {
        key: tokenKey,
        secret: tokenSecet,
      };

      const oauthHeaders = oauth.toHeader(oauth.authorize(requestData, token));

      var autenticacao = oauthHeaders.Authorization.replace('OAuth ','').replaceAll(", ",'&').replaceAll('"','')
      var url = req.url
      url += (!req.url.includes('?'))?'?':'&'
      url += autenticacao

      const clonedreq = req.clone({
        url: url
      });

      return next.handle(clonedreq);
    }
    const token = localStorage.getItem('access_token')
    if( typeof token === 'string'){
      req = req.clone({setHeaders: {Authorization: `Bearer ${token}`}})
    }

    return next.handle(req)
  }
}
