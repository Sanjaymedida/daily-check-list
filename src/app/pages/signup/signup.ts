import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { SupabaseService } from '../../supabase';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class SignupComponent {
  name: string = '';        // ✅ New field
  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async signUp() {
    const { data, error } = await this.supabaseService.signUp(this.email, this.password);

    if (error) {
      this.message = `❌ Error: ${error.message}`;
      return;
    }

    const user = data.user;

    // ✅ Save name to `profiles` table
    if (user){
    const { error: profileError } = await this.supabaseService.client
      .from('profiles')
      .upsert({ id: user.id, email: this.email, name: this.name });

    if (profileError) {
      this.message = `✅ Account created, but failed to save name: ${profileError.message}`;
    } else {
      this.message = '✅ Signup successful!';
    }

    this.router.navigate(['/login']);
  }
}
}
