import { TestBed } from '@angular/core/testing';

import { OcrOverlay } from './ocr-overlay';

describe('OcrOverlay', () => {
  let service: OcrOverlay;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OcrOverlay);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
