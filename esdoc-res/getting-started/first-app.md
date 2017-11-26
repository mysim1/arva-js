# Writing your first application
Now that you've [[successfully installed|Installation]] Arva, you've already got the seed project, which is your starting point for building a new app. Let's have a look at the main components of an Arva seed project.

### 1. App.js ###
In _src/App.js_ you'll find the entry point to your freshly cloned app. This class is the basis of our App. We instantiate our controllers here, and hook them up to the Router that automatically handles switching between controllers when the page URL changes. The inner workings of App.js are elaborated by inline comments:


```javascript
import firebase                     from 'firebase';

import {FirebaseDataSource}         from 'arva-js/data/datasources/FirebaseDataSource.js';
import {provide}                    from 'arva-js/utils/di/Decorators.js';
import {Injection}                  from 'arva-js/utils/Injection.js';
import {DataSource}                 from 'arva-js/data/DataSource.js';
import {App as ArvaApp}             from 'arva-js/core/App.js';

/* Importing CSS in jspm bundled builds injects them into the DOM automagically */
import './famous.css';
import './fonts.css';

/* Here we import all controllers we want to use in the app */
import {HomeController}             from './controllers/HomeController.js';

export class App extends ArvaApp {

    /* References to Dependency Injection created App and Controller instances, so they are not garbage collected. */
    static references = {};

    static controllers = [HomeController];

    @provide(DataSource)
    static defaultDataSource() {
        firebase.initializeApp({
            apiKey: '<api-key>',
            authDomain: '<subdomain>.firebaseapp.com',
            databaseURL: 'https://<subdomain>.firebaseio.com',
            storageBucket: '<subdomain>.appspot.com'
        });
        return new FirebaseDataSource('/', {});
    }

    /**
     *  Called before the App is constructed and before the basic components (Router, Famous Context, Controllers, DataSource)
     *  have loaded.
     */
    static initialize(){
        this.start();
    }

    /**
     * Called after the Router, Famous Context, and Controllers have been instantiated,
     * but before any Controller method is executed by the Router. Keep in mind that there is still
     * a static context here, so no access to "this" of the App instance can be used yet, outside of the static "this.references".
     */
    static loaded(){
        /* Instantiate things you need before the router is executed here. For example:
         *
         * this.references.menu = Injection.get(Menu); */
    }

    /**
     * Called by super class after all components (routing, controllers, views, etc.) have been loaded by the Dependency Injection engine.
     */
    done(){
    }
}

document.addEventListener('deviceready', App.initialize.bind(App));
```

### 2. HomeController.js ###
In our App class we imported a HomeController, and made it the default controller called by the Router if no route is present. This controller was already created in _/src/controllers/HomeController.js_ and shows how easy it is to set up logic in Arva apps.


```javascript
import {Controller}                 from 'arva-js/core/Controller.js';
import {HomeView}                   from '../views/HomeView.js';

export class HomeController extends Controller {

    Index(){
        if(!this.homeView) {
            this.homeView = new HomeView({welcomeName: 'world'});
        }
        return this.homeView;
    }

}
```

### 3. HomeView.js ###
The view we used in our HomeController is already present in _/src/views/HomeView.js_. This is where the visual components of the app can be added.


```javascript
import Surface              from 'famous/core/Surface.js';
import {View}               from 'arva-js/core/View.js';
import {layout, event}      from 'arva-js/layout/Decorators.js';

export class HomeView extends View {

    @layout.size(~100, ~25)
    @layout.stick.center()
    message = new Surface({content: `Hello ${this.options.welcomeName}`});

}
```

### 4. Building and previewing ###
In order to transpile all our neat ES6 code to browser-understandable ES5 code we need to execute `npm run build` in the base Arva seed folder. The transpiled code will be saved in _/www/bundle.js_. You can also use `npm run watch` for continuous watching and recompilation of changed files.



Now that you've finished building your first app, it's time to see how it looks like. Open _/www/index.html_ in your browser and behold your very first Arva application!

This is what _index.html_ looks like:
```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com wss://*.firebaseio.com https://*.firebaseio.com https://auth.firebase.com https://*.firebaseapp.com http://apis.google.com https://*.googleapis.com http://connect.facebook.net https://connect.facebook.net http://*.ak.facebook.com https://*.ak.facebook.com https://fonts.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; media-src *">
    <meta name="format-detection" content="telephone=no">
    <meta name="msapplication-tap-highlight" content="no">
    <meta name="mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
</head>
<body style="background-color: rgb(230, 230, 230)">
<script type="text/javascript" src="cordova.js"></script>
<script type="application/javascript" src="bundle.js"></script>
</body>
</html>
```
