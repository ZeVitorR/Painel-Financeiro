import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

export class jwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(environment.ambiente === 'protheus'){
      return next.handle(req)
    }

    const token = localStorage.getItem('access_token')

    if( typeof token === 'string'){
      req = req.clone({setHeaders: {Authorization: `Bearer ${token}`}})
    }

    return next.handle(req)
  }
}
