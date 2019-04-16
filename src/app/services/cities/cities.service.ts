import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { ICity } from 'models/city';
import { Subject, of, BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, switchMap, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  private readonly DB_KEY = '/cities2';
  private search$ = new Subject<string>();

  list$: Observable<ICity[]> = this.search$.pipe(
    distinctUntilChanged(),
    switchMap(searchTerm => {
      return searchTerm && searchTerm.length >= 3
        ? this.filterByCityName(searchTerm)
        : of([]);
    })
  );

  selected$ = new BehaviorSubject<ICity | null>(null);

  constructor(private database: AngularFireDatabase) {}

  search(term: string): void {
    this.search$.next(this.normalize(term));
  }

  select(city: ICity) {
    this.selected$.next(city);
  }

  private filterByCityName(name: string): Observable<ICity[]> {
    const { DB_KEY, database } = this;
    return database
      .list<ICity>(DB_KEY, ref =>
        ref
          .orderByKey()
          .startAt(name)
          .limitToFirst(15)
      )
      .valueChanges()
      .pipe(
        map(cities => {
          return cities.filter(city =>
            this.normalize(city.name).includes(name)
          );
        })
      );
  }

  private normalize(term: string): string {
    return term
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z]+/g, '');
  }
}
