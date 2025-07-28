import { Component } from '@angular/core';
import { PoComponentsModule } from "@po-ui/ng-components";

@Component({
  selector: 'app-meu-painel',
  standalone: true,
  imports: [PoComponentsModule],
  templateUrl: './meu-painel.component.html',
  styleUrl: './meu-painel.component.css'
})
export class MeuPainelComponent {

}
