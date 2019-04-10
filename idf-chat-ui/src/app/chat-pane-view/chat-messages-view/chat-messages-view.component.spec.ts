import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessagesViewComponent } from './chat-messages-view.component';

describe('ChatMessagesViewComponent', () => {
  let component: ChatMessagesViewComponent;
  let fixture: ComponentFixture<ChatMessagesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatMessagesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatMessagesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
