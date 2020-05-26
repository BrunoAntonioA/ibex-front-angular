import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FnctionComponent } from './fnction.component';

describe('FnctionComponent', () => {
  let component: FnctionComponent;
  let fixture: ComponentFixture<FnctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FnctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FnctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
