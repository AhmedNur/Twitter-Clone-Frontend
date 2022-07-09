import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  tag: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.tag = this.route.snapshot.paramMap.get('tag');
  }
}
