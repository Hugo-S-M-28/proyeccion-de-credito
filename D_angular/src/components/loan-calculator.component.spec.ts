import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { LoanCalculatorComponent } from './loan-calculator.component';
import { LoanService } from '../app/loan.service';

describe('LoanCalculatorComponent', () => {
  let component: LoanCalculatorComponent;
  let fixture: ComponentFixture<LoanCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanCalculatorComponent],
      providers: [LoanService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debe ser inválido al inicializarse con campos nulos', () => {
    expect(component.loanForm.valid).toBeFalsy();
  });

  it('debe requerir un monto principal válido', () => {
    const principalControl = component.loanForm.get('principal');
    expect(principalControl?.valid).toBeFalsy();
    
    principalControl?.setValue(1000);
    expect(principalControl?.valid).toBeTruthy();
  });
});
