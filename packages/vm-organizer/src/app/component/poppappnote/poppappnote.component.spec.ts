import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoppappnoteComponent } from './poppappnote.component';

describe('PoppappnoteComponent', () => {
  let component: PoppappnoteComponent;
  let fixture: ComponentFixture<PoppappnoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoppappnoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoppappnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
