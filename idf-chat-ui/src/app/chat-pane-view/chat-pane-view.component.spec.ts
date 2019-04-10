import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPaneViewComponent } from './chat-pane-view.component';

describe('ChatPaneViewComponent', () => {
  let component: ChatPaneViewComponent;
  let fixture: ComponentFixture<ChatPaneViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatPaneViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPaneViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
