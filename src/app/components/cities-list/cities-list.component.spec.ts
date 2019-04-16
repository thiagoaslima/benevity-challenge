import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { CitiesListComponent } from './cities-list.component';
import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'wt-host',
  template: '<wt-cities-list [list]="list"></wt-cities-list>'
})
class TestHostComponent {
  @Input() list = [];
}

describe('CitiesListComponent', () => {
  let fixture: DebugElement;
  let component: CitiesListComponent;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule],
      declarations: [TestHostComponent, CitiesListComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    fixture = hostFixture.debugElement.query(By.directive(CitiesListComponent));
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    hostFixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a list of cities', () => {
    hostComponent.list = [
      { id: 1, name: 'city', country: 'CY' },
      { id: 2, name: 'city2', country: 'CY' }
    ];
    hostFixture.detectChanges();
    const links = fixture.queryAll(By.css('a'));
    expect(links.length).toBe(2);
    expect(links.map(link => link.nativeElement.innerText)).toEqual([
      'city, CY',
      'city2, CY'
    ]);
    expect(links.map(link => link.nativeElement.getAttribute('href'))).toEqual([
      '/cities/1',
      '/cities/2'
    ]);
  });
});
