import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum ICacheValueType {
  value = 'value',
  observable = 'observable'
}

const maxAge = 10 * 60 * 1000; // 10 minutes
@Injectable({
    providedIn: 'root'
})
export class CacheService {
  cache = new Map();

  get(
    request: HttpRequest<any>
  ):
    | {
        response: HttpResponse<any> | Observable<HttpResponse<any>>;
        type: ICacheValueType;
      }
    | undefined {
    const url = request.urlWithParams;
    const cached = this.cache.get(url);

    if (!cached) {
      return undefined;
    }

    const isExpired = cached.lastRead < Date.now() - maxAge;

    if (isExpired) {
      this.cache.delete(url);
      return undefined;
    }

    return { response: cached.response, type: cached.type };
  }

  put(
    req: HttpRequest<any>,
    response: HttpResponse<any> | Observable<any>,
    type: ICacheValueType = ICacheValueType.value
  ): void {
    const url = req.urlWithParams;
    const entry = { url, response, type, lastRead: Date.now() };
    this.cache.set(url, entry);

    const expired = Date.now() - maxAge;
    this.cache.forEach(expiredEntry => {
      if (expiredEntry.lastRead < expired) {
        this.cache.delete(expiredEntry.url);
      }
    });
  }
}
