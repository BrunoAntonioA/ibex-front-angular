import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IbexComponent } from './ibex.component';

describe('IbexComponent', () => {
  let component: IbexComponent;
  let fixture: ComponentFixture<IbexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IbexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IbexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
