import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupdoctorComponent } from './signupdoctor.component';

describe('SignupdoctorComponent', () => {
  let component: SignupdoctorComponent;
  let fixture: ComponentFixture<SignupdoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupdoctorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupdoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
