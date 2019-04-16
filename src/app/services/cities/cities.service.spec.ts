import { CitiesService } from './cities.service';
import { of } from 'rxjs';

class AngularFireDatabaseMock {
  list(query: string): any {
    return {
      valueChanges() {
        return of([
          {
            id: 1,
            name: 'Rio de Janeiro',
            country: 'BR'
          },
          {
            id: 2,
            name: 'Calgary',
            country: 'CA'
          }
        ]);
      }
    };
  }
}

describe('CitiesService', () => {
  let service: CitiesService;
  const firebase = new AngularFireDatabaseMock();

  beforeEach(() => {
    service = new CitiesService(firebase as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update cities list', done => {
    service.list$.subscribe(resp => {
      expect(resp).toEqual([
        {
          id: 2,
          name: 'Calgary',
          country: 'CA'
        }
      ]);
      done();
    });
    service.search('Calg');
  });
});
