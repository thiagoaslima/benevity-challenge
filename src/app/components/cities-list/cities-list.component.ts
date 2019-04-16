import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  Inject,
  ChangeDetectorRef,
  OnDestroy,
  ViewChildren,
  ElementRef,
  QueryList,
  AfterViewInit,
  PLATFORM_ID
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ICity } from 'models/city';
import { Subject, fromEvent } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'wt-cities-list',
  templateUrl: './cities-list.component.html',
  styleUrls: ['./cities-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CitiesListComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  private listItemHeight: number;

  selectionIdx = 0;

  @Input() list: ICity[] = [];
  @Output() selected = new EventEmitter<ICity>();
  @ViewChildren('listItem') listItems: QueryList<ElementRef<HTMLLIElement>>;

  get citiesList() {
    return this.list.map(city => {
      return {
        href: this.getHref(city.id),
        name: [city.name, city.country].join(', ')
      };
    });
  }

  constructor(
    private host: ElementRef,
    private cdr: ChangeDetectorRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  private getHref(id: number) {
    return id ? `/cities/${id}` : '';
  }
  private selectNextItem() {
    if (this.selectionIdx < this.list.length - 1) {
      this.selectionIdx++;
      this.cdr.detectChanges();
      this.scroll();
    }
  }
  private selectPreviousItem() {
    if (this.selectionIdx > 0) {
      this.selectionIdx--;
      this.cdr.detectChanges();
      this.scroll();
    }
  }

  private selectCity() {
    const city = this.list[this.selectionIdx];
    this.selected.emit(city);
    this.router.navigateByUrl(this.getHref(city.id));
  }

  private scroll() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const el: HTMLElement = this.host.nativeElement.parentElement;
    const top = this.selectionIdx * this.listItemHeight;

    if ('scrollBehavior' in document.documentElement.style) {
      el.scrollTo({
        top,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      el.scrollTop = top;
    }
  }

  ngOnInit() {
    fromEvent(this.document, 'keyup')
      .pipe(
        map((event: KeyboardEvent) => {
          return event.key;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(key => {
        switch (key) {
          case 'Down': // IE/Edge specific value
          case 'ArrowDown':
            this.selectNextItem();
            break;

          case 'Up': // IE/Edge specific value
          case 'ArrowUp':
            this.selectPreviousItem();
            break;

          case 'Enter':
            this.selectCity();
        }
      });
  }

  ngAfterViewInit() {
    this.listItemHeight =
      isPlatformBrowser(this.platformId) && this.listItems.first
        ? this.listItems.first.nativeElement.getBoundingClientRect().height
        : 0;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
