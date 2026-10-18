import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DonComponent } from './don';
import { Don, DonService } from '../../../core/services/don.service';

describe('DonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DonComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should apply a preset amount to the form', () => {
    const fixture = TestBed.createComponent(DonComponent);
    fixture.componentInstance.setMontant(50);
    expect(fixture.componentInstance.form.controls.montant.value).toBe(50);
  });

  it('should not call the service when the amount is invalid', () => {
    const fixture = TestBed.createComponent(DonComponent);
    const spy = spyOn(TestBed.inject(DonService), 'creerDon');

    fixture.componentInstance.submit();

    expect(fixture.componentInstance.form.controls.montant.touched).toBeTrue();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should produce a receipt on successful donation', () => {
    const fixture = TestBed.createComponent(DonComponent);
    const don: Don = {
      id: 1,
      reference: 'DON-2026-1234',
      campagne_id: 0,
      montant: 25,
      est_anonyme: false,
      nom: 'Test User',
      message: null,
      date: '2026-10-18T10:00:00.000Z',
      statut: 'Don enregistré (paiement simulé)',
    };
    spyOn(TestBed.inject(DonService), 'creerDon').and.returnValue(of(don));

    fixture.componentInstance.setMontant(25);
    fixture.componentInstance.submit();

    expect(fixture.componentInstance.receipt()?.reference).toBe('DON-2026-1234');
    expect(fixture.componentInstance.error()).toBe('');
    expect(fixture.componentInstance.loading()).toBeFalse();
  });

  it('should display the server error message', () => {
    const fixture = TestBed.createComponent(DonComponent);
    spyOn(TestBed.inject(DonService), 'creerDon').and.returnValue(
      throwError(() => ({ error: { erreur: 'Montant invalide.' } })),
    );

    fixture.componentInstance.setMontant(10);
    fixture.componentInstance.submit();

    expect(fixture.componentInstance.error()).toBe('Montant invalide.');
    expect(fixture.componentInstance.loading()).toBeFalse();
  });
});
