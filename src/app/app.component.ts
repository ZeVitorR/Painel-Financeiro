import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { MasterComponent } from "./componentes/master/master.component";
import { ProAppConfigService } from '@totvs/protheus-lib-core';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MasterComponent
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public ambiente: string = environment.ambiente
  private appConfig = inject(ProAppConfigService)

  constructor(){
    if( this.appConfig.insideProtheus()){
      this.appConfig.loadAppConfig();
    }
  }

}
