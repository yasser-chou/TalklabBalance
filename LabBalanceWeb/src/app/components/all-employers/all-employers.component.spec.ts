import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployersComponent } from './all-employers.component';

describe('AllEmployersComponent', () => {
  let component: AllEmployersComponent;
  let fixture: ComponentFixture<AllEmployersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllEmployersComponent]
    });
    fixture = TestBed.createComponent(AllEmployersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
