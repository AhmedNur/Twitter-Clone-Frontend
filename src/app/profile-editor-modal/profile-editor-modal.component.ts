import {Component, Input, OnInit} from '@angular/core';
import {ModalService} from "../services/modal.service";
import {FormControl, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {TweetService} from "../services/tweet.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-profile-editor-modal',
  templateUrl: './profile-editor-modal.component.html',
  styleUrls: ['./profile-editor-modal.component.css']
})
export class ProfileEditorModalComponent implements OnInit {
  @Input() inRegistration: boolean;
  formGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    displayName: new FormControl(this.auth.userDetails.getValue().displayName),
    tag: new FormControl(this.auth.userDetails.getValue().tag),
    bio: new FormControl(this.auth.userDetails.getValue().bio)
  });

  constructor(public modalService: ModalService, public auth: AuthenticationService, private tweetService: TweetService,
              private router: Router) { }

  ngOnInit() {
  }

  clickedOut() {
    this.auth.usernameTaken = false;
    this.auth.tagTaken = false;
    this.modalService.profileEditorModalOpen = false;
  }

  clickedIn($event) {
    $event.stopPropagation();
  }

  save() {
    if(this.inRegistration){
      this.auth.register(this.formGroup.controls['username'].value, this.formGroup.controls['password'].value,
      this.formGroup.controls['displayName'].value, this.formGroup.controls['tag'].value).subscribe(() => {
        this.auth.authenticate(this.formGroup.controls['username'].value, this.formGroup.controls['password'].value);
      }, err => {
        if(err instanceof HttpErrorResponse) {
          if(err.error == 'username') {
            this.auth.usernameTaken = true;
          } else if(err.error == 'tag') {
            this.auth.tagTaken = true;
          }
        }
      });
    } else {
      if(this.formGroup.controls['displayName'].value != this.auth.userDetails.getValue().displayName) {
        this.tweetService.changeDisplayName(this.formGroup.controls['displayName'].value).subscribe(() => {
          let user = this.auth.userDetails.getValue();
          user.displayName = this.formGroup.controls['displayName'].value;
          this.auth.userDetails.next(user);
        });
      }
      if(this.formGroup.controls['bio'].value != this.auth.userDetails.getValue().bio) {
        this.tweetService.changeBio(this.formGroup.controls['bio'].value).subscribe(() => {
          let user = this.auth.userDetails.getValue();
          user.bio = this.formGroup.controls['bio'].value;
          this.auth.userDetails.next(user);
        });
      }
      if(this.formGroup.controls['tag'].value != this.auth.userDetails.getValue().tag) {
        this.tweetService.changeTag(this.formGroup.controls['tag'].value).subscribe(() => {
          let user = this.auth.userDetails.getValue();
          user.tag = this.formGroup.controls['tag'].value;
          this.auth.userDetails.next(user);
          this.router.navigate(['/profile', user.tag]).finally(function() {
            location.reload();
          });
        }, err => {
          if(err instanceof HttpErrorResponse) {
            if(err.error == 'tag'){
              this.auth.tagTaken = true;
            }
          }
        });
      } else {
        this.clickedOut();
      }
    }
  }
}
