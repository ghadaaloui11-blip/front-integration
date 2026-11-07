import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { API_BASE } from '../config/api-base.token';
import {
  SignalementService,
  classeStatut,
  labelStatut,
} from './signalement.service';

describe('SignalementService (US06/US32/US33)', () => {
  let service: SignalementService;
  let http: HttpTestingController;
  const base = 'http://localhost:5000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE, useValue: base },
      ],
    });
    service = TestBed.inject(SignalementService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('listerPublic appelle /api/signalement/public sans token de filtre', () => {
    service.listerPublic().subscribe();
    const req = http.expectOne(`${base}/api/signalement/public`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('statut')).toBeNull();
    req.flush([]);
  });

  it('listerPublic transmet le filtre statut', () => {
    service.listerPublic('en_cours').subscribe();
    const req = http.expectOne(`${base}/api/signalement/public?statut=en_cours`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('listerMes appelle /api/signalement/mes', () => {
    service.listerMes().subscribe();
    const req = http.expectOne(`${base}/api/signalement/mes`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('listerPrisesEnCharge appelle /api/signalement/mes-prises-en-charge', () => {
    service.listerPrisesEnCharge().subscribe();
    const req = http.expectOne(`${base}/api/signalement/mes-prises-en-charge`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('prendreEnCharge POST sur /:id/prendre-en-charge', () => {
    service.prendreEnCharge(7).subscribe();
    const req = http.expectOne(`${base}/api/signalement/7/prendre-en-charge`);
    expect(req.request.method).toBe('POST');
    req.flush({ signalement: { id: 7, statut: 'en_cours' } });
  });

  it('changerStatut PATCH /:id/statut avec le statut cible', () => {
    service.changerStatut(7, 'resolu').subscribe();
    const req = http.expectOne(`${base}/api/signalement/7/statut`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ statut: 'resolu' });
    req.flush({ signalement: { id: 7, statut: 'resolu' } });
  });

  describe('labelStatut / classeStatut', () => {
    it('traduit les trois statuts', () => {
      expect(labelStatut('recu')).toBe('Reçu');
      expect(labelStatut('en_cours')).toBe('En cours');
      expect(labelStatut('resolu')).toBe('Résolu');
      expect(labelStatut(undefined)).toBe('Reçu');
    });

    it('associe une classe CSS distincte a chaque statut', () => {
      expect(classeStatut('recu')).toBe('statut-recu');
      expect(classeStatut('en_cours')).toBe('statut-en-cours');
      expect(classeStatut('resolu')).toBe('statut-resolu');
    });
  });
});
