import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerosTableComponent } from './generos-table.component';

describe('GenerosTableComponent', () => {
  let component: GenerosTableComponent;
  let fixture: ComponentFixture<GenerosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerosTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
