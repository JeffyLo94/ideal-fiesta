/*
 * split-pane.components.ts
 * Jeffrey Lo, 2019-03-21
 */
import { Component, Input, ViewChild, ElementRef, HostListener, OnInit, AfterViewInit, ChangeDetectorRef, DoCheck } from '@angular/core';

/* split pane ( two panes with selectable width are shown )
  * add to nodes with these selected: pane-left, pane-right
  * @param minPaneSizeLeft the minimum pane size of the left pane in pixels
  * @param minPaneSizeRight the minimum pane size of the right pane in pixels
  * @param maxPaneSize (optional) the maximum pane size in pixels (0 = not active) of either 'left' or 'right' pane
  * @param splitPos (optional) the initial position of the splitter handle in percent, default: 50
  * @param visiblePane (optional) either 'both'(default), 'left' or 'right'.
  *        double clicking the splitter show only the left or right pane or does nothing
  * @param height (optional) sets height of split pane component
  * @param widthHandle (optional) width of the split handle in px (default: 8)
  * @param storageId (optional) id to store properties of the split pane in local storage
  *
  * <split-pane [min-pane-size]='250' [split-pos]='0' [height]='"100%"'[visible-pane]='"right"'>
  *  <div pane-left>
  *    This is the left pane
  *  </div>
  *  <div pane-right>
  *    This is the right pane
  *  </div>
  *</split-pane>
*/

@Component({
  selector: 'app-split-pane',
  templateUrl: './split-pane.component.html',
  styleUrls: ['./split-pane.component.css']
})
export class SplitPaneComponent implements OnInit, AfterViewInit, DoCheck {
  @Input() minPaneSizeLeft = 40;
  @Input() minPaneSizeRight = 40;

  @Input() maxPaneSize: ['left'|'right' , number];

  @Input() splitPos = 50;
  @Input() height = '100%';
  @Input() visiblePane: 'both'|'left'|'right' = 'both';
  @Input() widthHandle = 8;
  @Input() storageId = '';

  @ViewChild('container') container: ElementRef;

  private widthHandleCollapsed = 12;
  private lastWidthContainer = 0;
  private handlePosition: number;

  public widthContainer: number;
  public widthHandleActual = 0;
  public widthLeft: number;
  public widthRight: number;
  public paneHidden = false;
  public visibleLeft = 'inherit';
  public visibleRight = 'inherit';


  private mouseDown: boolean;
  private mouseDownPosition: {x: number, y: number};

  private dragging: boolean;
  private dragStart: number;
  private dragOriginal: number;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    switch (this.visiblePane) {
      case 'left':
      case 'right':
      case 'both':
        break;
      default:
        throw new Error('visiblePane must be "both", "left" or "right"');
    }
  }

  public downHandle(evt: MouseEvent) {
    this.mouseDown = true;
    this.mouseDownPosition = { x: evt.screenX, y: evt.screenY };
    if (this.paneHidden) {
      return;
    }
    this.dragStart = evt.screenX;
    this.dragOriginal = this.widthLeft;

    // block further click events
    if (evt.stopPropagation) { evt.stopPropagation(); }
    if (evt.preventDefault) { evt.preventDefault(); }
    evt.cancelBubble = true;
    evt.returnValue = false;
  }

  public upHandle(evt: MouseEvent) {
    if (!this.mouseDown) {
      this.dragging = false;
      return;
    }

    if (this.dragging) {
      if (!this.paneHidden) {
        this.showPane();
      }
    } else if (this.paneHidden) {
      this.showPane();
    } else {
      this.hidePane();
    }
    this.mouseDown = false;
    this.dragging = false;
  }

  public movingHandle(evt: MouseEvent) {
    if (!this.mouseDown) {
      return;
    }
    if (this.mouseDown && (evt.screenX !== this.mouseDownPosition.x || evt.screenY !== this.mouseDownPosition.y)) {
      this.dragging = true;
      let newPos: number = this.dragOriginal + evt.screenX - this.dragStart;
      newPos = Math.max(newPos, this.minPaneSizeLeft);
      newPos = Math.min(newPos, this.container.nativeElement.clientWidth - this.minPaneSizeRight);

      if (this.maxPaneSize && this.maxPaneSize.length === 2) {
        if (this.maxPaneSize[0] === 'left') {
          newPos = Math.min(newPos, this.maxPaneSize[1]);
        } else if (this.maxPaneSize[0] === 'right') {
          newPos = Math.max(newPos, this.maxPaneSize[1]);
        }
      }

      this.handlePosition = newPos / this.container.nativeElement.clientWidth;
      this.updateHandlePosition();
    }
  }

  public hidePane() {
    if (this.visiblePane === 'both' || this.paneHidden) {
      return;
    }

    this.paneHidden = true;
    this.visibleRight = this.paneHidden && this.visiblePane === 'left' ? 'none' : 'inherit';
    this.visibleLeft = this.paneHidden && this.visiblePane === 'right' ? 'none' : 'inherit';
    this.updateHandlePosition();
    // this.cdService.store(this, this.storageId);
  }

  public showPane() {
    if (this.visiblePane === 'both' || !this.paneHidden) {
      return;
    }

    this.paneHidden = false;
    this.visibleRight = this.paneHidden && this.visiblePane === 'left' ? 'none' : 'inherit';
    this.visibleLeft = this.paneHidden && this.visiblePane === 'right' ? 'none' : 'inherit';
    this.updateHandlePosition();
  }

  private updateHandlePosition() {
    this.widthContainer = this.container.nativeElement.clientWidth;
    let newPos: number = Math.round(this.handlePosition * this.widthContainer);
    newPos = Math.max(newPos, this.minPaneSizeLeft);
    newPos = Math.min(newPos, this.widthContainer - this.minPaneSizeRight);

    if (this.maxPaneSize && this.maxPaneSize.length === 2) {
      if (this.maxPaneSize[0] === 'left') {
        newPos = Math.min(newPos, this.maxPaneSize[1]);
      } else if (this.maxPaneSize[0] === 'right') {
        newPos = Math.max(newPos, this.maxPaneSize[1]);
      }
    }

    if (this.paneHidden) {
      this.widthHandleActual = this.widthHandleCollapsed;
      switch (this.visiblePane) {
      case 'left':
        newPos = this.widthContainer - this.widthHandleActual;
        break;
      case 'right':
        newPos = 0;
        break;
      }
    } else {
      this.widthHandleActual = this.widthHandle;
    }
    this.widthLeft = newPos;
    this.widthRight = this.widthContainer - newPos - this.widthHandleActual;
    // console.log('Width right: ' + this.widthRight + ' widthContainer: ' + this.widthContainer);
    // console.log(' newPos: ' + newPos + ' widthHandle: ' + this.widthHandleActual);

    // force update of all children because the size changed
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {
    // this.cdService.load(this, this.storageId);
  }
  ngAfterViewInit() {
    if (this.paneHidden) {
      this.visibleRight = this.paneHidden && this.visiblePane === 'left' ? 'none' : 'inherit';
      this.visibleLeft = this.paneHidden && this.visiblePane === 'right' ? 'none' : 'inherit';
    }

    this.handlePosition = this.splitPos / 100;
    this.updateHandlePosition();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.ngDoCheck();
  }

  ngDoCheck() {
    this.widthContainer = this.container.nativeElement.clientWidth;
    if (this.widthContainer !== this.lastWidthContainer) {
      this.lastWidthContainer = this.widthContainer;
      this.updateHandlePosition();
    }
  }

}
