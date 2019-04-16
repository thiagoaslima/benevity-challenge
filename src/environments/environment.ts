// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBA2aM64BGgSatdLXwiDK92aSW82ODaBR4',
    authDomain: 'weather-app-97336.firebaseapp.com',
    databaseURL: 'https://weather-app-97336.firebaseio.com',
    projectId: 'weather-app-97336',
    storageBucket: 'weather-app-97336.appspot.com',
    messagingSenderId: '311401339624'
  },
  openweather: {
    apiKey: '9aa0bfef4e240e8643deeb8be6cc52f3',
    url: '//api.openweathermap.org/data/2.5/forecast'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
