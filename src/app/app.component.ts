import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {AuthenticationService} from "./services/authentication.service";
import {Tweet} from "./models/tweet";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Twitter-Clone-Frontend';
  tweet = new Tweet();

  public constructor(private titleService: Title, public auth: AuthenticationService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle("Twitter Clone");
    this.auth.updateUserData().subscribe(data => {
      if(data.username == 'anonymoususer') {
        this.auth.authenticated.next(false);
        this.auth.userDetails.next(data);
      } else {
        this.auth.authenticated.next(true);
        this.auth.userDetails.next(data);
      }
    }, err => {}, () => this.auth.isLoaded = true);
  }
}
