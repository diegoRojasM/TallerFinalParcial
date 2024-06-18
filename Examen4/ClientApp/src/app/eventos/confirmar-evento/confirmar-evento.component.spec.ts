import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarEventoComponent } from './confirmar-evento.component';

describe('ConfirmarEventoComponent', () => {
  let component: ConfirmarEventoComponent;
  let fixture: ComponentFixture<ConfirmarEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmarEventoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
