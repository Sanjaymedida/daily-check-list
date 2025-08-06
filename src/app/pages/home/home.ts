import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header';
import { SupabaseService } from '../../supabase';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']  // ✅ fixed typo
})
export class HomeComponent implements OnInit {
  today = new Date();
  selectedDate = new Date();
  userName: string = '';

  taskList = [
    'Exercise', 'Chia Seeds', 'Egg', 'English',
    'General awareness', 'Reasoning', 'Quant'
  ];
  checklistData: { [date: string]: { [task: string]: boolean } } = {};

  // Sidebar and user
  isSidebarOpen: boolean = false;
  userEmail: string = '';
  user_id: string = '';

  constructor(private supabase: SupabaseService, private router: Router) {}

  async ngOnInit() {
    const user = await this.supabase.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.userEmail = user.email ?? '';
    this.user_id = user.id;

     const profile = await this.supabase.getUserProfile(this.user_id);
  if (profile) {
    this.userName = profile.name ?? ''; // <-- store name
  }

    const data = await this.supabase.getChecklist(this.user_id);
    data.forEach((item: any) => {
      if (!this.checklistData[item.date]) {
        this.checklistData[item.date] = {};
      }
      this.checklistData[item.date][item.task] = item.status;
    });
  }

  // toggleSidebar(): void {
  //   this.isSidebarOpen = !this.isSidebarOpen;
  // }

  // closeSidebar(): void {
  //   this.isSidebarOpen = false;
  // }
  toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
  document.body.style.overflow = this.isSidebarOpen ? 'hidden' : 'auto';
}

closeSidebar() {
  this.isSidebarOpen = false;
  document.body.style.overflow = 'auto';
}


  async logout(): Promise<void> {
    await this.supabase.logout();
    this.router.navigate(['/login']);
  }

  getFormattedDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  get surroundingDates(): Date[] {
    const dates = [];
    for (let i = -5; i <= 5; i++) {
      const d = new Date(this.today);
      d.setDate(d.getDate() + i);
      dates.push(new Date(d));
    }
    return dates;
  }

  get selectedDateChecklist(): { task: string; status: boolean }[] {
    const dateStr = this.getFormattedDate(this.selectedDate);
    const tasks = this.checklistData[dateStr] || {};
    return this.taskList.map(task => ({
      task,
      status: tasks[task] || false,
    }));
  }

  onDateSelect(event: any): void {
    const selected = new Date(event.target.value);
    if (!isNaN(selected.getTime())) {
      this.selectedDate = selected;
    }
  }

  getTaskStatus(task: string, dateStr: string): boolean {
    return this.checklistData[dateStr]?.[task] || false;
  }

  toggleTask(task: string, dateStr: string): void {
    if (this.isFutureDate(dateStr) || this.isPastDate(dateStr)) return;

    if (!this.checklistData[dateStr]) this.checklistData[dateStr] = {};

    const newStatus = !this.getTaskStatus(task, dateStr);
    this.checklistData[dateStr][task] = newStatus;

    this.supabase.upsertChecklist(this.user_id, dateStr, task, newStatus);
  }

  goToToday(): void {
    this.selectedDate = new Date();
  }

  isToday(dateStr: string): boolean {
    return dateStr === this.getFormattedDate(this.today);
  }

  isPastDate(dateStr: string): boolean {
    return new Date(dateStr) < new Date(this.getFormattedDate(this.today));
  }

  isFutureDate(dateStr: string): boolean {
    return new Date(dateStr) > new Date(this.getFormattedDate(this.today));
  }

  pageSize = 10;
  currentPage = 1;

  get pagedDates(): Date[] {
    const totalDays = 60;
    const allDates: Date[] = [];
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(this.today);
      date.setDate(date.getDate() - i);
      allDates.push(date);
    }
    const start = (this.currentPage - 1) * this.pageSize;
    return allDates.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(60 / this.pageSize);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  hoverIndex: number = -1;

  addTask(index: number): void {
    const newTask = prompt('Enter new task name:');
    if (newTask && !this.taskList.includes(newTask)) {
      this.taskList.splice(index + 1, 0, newTask);
      this.saveChecklist();
    }
  }

  deleteTask(index: number): void {
    const taskToRemove = this.taskList[index];
    this.taskList.splice(index, 1);
    for (const date in this.checklistData) {
      delete this.checklistData[date][taskToRemove];
    }
    this.saveChecklist();
  }

  saveChecklist(): void {
    const dateStr = this.getFormattedDate(this.selectedDate);
    for (const task of this.taskList) {
      const status = this.checklistData[dateStr]?.[task] || false;
      this.supabase.upsertChecklist(this.user_id, dateStr, task, status);
    }
  }
}
