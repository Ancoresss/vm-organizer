import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopappformeditComponent } from './popappformedit.component';

describe('PopappformeditComponent', () => {
  let component: PopappformeditComponent;
  let fixture: ComponentFixture<PopappformeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopappformeditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopappformeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
