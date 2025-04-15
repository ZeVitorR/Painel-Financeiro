import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Clientes } from '../classes/clientes';

@Injectable({
  providedIn: 'root'
})
export class PainelService {
  private http = inject(HttpClient);
  private url: string = environment.url;

  constructor() { }

  public dadosCliente(codCliente: string, loja: string): Observable<Array<Clientes>> {
    let urlCliente: string = `${this.url}/financeiro/api/dashboard/dadosCliente?cCodigoCliente=${codCliente}&cLoja=${loja}`
    return this.http.get<Array<Clientes>>(urlCliente);
  }

  public produtoCliente(codCliente: string, loja: string): Observable<Array<any>> {
    let urlProduto: string = `${this.url}/financeiro/api/dashboard/retornaProduto?cCodigoCliente=${codCliente}&cLoja=${loja}`
    return this.http.get<Array<any>>(urlProduto);
  }

  public historicoCliente(codCliente: string, loja: string, produto: string): Observable<Array<any>> {
    let urlHist: string = `${this.url}/financeiro/api/dashboard/historicoCobranca?cCodigoCliente=${codCliente}&cLoja=${loja}&cCodProduto=${produto}`
    return this.http.get<Array<any>>(urlHist);
  }

  public dadosFinanceiro(codCliente: string, loja: string, produto: string, filial: string): Observable<Array<any>> {
    let urlFin: string = `${this.url}/financeiro/api/dashboard/dadosFinanceiro?cCodigoCliente=${codCliente}&cLoja=${loja}&cCodProduto=${produto}&cFilial=${filial}`
    return this.http.get<Array<any>>(urlFin);
  }

  public historicoProduto(produto: string, filial: string): Observable<Array<any>> {
    let urlHistProd: string = `${this.url}/financeiro/api/dashboard/historicoProduto?cCodProduto=${produto}&cFilial=${filial}`
    return this.http.get<Array<any>>(urlHistProd);
  }
}
