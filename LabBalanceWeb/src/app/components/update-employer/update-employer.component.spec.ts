import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmployerComponent } from './update-employer.component';

describe('UpdateEmployerComponent', () => {
  let component: UpdateEmployerComponent;
  let fixture: ComponentFixture<UpdateEmployerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateEmployerComponent]
    });
    fixture = TestBed.createComponent(UpdateEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
