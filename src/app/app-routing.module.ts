import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent  } from './chat/chat.component';


import { LoginComponent } from './login/login.component';
// import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // { path: 'sign-up', component: SignUpComponent },
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '/chat', component: ChatComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
