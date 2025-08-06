import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ltnspilgquyrqbqmzpnz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bnNwaWxncXV5cnFicW16cG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDg4OTUsImV4cCI6MjA2OTc4NDg5NX0.xm04b_krex2Wq2yLs8jy0bHpizPze8gyQJCtBtR5-Uw';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public client: SupabaseClient; // ✅ Add this line

  constructor() {
    this.client = createClient(supabaseUrl, supabaseKey); // ✅ Assign to public property
  }

  // ✅ Signup
  async signUp(email: string, password: string) {
    return this.client.auth.signUp({ email, password });
  }

  // ✅ Login
  async login(email: string, password: string) {
    return this.client.auth.signInWithPassword({ email, password });
  }

  // ✅ Get current user
  async getCurrentUser() {
    const { data } = await this.client.auth.getUser();
    return data?.user;
  }

  // ✅ Get checklist by user
  async getChecklist(user_id: string) {
    const { data, error } = await this.client
      .from('checklist')
      .select('*')
      .eq('user_id', user_id);

    if (error) {
      console.error('❌ Supabase fetch error:', error.message);
      return [];
    }

    return data || [];
  }

  // ✅ Upsert checklist
  async upsertChecklist(user_id: string, date: string, task: string, status: boolean) {
    const { data, error } = await this.client
      .from('checklist')
      .upsert(
        { user_id, date, task, status },
        { onConflict: 'user_id,date,task' }
      );

    if (error) {
      console.error('❌ Supabase upsert error:', error.message);
    } else {
      console.log('✅ Checklist upserted:', data);
    }
  }

  async logout() {
    return this.client.auth.signOut();
  }
  // ✅ Get user profile (name, email, etc.)
async getUserProfile(user_id: string) {
  const { data, error } = await this.client
    .from('profiles')
    .select('name, email')
    .eq('id', user_id)
    .maybeSingle(); // get only one result

  if (error) {
    console.error('❌ Failed to fetch profile:', error.message);
    return null;
  }

  return data;
}

}
