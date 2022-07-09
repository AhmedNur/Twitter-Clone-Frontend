import {Component, Input, OnInit} from '@angular/core';
import {TweetService} from "../services/tweet.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Tweet} from "../models/tweet";
import {AuthenticationService} from "../services/authentication.service";
import {ModalService} from "../services/modal.service";

@Component({
  selector: 'app-tweet-editor',
  templateUrl: './tweet-editor.component.html',
  styleUrls: ['./tweet-editor.component.css']
})
export class TweetEditorComponent implements OnInit {

  @Input() inModal: boolean;
  @Input() replying: boolean;

  formGroup = new FormGroup({
    tweetContent: new FormControl('')
  });

  constructor(private tweetService: TweetService, public auth: AuthenticationService, public modalService: ModalService) { }

  ngOnInit() {
  }

  createTweet() {
    if(this.formGroup.controls['tweetContent'].value != '' && this.formGroup.controls['tweetContent'].value.toString().length <= 280) {
      if(this.modalService.editorModalForReply){
        this.tweetService.replyToTweet(this.modalService.replyParentId, this.formGroup.controls['tweetContent'].value)
          .subscribe((id) => {
            let tweet = new Tweet();
            let currentUser = this.auth.userDetails.getValue();
            tweet.parentId = this.modalService.replyParentId;
            tweet.displayName = currentUser.displayName;
            tweet.tag = currentUser.tag;
            tweet.dateCreated = Date.now();
            tweet.content = this.formGroup.controls['tweetContent'].value.toString();
            tweet.likes = '0';
            tweet.retweets = '0';
            tweet.numOfReplies = '0';
            tweet.id = id;
            this.formGroup.controls['tweetContent'].setValue('');
            this.closeModal();
            this.tweetService.newTweets.unshift(tweet);
          }, () => {}, () => {});
      } else {
        this.tweetService.createTweet(this.formGroup.controls['tweetContent'].value).subscribe((id) => {
          let tweet = new Tweet();
          let currentUser = this.auth.userDetails.getValue();
          tweet.id = id;
          tweet.displayName = currentUser.displayName;
          tweet.tag = currentUser.tag;
          tweet.dateCreated = Date.now();
          tweet.content = this.formGroup.controls['tweetContent'].value.toString();
          tweet.likes = '0';
          tweet.retweets = '0';
          tweet.numOfReplies = '0';
          this.formGroup.controls['tweetContent'].setValue('');
          let editor = document.getElementById('tweet-editor-text-field');
          editor.style.height = 24 + 'px';
          this.closeModal();
          this.tweetService.newTweets.unshift(tweet);
        }, () => {
        }, () => {});
      }
    }
  }

  closeModal() {
    this.modalService.editorModalOpen = false;
    this.modalService.replyParentId = null;
    this.modalService.editorModalForReply = false;
  }

  increaseTextAreaHeightAndCheckTweetLength() {
    let editor = document.getElementById('tweet-editor-text-field');
    editor.style.height = 24 +"px";
    editor.style.height = editor.scrollHeight - 4 + "px";
    if(this.formGroup.controls['tweetContent'].value.toString().length > 280) {
      editor.style.backgroundColor = 'rgb(255, 184, 194)';
    } else {
      editor.style.backgroundColor = '#fff';
    }
  }
}
