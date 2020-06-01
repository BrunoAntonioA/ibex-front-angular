import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbosComponent } from './ambos.component';

describe('AmbosComponent', () => {
  let component: AmbosComponent;
  let fixture: ComponentFixture<AmbosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmbosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
