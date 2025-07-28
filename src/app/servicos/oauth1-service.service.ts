import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Oauth1Service {
  private consumerKey = 'UserCandidaturaTHCM2025';
  private consumerSecret = 'C4nD1t4dUr4';
  private accessToken = '8458dded-8d53-420d-a8f3-d72017aa6197';
  private tokenSecret = '3d03d5f4-0b66-4d43-94ef-f8c0fb09de5fe302f1b1-a8b3-46ce-ac90-f050028d485f';

  constructor() {}

  generateAuthorizationHeader(method: string, url: string, params: HttpParams | { [key: string]: string | string[] } = {}, body: any = {}): string {
    const oauthParams: any = {
      oauth_consumer_key: this.consumerKey,
      oauth_nonce: this.generateNonce(),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_version: '1.0'
    };

    if (this.accessToken) {
      oauthParams.oauth_token = this.accessToken;
    }

    // Combine todos os parâmetros (query, body e OAuth) para a assinatura
    let allParams: { [key: string]: string } = {};

    // Adiciona parâmetros de query
    if (params instanceof HttpParams) {
      params.keys().forEach(key => {
        allParams[key] = params.get(key) as string;
      });
    } else {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          allParams[key] = String(params[key]);
        }
      }
    }

    // Adiciona parâmetros do corpo (se for um objeto simples)
    if (body && typeof body === 'object' && Object.keys(body).length > 0) {
      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          allParams[key] = String(body[key]);
        }
      }
    }

    // Adiciona parâmetros OAuth
    for (const key in oauthParams) {
      if (oauthParams.hasOwnProperty(key)) {
        allParams[key] = String(oauthParams[key]);
      }
    }

    // 1. Normalizar os parâmetros
    const sortedParams = Object.keys(allParams)
      .sort()
      .map(key => `${this.encodeURIComponent(key)}=${this.encodeURIComponent(allParams[key])}`)
      .join('&');

    // 2. Construir a String Base
    const encodedUrl = this.encodeURIComponent(this.getBaseUrl(url));
    const signatureBaseString = `${method.toUpperCase()}&${encodedUrl}&${this.encodeURIComponent(sortedParams)}`;

    // 3. Gerar a Chave de Assinatura
    const signingKey = `${this.encodeURIComponent(this.consumerSecret)}&${this.encodeURIComponent(this.tokenSecret || '')}`;

    // 4. Gerar a Assinatura (HMAC-SHA1)
    const signature = CryptoJS.HmacSHA1(signatureBaseString, signingKey).toString(CryptoJS.enc.Base64);

    oauthParams.oauth_signature = signature;

    // Construir o cabeçalho Authorization
    const authHeaderParts = Object.keys(oauthParams)
      .sort()
      .map(key => `${key}="${this.encodeURIComponent(oauthParams[key])}"`)
      .join(', ');

    return `OAuth ${authHeaderParts}`;
  }

  private generateNonce(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  private getBaseUrl(url: string): string {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`;
  }

  private encodeURIComponent(str: string): string {
    return encodeURIComponent(str)
      .replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16))
      .replace(/\s/g, '%20');
  }
}
