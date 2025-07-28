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
  private url: string = environment.url

  constructor() { }

  public dadosCliente(codCliente: string, loja: string): Observable<Array<Clientes>> {
    let urlCliente: string = `${this.url}/financeiro/api/dashboard/dadosCliente?cCodigoCliente=${codCliente}&cLoja=${loja}`
    return this.http.get<Array<Clientes>>(urlCliente);
  }

  public produtoCliente(codCliente: string, loja: string, parametros:string): Observable<Array<any>> {
    let urlProduto: string = `${this.url}/financeiro/api/dashboard/retornaProduto?cCodigoCliente=${codCliente}&cLoja=${loja}${parametros}`
    return this.http.get<Array<any>>(urlProduto);
  }

  public retornaCliente(cFil: string, cProd: string): Observable<Array<any>> {
    let urlCliente: string = `${this.url}/financeiro/api/dashboard/retornaCliente?cFil=${cFil}&cProd=${cProd}`
    return this.http.get<Array<any>>(urlCliente);
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

  public historicoVidaLote(produto: string, filial: string): Observable<Array<any>> {

    let urlHistProd: string = `${this.url}/financeiro/api/dashboard/historicoVidaLote?cCodProduto=${produto}&cFilial=${filial}`
    return this.http.get<Array<any>>(urlHistProd);
  }

  public buscaCliente(filter: string,page:string, pageSize:string) : Observable<Array<any>>{

    let url: string = `${this.url}/financeiro/api/dashboard/buscaCliente?page=${page}&pageSize=${pageSize}&filter=${filter}`
    return this.http.get<Array<any>>(url);
  }

  public salvarRotina(dadosAcesso: any){

    let url: string = `${this.url}/financeiro/api/dashboard/salvaRotina`
    return this.http.post<any>(url,dadosAcesso);
  }

  public geraBolCliente(dadosBoleto: any){

    let url: string = `${this.url}/WSTFIN53`
    return this.http.post<any>(url,dadosBoleto);
  }
}
