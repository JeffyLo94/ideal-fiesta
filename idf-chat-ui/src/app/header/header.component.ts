import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() links: { text: string, path: string }[];
  @Input() displayLogo: boolean;
  @Input() view: string;

  constructor( private readonly authService: AuthService) { }

  ngOnInit() {
  }

}
