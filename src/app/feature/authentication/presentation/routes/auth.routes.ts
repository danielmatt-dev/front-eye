import { Routes } from '@angular/router';
import { AccessComponent } from '../access/access.component';
import { LoginComponent } from '../login/login.component';

export default [
    { path: 'access', component: AccessComponent },
    { path: 'login', component: LoginComponent }
] as Routes;
