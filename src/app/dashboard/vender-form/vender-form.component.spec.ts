import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderFormComponent } from './vender-form.component';

describe('VenderFormComponent', () => {
  let component: VenderFormComponent;
  let fixture: ComponentFixture<VenderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenderFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VenderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
