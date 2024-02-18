import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopappformComponent } from './popappform.component';

describe('PopappformComponent', () => {
  let component: PopappformComponent;
  let fixture: ComponentFixture<PopappformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopappformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopappformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
