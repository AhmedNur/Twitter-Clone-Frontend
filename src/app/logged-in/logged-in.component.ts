import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ModalService} from "../services/modal.service";
import {TimelineComponent} from "../timeline/timeline.component";

@Component({
  selector: 'app-logged-in-homepage',
  templateUrl: './logged-in.component.html',
  styleUrls: ['./logged-in.component.css']
})
export class LoggedInComponent implements OnInit {

  constructor(public modalService: ModalService) { }

  ngOnInit() {
  }

  @HostListener('click', ['$event.target'])
  onClick() {
    if(this.modalService.tweetOptionModalOpen.getValue() == true) {
      this.modalService.tweetOptionModalOpen.next(false);
    }
  }

}
