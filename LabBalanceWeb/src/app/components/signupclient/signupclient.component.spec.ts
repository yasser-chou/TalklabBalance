import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupclientComponent } from './signupclient.component';

describe('SignupclientComponent', () => {
  let component: SignupclientComponent;
  let fixture: ComponentFixture<SignupclientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignupclientComponent]
    });
    fixture = TestBed.createComponent(SignupclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
