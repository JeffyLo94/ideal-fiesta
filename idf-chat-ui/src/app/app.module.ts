import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';


import { MatToolbarModule, MatListModule, MatCardModule, MatButtonModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SplitPaneComponent } from './split-pane/split-pane.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HeaderComponent } from './header/header.component';
import { ChatPaneViewComponent } from './chat-pane-view/chat-pane-view.component';
import { ChatHeaderComponent } from './chat-pane-view/chat-header/chat-header.component';
import { ChatMessagesViewComponent } from './chat-pane-view/chat-messages-view/chat-messages-view.component';
import { ChatBoxFieldComponent } from './chat-pane-view/chat-box-field/chat-box-field.component';

@NgModule({
  declarations: [
    AppComponent,
    SplitPaneComponent,
    ChatPageComponent,
    HomePageComponent,
    HeaderComponent,
    ChatPaneViewComponent,
    ChatHeaderComponent,
    ChatMessagesViewComponent,
    ChatBoxFieldComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
