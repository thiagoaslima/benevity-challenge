import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpResponse,
  HttpInterceptor,
  HttpHandler
} from '@angular/common/http';

import { CacheService, ICacheValueType } from './cache.service';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cache: CacheService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const cachedResponse = this.cache.get(request);
    let tempCache: Observable<HttpEvent<any>>;

    if (!cachedResponse) {
      tempCache = this.sendRequest(request, next, this.cache).pipe(
        shareReplay(1)
      );
      this.cache.put(request, tempCache, ICacheValueType.observable);
      return tempCache;
    }

    const ret: Observable<HttpEvent<any>> =
      cachedResponse.type === 'observable'
        ? (cachedResponse.response as Observable<HttpEvent<any>>)
        : of(cachedResponse.response as HttpEvent<any>);

    return ret;
  }

  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler,
    cache: CacheService
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          cache.put(req, event);
        }
      })
    );
  }
}
