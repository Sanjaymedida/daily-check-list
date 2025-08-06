import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { SupabaseService } from './supabase';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  return supabase.getCurrentUser().then(user => {
    if (!user) {
      router.navigate(['/login']);
      return false;
    }
    return true;
  });
};

