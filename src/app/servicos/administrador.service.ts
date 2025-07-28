import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  private http = inject(HttpClient);
  private url: string = environment.url

  constructor() { }

  public usuarios(): Observable<Array<any>> {
    let urlConsulta: string = `${this.url}/financeiro/api/paineladmin/usuarios`
    return this.http.get<Array<any>>(urlConsulta);
  }

  public produtoCliente(parametros: string): Observable<Array<any>> {
    let urlConsulta: string = `${this.url}/financeiro/api/paineladmin/grafico?${parametros}`
    return this.http.get<Array<any>>(urlConsulta);
  }

  public dados(parametros: string): Observable<Array<any>> {
    let urlConsulta: string = `${this.url}/financeiro/api/paineladmin/dados?${parametros}`
    return this.http.get<Array<any>>(urlConsulta);
  }
}
