import { Component } from '@angular/core';
import { PainelComponent } from '../painel/painel.component';

@Component({
  selector: 'app-master',
  standalone: true,
  imports: [
    PainelComponent
  ],
  templateUrl: './master.component.html',
  styleUrl: './master.component.css'
})
export class MasterComponent {

}
