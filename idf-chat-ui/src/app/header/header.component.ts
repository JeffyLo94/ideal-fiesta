import { Component, OnInit, Input, ViewEncapsulation, Inject, EventEmitter, Output } from '@angular/core';
import { DOCUMENT } from '@angular/common';
// import { User } from 'firebase';

export interface HeaderLink {
  text: string;
  path: string;
  icon: string;
}
export interface HeaderUser {
  avatarUrl: string;
  name: string;
  // More to be added
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  @Input() links: HeaderLink[];
  @Input() displayLogo: boolean;
  @Input() label: string;
  @Input() user?: HeaderUser;
  @Input() hasLogin?: boolean = false;
  @Output() login?: EventEmitter<any> = new EventEmitter();
  @Output() logout?: EventEmitter<any> = new EventEmitter();

  // idemiaLogo = 'assets/idemiaLogo/IDEMIA-Logo-White-Transparent.svg';

  private readonly FS_ENABLE: string = 'fullscreen';
  private readonly FS_DISABLE: string = 'fullscreen_exit';

  private elem;
  fullscreenIcon = 'fullscreen';


  constructor(@Inject(DOCUMENT) private readonly doc: any) {
    this.fullscreenIcon = 'fullscreen';
   }

  ngOnInit() {
    this.elem = this.doc.documentElement;

    this.elem.webkitIsFullScreen ? (this.fullscreenIcon = this.FS_DISABLE) : (this.fullscreenIcon = this.FS_ENABLE);
    console.log(this.displayLogo);
    console.log('HEADER -- ',this.user)
    console.log(this.fullscreenIcon);
  }

  handleLogin() {
    console.log('login pressed - TODO change when authentication implemented');
    //emit event here
    this.login.emit();
  }

  handleLogout() {
    console.log('logout pressed - TODO change when authentication implemented');
    this.login.emit();
  }

  toggleFullscreen() {
    if (this.doc.webkitIsFullScreen) {
      console.log('clicked to exit');
      this._exitFullscreen();
      this.fullscreenIcon = this.FS_ENABLE;
    } else {
      console.log('clicked to full: ', this.doc.webkitIsFullScreen);
      this._activateFullscreen();
      this.fullscreenIcon = this.FS_DISABLE;
    }
  }

  /**
   * Activate Full Screen Mode.
   */
  private _activateFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  /**
   * Exits Full Screen Mode.
   */
  private _exitFullscreen() {
    if (this.doc.exitFullscreen) {
      this.doc.exitFullscreen();
    } else if (this.doc.mozCancelFullScreen) {
      /* Firefox */
      this.doc.mozCancelFullScreen();
    } else if (this.doc.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.doc.webkitExitFullscreen();
    } else if (this.doc.msExitFullscreen) {
      /* IE/Edge */
      this.doc.msExitFullscreen();
    }
  }

}
