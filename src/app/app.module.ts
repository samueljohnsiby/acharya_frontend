import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Import provideHttpClient
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MarkdownModule } from 'ngx-markdown';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from './environments/environment';
import { ChatComponent  } from './chat/chat.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { LoginComponent } from './login/login.component';
// import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthGuard } from './auth.guard';
import { SignUpComponent } from './signup/signup.component';  // Import the guard




@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    SignUpComponent,
    // SignUpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
   
    AngularFireAuthModule,
    MarkdownModule.forRoot() ,
    RouterModule.forRoot([
      // Define your application routes here
      { path: 'chat', component: ChatComponent,canActivate: [AuthGuard] },
      { path: '', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignUpComponent },


    ])
  ],
  providers: [
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp({"projectId":environment.projectId,"appId":environment.appId,"storageBucket":environment.storageBucket,"apiKey":environment.apiKey,"authDomain":environment.authDomain,"messagingSenderId":environment.messagingSenderId})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()) // Provide HttpClient here
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
