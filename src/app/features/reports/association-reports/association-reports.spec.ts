import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationReports } from './association-reports';

describe('AssociationReports', () => {
  let component: AssociationReports;
  let fixture: ComponentFixture<AssociationReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociationReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
