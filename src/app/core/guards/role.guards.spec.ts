import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { authGuard, citoyenGuard } from './role.guards';

const route = {} as ActivatedRouteSnapshot;
const state = {} as RouterStateSnapshot;

function setToken(role?: string) {
  const payload = role ? btoa(JSON.stringify({ role })) : null;
  localStorage.setItem('token', payload ? `header.${payload}.signature` : 'not-a-jwt');
}

describe('guards', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRouter([])],
    });
    localStorage.removeItem('token');
  });

  afterEach(() => localStorage.removeItem('token'));

  describe('authGuard', () => {
    const run = () => TestBed.runInInjectionContext(() => authGuard(route, state));

    it('should redirect anonymous visitors to /login', () => {
      const result = run();
      expect(result instanceof UrlTree).toBeTrue();
      expect((result as UrlTree).toString()).toBe('/login');
    });

    it('should allow logged-in users', () => {
      setToken('citoyen');
      expect(run()).toBeTrue();
    });

    it('should allow any present token (backend performs real validation)', () => {
      setToken();
      expect(run()).toBeTrue();
    });
  });

  describe('citoyenGuard', () => {
    const run = () => TestBed.runInInjectionContext(() => citoyenGuard(route, state));

    it('should redirect anonymous visitors to /login', () => {
      const result = run();
      expect(result instanceof UrlTree).toBeTrue();
      expect((result as UrlTree).toString()).toBe('/login');
    });

    it('should allow citizens', () => {
      setToken('citoyen');
      expect(run()).toBeTrue();
    });

    it('should allow admins', () => {
      setToken('admin');
      expect(run()).toBeTrue();
    });

    it('should block associations', () => {
      setToken('association');
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      expect(run()).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/association-reports']);
    });
  });
});
