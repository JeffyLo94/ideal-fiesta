import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { AccountCreationComponent } from './account-creation/account-creation.component';

const appRoutes: Routes = [
  // TODO: Add Routes as pages added.
  { path: '', component: HomePageComponent },
  { path: 'chat', component: ChatPageComponent },
  { path: 'login', component: LoginComponent},
  { path: 'new-account', component: AccountCreationComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forRoot(appRoutes, {useHash: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
