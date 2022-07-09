import {Component, Input, OnInit} from '@angular/core';
import {Tweet} from "../models/tweet";
import {TweetService} from "../services/tweet.service";
import {AuthenticationService} from "../services/authentication.service";
import {ModalService} from "../services/modal.service";
import {TweetComponent} from "../tweet/tweet.component";

@Component({
  selector: 'app-tweet-lg',
  templateUrl: './tweet-lg.component.html',
  styleUrls: ['./tweet-lg.component.css']
})
export class TweetLgComponent implements OnInit {
  @Input() tweet: Tweet;
  parent: Tweet;
  optionsOpen: boolean;
  deleted: boolean;

  constructor(private tweetService: TweetService, public auth: AuthenticationService, public modalService: ModalService) { }

  ngOnInit() {
    this.prepareTweet();
    this.optionsOpen = false;
    this.deleted = false;
    this.modalService.tweetOptionModalOpen.subscribe(tweetOptionModalOpen => {
      if(tweetOptionModalOpen == false){
        this.optionsOpen = false;
      }
    });
  }

  prepareTweet() {
    if (this.tweet.parentId !== (null || undefined) && this.tweet.content !== (null || undefined)) {
      this.tweetService.getTweet(this.tweet.parentId).subscribe(parentTweet => {
        this.parent = parentTweet;
      });
    } else if (this.tweet.content == (null || undefined) && this.tweet.parentId != (null || undefined)) {
      this.tweetService.getTweet(this.tweet.parentId).subscribe(parentTweet => {
        let retweetId = this.tweet.id;
        this.tweet = parentTweet;
        this.tweet.retweetId = retweetId;
        this.prepareTweet();
      });
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
    let dateCreated = new Date(this.tweet.dateCreated);
    this.tweet.timeSinceCreated = dateCreated.toLocaleTimeString('en-us', {hour: 'numeric', minute: 'numeric', hour12: true}) + " · " + TweetComponent.months[dateCreated.getMonth()] + dateCreated.getDate() + ", " + dateCreated.getFullYear();
  }

  likeTweet($event) {
    $event.stopPropagation();
    this.tweetService.likeTweet(this.tweet.id).subscribe(() => {}, err => {}, () => {
      this.tweet.likes = (+this.tweet.likes + 1).toString();
      this.auth.updateUserData().subscribe(data => {
        this.auth.userDetails.next(data);
      }, err => {}, () => this.prepareTweet());
      this.tweet.liked = true;
    });
  }

  retweet($event) {
    $event.stopPropagation();
    this.tweetService.retweet(this.tweet.id).subscribe(() => {}, err => {}, () => {
      this.tweet.retweets = (+this.tweet.retweets + 1).toString();
      this.auth.updateUserData().subscribe(data => {
        this.auth.userDetails.next(data);
      }, err => {}, () => this.prepareTweet());
      this.tweet.retweeted = true;
    });
  }

  removeLikedTweet($event) {
    $event.stopPropagation();
    this.tweetService.removeLikedTweet(this.tweet.id).subscribe(() => {}, err => {}, () => {
      this.tweet.likes = (+this.tweet.likes - 1).toString();
      this.auth.updateUserData().subscribe(data => {
        this.auth.userDetails.next(data);
      }, err => {}, () => this.prepareTweet());
      this.tweet.liked = false;
    });
  }

  removeRetweet($event) {
    $event.stopPropagation();
    this.tweetService.removeRetweet(this.tweet.retweetId).subscribe(() => {}, () => {}, () => {
      this.tweet.retweets = (+this.tweet.retweets - 1).toString();
      this.auth.updateUserData().subscribe(data => {
        this.auth.userDetails.next(data);
      }, err => {}, () => this.prepareTweet());
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
    }, () => {});
  }

  openReplyModal($event) {
    $event.stopPropagation();
    this.modalService.editorModalOpen = true;
    this.modalService.editorModalForReply = true;
    this.modalService.replyParentId = this.tweet.id;
  }
}
