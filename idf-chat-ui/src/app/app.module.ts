import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import { MatToolbarModule,
  MatListModule,
  MatCardModule,
  MatButtonModule,
  MatLabel,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

// App
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
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatListItemComponent } from './chat-list/chat-list-item/chat-list-item.component';
import { ReversePipe } from './pipes/reverse.pipe';
import { AccountCreationComponent } from './account-creation/account-creation.component';
import { AccountFormComponent } from './account-creation/account-form/account-form.component';


let fbconfig = {
  apiKey: 'AIzaSyB1D7okzUuAH_V2aVVAGH-IinTjCm0QXWU',
  authDomain: 'ideal-fiesta.firebaseapp.com',
  databaseURL: 'https://ideal-fiesta.firebaseio.com',
  projectId: 'ideal-fiesta',
  storageBucket: 'ideal-fiesta.appspot.com',
  messagingSenderId: '344869506367'
};

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
    ChatBoxFieldComponent,
    LoginComponent,
    ChatListComponent,
    ChatListItemComponent,
    ReversePipe,
    AccountCreationComponent,
    AccountFormComponent
  ],
  imports: [
    AngularFireModule.initializeApp(fbconfig),
    AngularFireAuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
