import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FluigService {
  private http = inject(HttpClient);
  private url:string = 'https://thomasie156267.fluig.cloudtotvs.com.br'

  constructor() { }

  public processes(): Observable<Array<any>>{
    let url: string = `${this.url}/process-management/api/v2/processes`
    return this.http.get<Array<any>>(url);
  }
}
