import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { AssociationReportsComponent } from './association-reports';

describe('AssociationReportsComponent', () => {
  let component: AssociationReportsComponent;
  let fixture: ComponentFixture<AssociationReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationReportsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AssociationReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
