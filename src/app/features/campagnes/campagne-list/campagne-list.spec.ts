import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { CampagneListComponent } from './campagne-list';

describe('CampagneListComponent', () => {
  let component: CampagneListComponent;
  let fixture: ComponentFixture<CampagneListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampagneListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CampagneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute a clamped collection percentage', () => {
    expect(component.pourcentage({ objectif_montant: 100, montant_collecte: 50 } as never)).toBe(50);
    expect(component.pourcentage({ objectif_montant: 100, montant_collecte: 500 } as never)).toBe(100);
    expect(component.pourcentage({ objectif_montant: 0, montant_collecte: 50 } as never)).toBe(0);
  });
});
