import { TestBed } from '@angular/core/testing';

import { RenderCanvas } from './render-canvas';

describe('RenderCanvas', () => {
  let service: RenderCanvas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenderCanvas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
