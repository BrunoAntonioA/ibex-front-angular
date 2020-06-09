import { TestBed } from '@angular/core/testing';

import { ApisolverService } from './apisolver.service';

describe('ApisolverService', () => {
  let service: ApisolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApisolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
