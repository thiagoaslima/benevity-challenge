## Weather App

### Benevity Developer Trial

The challenge asked for consume some public API. 
In this project, the service used is OpenWeatherMap API.


## Prerequisites 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.6.

After installing the Node and NPM, you must install the angular-cli.

```bash

npm install -g @angular/cli

```

## Table of Contents

- [Weather App](#weather-app)
  - [Benevity Developer Trial](#benevity-developer-trial)
- [Prerequisites](#prerequisites)
- [Table of Contents](#table-of-contents)
- [Demo](#demo)
- [Running it locally](#running-it-locally)
  - [Clone the project](#clone-the-project)
  - [Access the base folder](#access-the-base-folder)
  - [Install the dependencies](#install-the-dependencies)
  - [Run the code as production server](#run-the-code-as-production-server)
  - [Run the code as development server](#run-the-code-as-development-server)
  - [Build the code](#build-the-code)
    - [Notes](#notes)
    - [Test](#test)
- [License](#license)

## Demo 

If you want to use (*or test*) the application, you can access it on [http://thlima.com/benevity/#/cities/5913490](http://thlima.com/benevity/#/cities/5913490)

## Running it locally 

If you prefer to test it on your local machine, follow these steps:

**BEFORE YOU START:** please read the [prerequisites](#prerequisites)

### Clone the project 

```

git clone https://github.com/thiagoaslima/benevity-challenge.git

```

### Access the base folder 

```

cd benevity-challenge

```

### Install the dependencies 

```

npm install

```

### Register keys

```

Register the apiKeys on the environment files.

Open src/environments/environment.ts and src/environments/environment.prod.ts,
and fill the apiKey lines with the follow information

firebase: {
    apiKey: 'AIzaSyBA2aM64BGgSatdLXwiDK92aSW82ODaBR4'
}

openweather: {
    apiKey: '9aa0bfef4e240e8643deeb8be6cc52f3',
}

```


### Run the code as production server 

```

ng serve --prod

```

### Run the code as development server 

```

ng serve

```

### Build the code

```

ng build --prod --aot --base-href <website url>

```

#### Notes 

As I'm using a basic host service, without ssl, I prefered to not implement a geolocation service, although it would be very useful. If you would like to see it, please open an issue.

Besides the OpenWeather API, I created an API to simulate the autocomplete behaviour on the cities search, allowing a better application behaviour. The OpenWeather do not allow this behaviour natively. _Firebase database is not the ideal, but gives the feel_.

#### Test

Some unit tests was written to guarantee the correctness of the application. Keep in mind, there was no 100% code coverage objective. Run `ng test` on your local development to run the tests. 

![alt text](http://thlima.com/benevity/benevity-tests.png)


## License

MIT

---
