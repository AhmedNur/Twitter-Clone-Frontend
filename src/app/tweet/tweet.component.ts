import {Component, Input, OnInit} from '@angular/core';
import {Tweet} from "../models/tweet";
import {TweetService} from "../services/tweet.service";
import {AuthenticationService} from "../services/authentication.service";
import {ModalService} from "../services/modal.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit {
  @Input() tweet: Tweet;
  optionsOpen: boolean;
  deleted: boolean;
  static months = [
    'Jan ',
    'Feb ',
    'Mar ',
    'Apr ',
    'May ',
    'Jun ',
    'Jul ',
    'Aug ',
    'Sept ',
    'Oct ',
    'Nov ',
    'Dec '
  ];

  constructor(private tweetService: TweetService, private auth: AuthenticationService, private modalService: ModalService, private router: Router) {
  }

  ngOnInit() {
    this.prepareTweet();
    this.optionsOpen = false;
    this.deleted = false;
    this.modalService.tweetOptionModalOpen.subscribe(tweetOptionModalOpen => {
      if (tweetOptionModalOpen == false) {
        this.optionsOpen = false;
      }
    });
  }

  prepareTweet() {
    if (this.tweet.content == (null || undefined) && this.tweet.parentId != (null || undefined)) {
      this.tweetService.getTweet(this.tweet.parentId).subscribe(parentTweet => {
        let retweetId = this.tweet.id;
        this.tweet = parentTweet;
        this.tweet.retweetId = retweetId;
        this.prepareTweet();
      })
    } else {
      if (this.auth.userDetails.getValue().likedTweets.includes(this.tweet.id)) {
        this.tweet.liked = true;
      }
      if (this.auth.userDetails.getValue().parentIdToRetweetId.hasOwnProperty(this.tweet.id)) {
        this.tweet.retweeted = true;
        this.tweet.retweetId = this.auth.userDetails.getValue().parentIdToRetweetId[this.tweet.id];
      }
      this.setTweetTime();
    }
  }

  setTweetTime() {
    let now = new Date();
    let diff = now.getTime() - this.tweet.dateCreated;
    if (diff < 1000) {
      this.tweet.timeSinceCreated = 'Now';
    } else if (diff < 60000) {
      this.tweet.timeSinceCreated = Math.floor(diff / 1000) + "s";
    } else if (diff < 3600000) {
      this.tweet.timeSinceCreated = Math.floor(diff / 60000) + "m";
    } else if (diff < 86400000) {
      this.tweet.timeSinceCreated = Math.floor(diff / 3600000) + "h";
    } else {
      let dateCreated = new Date(this.tweet.dateCreated);
      if (dateCreated.getFullYear() == now.getFullYear()) {
        this.tweet.timeSinceCreated = TweetComponent.months[dateCreated.getMonth()] + dateCreated.getDate();
      } else {
        this.tweet.timeSinceCreated = TweetComponent.months[dateCreated.getMonth()] + dateCreated.getDate() + ", " + dateCreated.getFullYear();
      }
    }
  }

  likeTweet($event) {
    $event.stopPropagation();
    this.tweetService.likeTweet(this.tweet.id).subscribe(() => {
    }, err => {
    }, () => {
      this.tweet.likes = (+this.tweet.likes + 1).toString();
      this.auth.updateUserData().subscribe(data => {
        this.auth.userDetails.next(data);
      }, err => {
      }, () => this.prepareTweet());
      this.tweet.liked = true;
    });
  }

  retweet($event) {
    $event.stopPropagation();
    this.tweetService.retweet(this.tweet.id).subscribe(() => {
    }, err => {
    }, () => {
      this.tweet.retweets = (+this.tweet.retweets + 1).toString();
      this.auth.updateUserData().subscribe(data => {
        this.auth.userDetails.next(data);
      }, err => {
      }, () => this.prepareTweet());
      this.tweet.retweeted = true;
    });
  }

  removeLikedTweet($event) {
    $event.stopPropagation();
    this.tweetService.removeLikedTweet(this.tweet.id).subscribe(() => {
    }, err => {
    }, () => {
      this.tweet.likes = (+this.tweet.likes - 1).toString();
      this.auth.updateUserData().subscribe(data => {
        this.auth.userDetails.next(data);
      }, err => {
      }, () => this.prepareTweet());
      this.tweet.liked = false;
    });
  }

  removeRetweet($event) {
    $event.stopPropagation();
    this.tweetService.removeRetweet(this.tweet.retweetId).subscribe(() => {
    }, () => {
    }, () => {
      this.tweet.retweets = (+this.tweet.retweets - 1).toString();
      this.auth.updateUserData().subscribe(data => {
        this.auth.userDetails.next(data);
      }, err => {
      }, () => this.prepareTweet());
      this.tweet.retweeted = false;
    });
  }

  openOptions($event) {
    $event.stopPropagation();
    this.optionsOpen = true;
    this.modalService.tweetOptionModalOpen.next(true);
  }

  delete($event) {
    $event.stopPropagation();
    this.tweetService.deleteTweet(this.tweet.id).subscribe(() => {
      this.deleted = true;
      this.optionsOpen = false;
    }, () => {
      this.deleted = false;
    }, () => {
    });
  }

  openReplyModal($event) {
    $event.stopPropagation();
    this.modalService.editorModalOpen = true;
    this.modalService.editorModalForReply = true;
    this.modalService.replyParentId = this.tweet.id;
  }

  openThread() {
    this.router.navigate([`/tweet/${this.tweet.id}`]);
  }

  stopPropogation($event) {
    $event.stopPropagation();
  }
}
