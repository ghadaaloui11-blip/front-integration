import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampagneDetail } from './campagne-detail';

describe('CampagneDetail', () => {
  let component: CampagneDetail;
  let fixture: ComponentFixture<CampagneDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampagneDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampagneDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
