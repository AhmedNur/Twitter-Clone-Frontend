import {Component, OnInit} from '@angular/core';
import {ModalService} from "../services/modal.service";
import {AuthenticationService} from "../services/authentication.service";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-navigation-pane',
  templateUrl: './navigation-pane.component.html',
  styleUrls: ['./navigation-pane.component.css']
})
export class NavigationPaneComponent implements OnInit {
  onHome: boolean;
  onProfile: boolean;
  inSettings: boolean;

  constructor(private modalService: ModalService, private auth: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    if (this.router.url == '/') {
      this.onHome = true;
      this.onProfile = false;
      this.inSettings = false;
    } else if (this.router.url == `/profile/${this.auth.userDetails.getValue().tag}`) {
      this.onProfile = true;
      this.onHome = false;
      this.inSettings = false;
    } else if (this.router.url == '/settings') {
      this.inSettings = true;
      this.onHome = false;
      this.onProfile = false;
    } else {
      this.inSettings = false;
      this.onHome = false;
      this.onProfile = false;
    }
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url == '/') {
          this.onHome = true;
          this.onProfile = false;
          this.inSettings = false;
        } else if (this.router.url == `/profile/${this.auth.userDetails.getValue().tag}`) {
          this.onProfile = true;
          this.onHome = false;
          this.inSettings = false;
        } else if (this.router.url == '/settings') {
          this.inSettings = true;
          this.onHome = false;
          this.onProfile = false;
        } else {
          this.inSettings = false;
          this.onHome = false;
          this.onProfile = false;
        }
      }
    });
  }

  openTweetEditorModal() {
    this.modalService.editorModalOpen = true;
  }

  logout() {
    this.auth.logout();
  }
}
