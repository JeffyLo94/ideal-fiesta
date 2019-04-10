import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() links: { text: string, path: string }[];
  @Input() displayLogo: boolean;
  @Input() view: string;

  constructor() { }

  ngOnInit() {
  }

}
