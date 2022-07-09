import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  editorModalOpen: boolean;
  editorModalForReply: boolean;
  profileEditorModalOpen: boolean;
  replyParentId: number;
  tweetOptionModalOpen = new BehaviorSubject(false);

  constructor() { }
}
