import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetLgComponent } from './tweet-lg.component';

describe('TweetLgComponent', () => {
  let component: TweetLgComponent;
  let fixture: ComponentFixture<TweetLgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TweetLgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TweetLgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
