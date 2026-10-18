import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { CreateReportComponent } from './report.component';

describe('CreateReportComponent', () => {
  let component: CreateReportComponent;
  let fixture: ComponentFixture<CreateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateReportComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
