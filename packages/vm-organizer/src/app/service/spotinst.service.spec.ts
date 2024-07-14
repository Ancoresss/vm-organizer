import { TestBed } from '@angular/core/testing';

import { SpotinstService } from './spotinst.service';

describe('SpotinstService', () => {
  let service: SpotinstService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotinstService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
