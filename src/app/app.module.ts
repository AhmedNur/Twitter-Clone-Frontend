import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoggedOutComponent} from './logged-out/logged-out.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {LoadingSplashComponent} from './loading-splash/loading-splash.component';
import {TweetComponent} from './tweet/tweet.component';
import {LoggedInComponent} from './logged-in/logged-in.component';
import {TimelineComponent} from './timeline/timeline.component';
import {NavigationPaneComponent} from './navigation-pane/navigation-pane.component';
import {TweetEditorComponent} from './tweet-editor/tweet-editor.component';
import {TweetEditorModalComponent} from './tweet-editor-modal/tweet-editor-modal.component';
import {AppRoutingModule} from './app-routing.module';
import {ThreadComponent} from './thread/thread.component';
import {HomeComponent} from './home/home.component';
import {TweetLgComponent} from './tweet-lg/tweet-lg.component';
import {ProfileComponent} from './profile/profile.component';
import {HeaderComponent} from './header/header.component';
import {ProfileInfoComponent} from './profile-info/profile-info.component';
import {ProfileEditorModalComponent} from './profile-editor-modal/profile-editor-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoggedOutComponent,
    LoadingSplashComponent,
    TweetComponent,
    LoggedInComponent,
    TimelineComponent,
    NavigationPaneComponent,
    TweetEditorComponent,
    TweetEditorModalComponent,
    ThreadComponent,
    HomeComponent,
    TweetLgComponent,
    TweetLgComponent,
    ProfileComponent,
    HeaderComponent,
    ProfileInfoComponent,
    ProfileEditorModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
