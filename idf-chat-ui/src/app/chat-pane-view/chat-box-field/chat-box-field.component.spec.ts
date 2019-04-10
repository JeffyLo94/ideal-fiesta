import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoxFieldComponent } from './chat-box-field.component';

describe('ChatBoxFieldComponent', () => {
  let component: ChatBoxFieldComponent;
  let fixture: ComponentFixture<ChatBoxFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatBoxFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBoxFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
