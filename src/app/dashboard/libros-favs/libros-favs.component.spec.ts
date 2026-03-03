import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrosFavsComponent } from './libros-favs.component';

describe('LibrosFavsComponent', () => {
  let component: LibrosFavsComponent;
  let fixture: ComponentFixture<LibrosFavsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrosFavsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibrosFavsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
