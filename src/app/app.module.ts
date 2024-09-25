import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Import provideHttpClient
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MarkdownModule } from 'ngx-markdown';

import { ChatComponent  } from './chat/chat.component';

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
    provideHttpClient() // Provide HttpClient here
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
