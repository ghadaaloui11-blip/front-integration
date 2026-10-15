import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampagneList } from './campagne-list';

describe('CampagneList', () => {
  let component: CampagneList;
  let fixture: ComponentFixture<CampagneList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampagneList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampagneList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
