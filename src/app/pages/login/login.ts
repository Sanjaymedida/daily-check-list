import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../supabase';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private supabase: SupabaseService, private router: Router) {}

  async login() {
    try {
      const { error, data } = await this.supabase.login(this.email, this.password);
      if (error) {
        this.errorMessage = error.message;
      } else {
        console.log('✅ Logged in:', data);
        this.router.navigate(['/']);
      }
    } catch (err: any) {
      this.errorMessage = 'Login failed. Please try again.';
      console.error('Login error:', err);
    }
  }
}
