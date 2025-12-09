import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseViewer } from './base-viewer';

describe('BaseViewer', () => {
  let component: BaseViewer;
  let fixture: ComponentFixture<BaseViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
