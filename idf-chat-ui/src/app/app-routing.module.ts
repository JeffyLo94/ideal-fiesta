import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HeaderComponent } from './header/header.component';

const appRoutes: Routes = [
  // TODO: Add Routes as pages added.
  { path: '', component: HomePageComponent },
  { path: 'chat', component: ChatPageComponent }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forRoot(appRoutes, {useHash: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
