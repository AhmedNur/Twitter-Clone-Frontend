import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetEditorModalComponent } from './tweet-editor-modal.component';

describe('TweetEditorModalComponent', () => {
  let component: TweetEditorModalComponent;
  let fixture: ComponentFixture<TweetEditorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TweetEditorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TweetEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
