import { Routes } from '@angular/router';
import { Feed } from './feed/feed';
import { LoginComponent } from './login/login.component';
import { CreatePost } from './create-post/create-post';

export const routes: Routes = [
  { path: '', component: Feed }, // Home page par Feed dikhao
  { path: 'login', component: LoginComponent }, // /login par Login page
  { path: 'create', component: CreatePost }, // New Route
];
