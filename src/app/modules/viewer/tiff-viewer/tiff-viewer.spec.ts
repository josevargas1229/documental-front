import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiffViewer } from './tiff-viewer';

describe('TiffViewer', () => {
  let component: TiffViewer;
  let fixture: ComponentFixture<TiffViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiffViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiffViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
