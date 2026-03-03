import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalesTableComponent } from './locales-table.component';

describe('LocalesTableComponent', () => {
  let component: LocalesTableComponent;
  let fixture: ComponentFixture<LocalesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalesTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocalesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
