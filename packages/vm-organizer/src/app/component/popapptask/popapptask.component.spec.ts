import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopapptaskComponent } from './popapptask.component';

describe('PopapptaskComponent', () => {
  let component: PopapptaskComponent;
  let fixture: ComponentFixture<PopapptaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopapptaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopapptaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
