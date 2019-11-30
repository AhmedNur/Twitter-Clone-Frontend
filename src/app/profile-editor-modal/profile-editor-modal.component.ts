import {Component, Input, OnInit} from '@angular/core';
import {ModalService} from "../services/modal.service";
import {FormControl, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../services/user.service";

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

  constructor(private modalService: ModalService, private auth: AuthenticationService,
              private router: Router, private userService: UserService) {
  }

  ngOnInit() {
  }

  clickedOut() {
    this.auth.usernameTaken = false;
    this.auth.tagTaken = false;
    this.modalService.profileEditorModalOpen = false;
    this.auth.updateUserData().subscribe(data => {
      this.auth.userDetails.next(data)
    })
  }

  clickedIn($event) {
    $event.stopPropagation();
  }

  save() {
    if (this.inRegistration) {
      this.auth.register(this.formGroup.controls['username'].value, this.formGroup.controls['password'].value,
        this.formGroup.controls['displayName'].value, this.formGroup.controls['tag'].value).subscribe(() => {
        this.auth.authenticate(this.formGroup.controls['username'].value, this.formGroup.controls['password'].value);
      }, err => {
        if (err instanceof HttpErrorResponse) {
          if (err.error == 'username') {
            this.auth.usernameTaken = true;
          } else if (err.error == 'tag') {
            this.auth.tagTaken = true;
          }
        }
      });
    } else {
      if (this.formGroup.controls['displayName'].value != this.auth.userDetails.getValue().displayName ||
        this.formGroup.controls['bio'].value != this.auth.userDetails.getValue().bio ||
        this.formGroup.controls['tag'].value != this.auth.userDetails.getValue().tag) {
        this.userService.updateProfile(this.formGroup.controls['tag'].value, this.formGroup.controls['displayName'].value, this.formGroup.controls['bio'].value).subscribe(() => {},
          err => {
            if (err instanceof HttpErrorResponse) {
              if(err.error == "tag") {
                this.auth.tagTaken = true;
              }
            }
          }, () => {
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
              this.router.navigate(['profile/', this.formGroup.controls['tag'].value]);
              this.clickedOut()
            });
          });
      }
    }
  }
}
