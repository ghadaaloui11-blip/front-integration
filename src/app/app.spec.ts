import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => localStorage.removeItem('token'));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the right shell on non-auth pages (visitor vs connected)', () => {
    const fixture = TestBed.createComponent(AppComponent);
    // Le routeur de test demarre sur '/' (accueil) : forcer une page interieure
    // pour exercer les deux branches de layout du template.
    spyOn(fixture.componentInstance, 'isAuthPage').and.returnValue(false);
    spyOn(fixture.componentInstance, 'isAccueilPage').and.returnValue(false);

    // Visiteur non connecte : navbar legere, pas de sidebar.
    localStorage.removeItem('token');
    fixture.detectChanges();
    let compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.visitor-logo')?.textContent).toContain('MennaFina');
    expect(compiled.querySelector('.sidebar')).toBeFalsy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();

    // Utilisateur connecte : sidebar avec logo.
    localStorage.setItem('token', 'token-de-test');
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.sidebar .logo')?.textContent).toContain('MennaFina');
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should expose an auth page check for /login and /inscription', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.isAuthPage()).toBeFalse();
  });
});
