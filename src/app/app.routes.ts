import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ListComponent } from './products/list/list.component';
import { DetailsComponent } from './products/details/details.component';
import { EditorComponent } from './products/editor/editor.component';
import { AuthGuard } from './auth.guard';
import { AuthRedirectGuard } from './auth-redirect.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthRedirectGuard] },
  { path: 'products', component: ListComponent, canActivate: [AuthGuard] },
  { path: 'products/:id', component: DetailsComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: EditorComponent, canActivate: [AuthGuard] },
  { path: 'create', component: EditorComponent, canActivate: [AuthGuard] }
];
