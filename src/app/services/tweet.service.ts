import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Tweet} from "../models/tweet";
import {Observable, of} from "rxjs";
import {User} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  newTweets: Tweet[];

  constructor(private http: HttpClient) { }

  getNewTweets(): Observable<Tweet[]> {
    return of(this.newTweets);
  }

  getTweet(id: number): Observable<Tweet> {
    return this.http.get<Tweet>(`/api/tweet/${id}`, {responseType: "json"});
  }

  getReplies(id: number): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(`/api/tweet/${id}/replies/0`);
  }

  getHome(page: number) {
    return this.http.get<Tweet[]>(`/api/${page}`, {responseType: "json"});
  }

  getTweetsByAuthor(tag: string, page: number) {
    return this.http.get<Tweet[]>(`/api/profile/${tag}/${page}`, {responseType: "json"});
  }

  likeTweet(id: number) {
    return this.http.post(`/api/tweet/${id}/like`, {});
  }

  retweet(id: number) {
    return this.http.post(`/api/tweet/${id}/retweet`, {});
  }

  removeLikedTweet(id: number) {
    return this.http.post(`/api/tweet/${id}/unlike`, {}, {responseType: "json"});
  }

  removeRetweet(id: number) {
    return this.http.post(`/api/tweet/${id}/removeRetweet`, {});
  }

  createTweet(content: string) {
    let formData = new FormData();
    formData.append('content', content);
    return this.http.post(`/api/compose`, formData);
  }

  deleteTweet(id: number) {
    return this.http.delete(`/api/tweet/${id}`);
  }

  replyToTweet(parentId: number, content: string) {
    let formData = new FormData();
    formData.append('content', content);
    return this.http.post(`/api/tweet/${parentId}/reply`, formData);
  }
}
