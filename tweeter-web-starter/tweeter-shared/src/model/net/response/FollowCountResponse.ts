import { TweeterResponse } from './TweeterResponse';

export interface FollowCountResponse extends TweeterResponse {
  followerCount: number;
  followeeCount: number;
}
