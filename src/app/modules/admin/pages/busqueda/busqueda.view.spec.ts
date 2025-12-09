import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaView } from './busqueda.view';

describe('BusquedaView', () => {
  let component: BusquedaView;
  let fixture: ComponentFixture<BusquedaView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedaView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusquedaView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
