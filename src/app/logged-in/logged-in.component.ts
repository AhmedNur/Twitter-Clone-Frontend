import {Component, HostListener, OnInit} from '@angular/core';
import {ModalService} from "../services/modal.service";

@Component({
  selector: 'app-logged-in-homepage',
  templateUrl: './logged-in.component.html',
  styleUrls: ['./logged-in.component.css']
})
export class LoggedInComponent implements OnInit {

  constructor(private modalService: ModalService) {
  }

  ngOnInit() {
  }

  @HostListener('click', ['$event.target'])
  onClick() {
    if (this.modalService.tweetOptionModalOpen.getValue() == true) {
      this.modalService.tweetOptionModalOpen.next(false);
    }
  }

}
