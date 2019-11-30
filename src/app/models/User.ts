export class User {
  id: number;
  username: string;
  roles: string[];
  tag: string;
  displayName: string;
  bio: string;
  dateCreated: string;
  tweets: number[];
  retweets: number[];
  followed: number[];
  followedText: string;
  followers: number[];
  followersText: string;
  likedTweets: number[];
  parentIdToRetweetId: Object;
}
