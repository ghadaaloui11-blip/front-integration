import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampagneCreate } from './campagne-create';

describe('CampagneCreate', () => {
  let component: CampagneCreate;
  let fixture: ComponentFixture<CampagneCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampagneCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampagneCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
