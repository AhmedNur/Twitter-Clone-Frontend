import {Component, OnInit} from '@angular/core';
import {ModalService} from "../services/modal.service";

@Component({
  selector: 'app-tweet-editor-modal',
  templateUrl: './tweet-editor-modal.component.html',
  styleUrls: ['./tweet-editor-modal.component.css']
})
export class TweetEditorModalComponent implements OnInit {

  constructor(private modalService: ModalService) {
  }

  ngOnInit() {
  }

  clickedOut($event: MouseEvent) {
    this.modalService.editorModalOpen = false;
    this.modalService.editorModalForReply = false;
    this.modalService.replyParentId = null;
  }

  clickedIn($event: MouseEvent) {
    $event.stopPropagation();
  }
}
