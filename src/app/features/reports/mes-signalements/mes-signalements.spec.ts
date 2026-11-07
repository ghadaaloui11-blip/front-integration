import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { MesSignalementsComponent } from './mes-signalements';

describe('MesSignalementsComponent', () => {
  let component: MesSignalementsComponent;
  let fixture: ComponentFixture<MesSignalementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesSignalementsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MesSignalementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
