import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { CampagneCreateComponent } from './campagne-create';

describe('CampagneCreateComponent', () => {
  let component: CampagneCreateComponent;
  let fixture: ComponentFixture<CampagneCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampagneCreateComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CampagneCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark an empty form as invalid', () => {
    expect(component.form.invalid).toBeTrue();
  });
});
