import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { PublicReportsComponent } from './public-reports';

describe('PublicReportsComponent', () => {
  let component: PublicReportsComponent;
  let fixture: ComponentFixture<PublicReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicReportsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
