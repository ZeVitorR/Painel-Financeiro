import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-master',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './master.component.html',
  styleUrl: './master.component.css'
})
export class MasterComponent implements OnInit{
  private route = inject(Router);

  ngOnInit(): void {
    this.route.navigate(['painel'])
  }
}
