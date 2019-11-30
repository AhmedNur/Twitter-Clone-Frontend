import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Tweet} from "../models/tweet";
import {TweetService} from "../services/tweet.service";
import {TweetComponent} from "../tweet/tweet.component";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit {
  parentTweetId: number;
  parentTweet: Tweet;
  replies: Tweet[];

  constructor(private route: ActivatedRoute, private tweetService: TweetService, private auth: AuthenticationService) {
  }

  ngOnInit() {
    this.parentTweetId = +this.route.snapshot.paramMap.get('id');
    this.getThread();
  }

  getThread() {
    this.tweetService.getTweet(this.parentTweetId).subscribe(tweet => {
      this.parentTweet = tweet;
    }, () => {
    }, () => {
      //If retrieved parentTweet is a retweet
      if (this.parentTweet.content == (null || undefined) && this.parentTweet.parentId != (null || undefined)) {
        //Set the parentTweet id to the id of the original post
        this.parentTweetId = this.parentTweet.parentId;
        //get that tweets thread instead
        this.getThread();
      } else {
        this.tweetService.getReplies(this.parentTweetId).subscribe(replies => {
          this.replies = replies
        }, () => {
        }, () => {
        });
        if (this.auth.userDetails.getValue().likedTweets.includes(this.parentTweet.id)) {
          this.parentTweet.liked = true;
        } else {
          this.parentTweet.liked = false;
        }

        if (this.auth.userDetails.getValue().parentIdToRetweetId.hasOwnProperty(this.parentTweet.id)) {
          this.parentTweet.retweeted = true;
          this.parentTweet.retweetId = this.auth.userDetails.getValue().parentIdToRetweetId[this.parentTweet.id];
        } else {
          this.parentTweet.retweeted = false;
        }

        let now = new Date();
        let diff = now.getTime() - this.parentTweet.dateCreated;
        if (diff < 60000) {
          this.parentTweet.timeSinceCreated = Math.floor(diff / 1000) + "s";
        } else if (diff < 3600000) {
          this.parentTweet.timeSinceCreated = Math.floor(diff / 60000) + "m";
        } else if (diff < 86400000) {
          this.parentTweet.timeSinceCreated = Math.floor(diff / 3600000) + "h";
        } else {
          let dateCreated = new Date(this.parentTweet.dateCreated);
          if (dateCreated.getFullYear() == now.getFullYear()) {
            this.parentTweet.timeSinceCreated = TweetComponent.months[dateCreated.getMonth()] + dateCreated.getDate();
          } else {
            this.parentTweet.timeSinceCreated = TweetComponent.months[dateCreated.getMonth()] + dateCreated.getDate() + ", " + dateCreated.getFullYear();
          }
        }
      }
    });
  }
}
