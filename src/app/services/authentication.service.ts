import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {User} from "../models/User";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authenticated = new BehaviorSubject(false);
  userDetails = new BehaviorSubject<User>(null);
  isLoaded = false;
  badCredentials = false;
  usernameTaken = false;
  tagTaken = false;

  constructor(private http: HttpClient, private router: Router) { }

  authenticate(username: string, password: string) {
    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    this.http.post("https://twitter.ahmednur.me/api/authenticate", formData, {responseType: 'text', observe: "response"}).subscribe(resp => {
        this.updateUserData();
        location.reload();
    }, () => {
      this.badCredentials = true;
    });
  }

  register(username: string, password: string, displayName: string, tag: string) {
    this.usernameTaken = false;
    this.tagTaken = false;
    let formData = new FormData();
    formData.append('username', username);
    formData.append('tag', tag);
    formData.append('displayName', displayName);
    formData.append('password', password);
    return this.http.post('https://twitter.ahmednur.me/api/register', formData);
  }

  logout() {
    this.http.get('https://twitter.ahmednur.me/api/logout').subscribe(() => {
      location.reload();
    });
  }

  updateUserData() {
      return this.http.get<User>("https://twitter.ahmednur.me/api/me", {responseType: "json"});
  }

}
