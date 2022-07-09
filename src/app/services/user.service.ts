import {Injectable} from '@angular/core';
import {User} from "../models/User";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getProfile(tag: string) {
    return this.http.get<User>(`/api/profile/${tag}`);
  }

  follow(tag: string) {
    return this.http.post(`/api/profile/${tag}/follow`, {});
  }

  unfollow(tag: string) {
    return this.http.post(`/api/profile/${tag}/unfollow`, {});
  }

  updateProfile(tag: string, displayname: string, bio: string) {
    let formData = new FormData();
    formData.append('tag', tag);
    formData.append('displayName', displayname);
    formData.append('bio', bio);
    return this.http.post(`/api/me/update`, formData);
  }
}
