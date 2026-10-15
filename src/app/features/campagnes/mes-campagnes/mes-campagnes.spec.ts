import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesCampagnes } from './mes-campagnes';

describe('MesCampagnes', () => {
  let component: MesCampagnes;
  let fixture: ComponentFixture<MesCampagnes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesCampagnes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesCampagnes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
