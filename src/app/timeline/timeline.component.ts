import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Tweet} from "../models/tweet";
import {TweetService} from "../services/tweet.service";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  @Input() tag: string;
  @Input() tweets: Tweet[];
  newTweets: Tweet[];
  page: number;
  scrollDebounce: boolean;

  constructor(private tweetService: TweetService, private auth: AuthenticationService) {
  }

  ngOnInit() {
    this.scrollDebounce = true;
    this.page = 0;
    if (this.tag == undefined && this.tweets == undefined) {
      this.tweetService.getHome(this.page).subscribe(tweets => {
        this.tweets = tweets;
      });
    } else if (this.tweets == undefined) {
      this.tweetService.getTweetsByAuthor(this.tag, this.page).subscribe(tweets => {
        this.tweets = tweets;
      });
    }
    this.tweetService.newTweets = [];
    this.tweetService.getNewTweets().subscribe(newTweets => {
      this.newTweets = newTweets;
    });
  }

  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    let timeline = document.getElementById('timeline');
    if (window.scrollY > (timeline.offsetHeight + timeline.offsetTop) - 1000) {
      if (this.scrollDebounce) {
        this.scrollDebounce = false;
        this.page++;
        if (this.tag == undefined) {
          this.tweetService.getHome(this.page).subscribe(tweets => {
            this.tweets = this.tweets.concat(tweets);
          });
        } else {
          this.tweetService.getTweetsByAuthor(this.tag, this.page).subscribe(tweets => {
            this.tweets = this.tweets.concat(tweets);
          });
        }
        setTimeout(function () {
          this.scrollDebounce = true
        }.bind(this), 500);
      }
    }
  }
}
