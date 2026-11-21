import { MyBookings } from './components/my-bookings/my-bookings';
import { authGuard } from './guards/auth-guard';import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Stations } from './components/stations/stations';
import { Station } from './components/station/station';
import { Login } from './components/login/login';
import { Register } from './components/register/register';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'stations', component: Stations },
  { path: 'stations/:id', component: Station },
  { path: 'login', component: Login },
  { path: 'my-bookings', component: MyBookings, canActivate: [authGuard] },
  { path: 'register', component: Register }
];