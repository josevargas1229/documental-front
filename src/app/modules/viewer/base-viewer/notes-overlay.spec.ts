import { TestBed } from '@angular/core/testing';

import { NotesOverlay } from './notes-overlay';

describe('NotesOverlay', () => {
  let service: NotesOverlay;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotesOverlay);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
