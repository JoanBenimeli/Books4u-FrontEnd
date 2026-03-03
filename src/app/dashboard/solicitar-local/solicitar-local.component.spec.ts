import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarLocalComponent } from './solicitar-local.component';

describe('SolicitarLocalComponent', () => {
  let component: SolicitarLocalComponent;
  let fixture: ComponentFixture<SolicitarLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarLocalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitarLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
