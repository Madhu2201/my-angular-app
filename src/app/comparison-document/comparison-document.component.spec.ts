import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonDocumentComponent } from './comparison-document.component';

describe('ComparisonDocumentComponent', () => {
  let component: ComparisonDocumentComponent;
  let fixture: ComponentFixture<ComparisonDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComparisonDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
