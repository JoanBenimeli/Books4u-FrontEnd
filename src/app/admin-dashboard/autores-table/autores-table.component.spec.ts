import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoresTableComponent } from './autores-table.component';

describe('AutoresTableComponent', () => {
  let component: AutoresTableComponent;
  let fixture: ComponentFixture<AutoresTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoresTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutoresTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
