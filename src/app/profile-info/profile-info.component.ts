import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TweetService} from "../services/tweet.service";
import {User} from "../models/User";
import {AuthenticationService} from "../services/authentication.service";
import {ModalService} from "../services/modal.service";

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {
  @Input() tag: string;
  user: User;

  constructor(private route: ActivatedRoute, private tweetService: TweetService, public auth: AuthenticationService,
              public modalService: ModalService) { }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.tweetService.getProfile(this.tag).subscribe(user => {
      this.user = user;
      if(this.user.followed.length <  10000) {
        this.user.followedText = this.user.followed.length.toString();
      } else if (this.user.followed.length < 1000000) {
        this.user.followedText = this.user.followed.length.toString().slice(0, -3) + "K";
      } else {
        this.user.followedText = this.user.followed.length.toString().slice(0, -6) + "M";
      }

      if(this.user.followers.length <  10000) {
        this.user.followersText = this.user.followers.length.toString();
      } else if (this.user.followers.length < 1000000) {
        this.user.followersText = this.user.followers.length.toString().slice(0, -3) + "K";
      } else {
        this.user.followersText = this.user.followers.length.toString().slice(0, -6) + "M";
      }
    });
  }

  onHover($event) {
    ($event.currentTarget as HTMLInputElement).innerHTML = 'Unfollow';
  }

  releaseHover($event) {
    ($event.currentTarget as HTMLInputElement).innerHTML = 'Following';
  }

  follow() {
    this.tweetService.follow(this.tag).subscribe(() => {
      this.auth.updateUserData().subscribe(data => {
        this.auth.userDetails.next(data);
      });
    });
  }

  unfollow() {
    this.tweetService.unfollow(this.tag).subscribe(() => {
      this.auth.updateUserData().subscribe(data => {
        this.auth.userDetails.next(data);
      });
    });
  }

  openProfileEditor() {
    this.modalService.profileEditorModalOpen = true;
  }
}
