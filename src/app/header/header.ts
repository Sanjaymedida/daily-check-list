import { Component,Input } from '@angular/core';
import { HomeComponent } from '../pages/home/home';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
   
})
export class HeaderComponent {
  @Input() userName: string = '';
}
