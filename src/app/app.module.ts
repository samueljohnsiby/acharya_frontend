import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Import provideHttpClient
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MarkdownModule } from 'ngx-markdown';

import { ChatComponent  } from './chat/chat.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MarkdownModule.forRoot() ,
    RouterModule.forRoot([
      // Define your application routes here
      { path: '', component: ChatComponent }
    ])
  ],
  providers: [
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp({"projectId":"socraticbot-4bc8c","appId":"1:47141419868:web:6c6674a4653e59b60edf99","storageBucket":"socraticbot-4bc8c.appspot.com","apiKey":"AIzaSyAa6TUEJ0gc-YFQxQEciPBxfYtl9RnHWxg","authDomain":"socraticbot-4bc8c.firebaseapp.com","messagingSenderId":"47141419868"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()) // Provide HttpClient here
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
