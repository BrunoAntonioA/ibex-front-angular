import { TestBed } from '@angular/core/testing';

import { IbexService } from './ibex.service';

describe('IbexService', () => {
  let service: IbexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IbexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
