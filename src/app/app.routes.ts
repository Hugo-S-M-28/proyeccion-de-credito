// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoanCalculatorComponent } from './loan-calculator/loan-calculator.component';

export const routes: Routes = [
  { path: '', redirectTo: '/loan-calculator', pathMatch: 'full' },
  { path: 'loan-calculator', component: LoanCalculatorComponent },
  // Puedes agregar más rutas aquí en el futuro
];
