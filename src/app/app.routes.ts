import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent ,canActivate: [authGuard]},
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent }
];


// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule {}
