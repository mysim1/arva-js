# Introduction

Arva JS solves the problem of **layout** and **animation** without the need to bother with CSS nor HTML. While CSS is still used for **styling** of the content, whereas **positioning** and **sizing** is handled through different processes.
Arva astracts away some of the concerns that many front-end developers face,
which includes CSS deep-dives and directives like `display: inline-block` `margin:auto`, `position:relative`, `clear:left`, `float: right`, `zoom: 1` `overflow: auto`, `-webkit-box-sizing: border-box` and so on.

Even modern paradigms like flexbox won't be necessary anymore. Let's get started.


# Getting started

## Prerequisites
* General understanding of Javascript Package Managers, including NPM and JSPM
* Basic understanding of Famo.us, documentation can be found in this space
* Basic understanding of Famous-flex, documentation can be found here: https://github.com/ijzerenhein/famous-flex/
* Basic understanding of Javascript and the ES6/7 (ES2015) semantics

## Installation
The easiest way to get started quickly is by cloning the <a href="https://github.com/Bizboard/arva-seed">Arva Seed</a> project. This project contains all the necessary components and default
settings to build a hello world application across multiple platforms.

```bash
npm install -g cordova
git clone https://github.com/Bizboard/arva-seed.git
cd arva-seed
npm install
jspm install
```

>If you're using WebStorm, now would be a good time to dive into your preferences and set your JavaScript version to ECMAScript 6.

## Write first application

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

# Core


## App
The App class is the protagonist of your Arva App. Here you set the default entry controller that will have initial control over the application, configure routes, specify animation between screens, and setup whatever you want to do on an initial stage.

A minimal, clean App class will look something like this:

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

    /* The controllers that will be used in the app. */
    static controllers = [HomeController];


    /* Define which DataSource to use */
    @provide(DataSource)
    static defaultDataSource() {
        /* Firebase initialization */
        firebase.initializeApp({
            apiKey: '<api-key>',
            authDomain: '<subdomain>.firebaseapp.com',
            databaseURL: 'https://<subdomain>.firebaseio.com',
            storageBucket: '<subdomain>.appspot.com'
        });
        return new FirebaseDataSource('/', {});
    }

    /**
     *  Called before the App is constructed and before the basic components (Router, Famous Context, Controllers,
     *  DataSource) have loaded.
     */
    static initialize(){
        /* Change initial route, view animation or something needed before we start */
        this.start();
    }

    /**
     * Called after the Router, Famous Context, and Controllers have been instantiated,
     * but before any Controller method is executed by the Router.
     */
    static loaded(){
        /* Instantiate things you need before the router is executed here. For example:
         *
         * this.references.menu = Injection.get(Menu); */
    }

    /**
     * Called by super class after all components (routing, controllers, views, etc.) have been loaded and the
     * app is up and running.
     */
    static done(){
    }
}

document.addEventListener('deviceready', App.initialize.bind(App));
```

If you won't be using Firebase or any external data, you can just omit the defaultDataSource out of the app.

There are three stages of app initialization:

  * `initialize`: Before any other initialization is done besides waiting for the DOM to be ready.
  * `loaded`: When the `Router`, controllers, and Famous context are all set up.
  * `done`: After the controller has fired and the app is running.

After each of these stages, their respectively named method is called. This gives us the opportunity to modify the app's startup behaviour.

## Controllers
Controllers are meant for implementing logic. They are automatically executed by the <a href="./router">Router</a> when their route is present in the current page URL. Here's a minimal example:

```javascript
import {Controller}                 from 'arva-js/core/Controller. js';
import {TestView}                   from '../views/TestView. js';

export class DemoController extends Controller {
    Test(){
        return new TestView();
    }
}
```

The controller will be executed when the url path is set to `index.html#/<NameOfController>/<NameOfMethod>`. In this example, it will be triggered when going to `index.html#/Demo/Test`.

### Passing parameters
GET parameters can be passed to the controller into the method like you would expect them to. Let's consider the url `index.html#Demo/Test?param1=a&param2=b`.

```javascript
import {Controller}                 from 'arva-js/core/Controller. js';
import {TestView}                   from '../views/TestView. js';

export class DemoController extends Controller {
    Test(param1, param2){
        console.log(param1);   // "a"
        console.log(param2);   // "b"
        return new TestView();
    }
}
```

>To not have to hurt performance, **parameters are passed to methods in the order they are present in the URL**. For example, both *#/Demo/ParamTest?id=1&name=Arva* and *#/Demo/ParamTest?some=1&thing=Arva* will result in DemoController.ParamTest(id = 1, name = 'Arva') being called. This is because reflection in JavaScript is expensive performance-wise.

It's important that every controllers return a different view. If the same view is returned by multiple controller methods, the router won't be able to animate a transition between them, since the same view is already visible.

### Useful to know
#### Controller methods can return Promises
If you have to wait for something like data before you can create your view inside your Controller method, you have the option to return a Promise object. When that promise is resolved with the view as a parameter, the view will be animated in as usual.

```javascript
export class DemoController extends Controller {
    async Test(){
            /* --await something here-- */
            return new TestView();
    }
}
```

## Views
Arva Views are in essence <a href="https://github.com/Bizboard/famous/blob/develop/src/core/View.js">Famo.us Views</a> on <a href="https://github.com/Bizboard/famous-flex/blob/master/src/LayoutController.js">famous-flex</a> steroids. They allow us to easily create ES6 extendible views that can be inherited by other components.

Views are nodes in the rendering tree that can contain either famous [Surfaces](https://github.com/Bizboard/famous/blob/develop/src/core/Surface.js) which correspond to actual DOM elements or other Views.

Let's dive into it! We'll demonstrate a short example to see how we can cook together some basic UI here.

### The first View
The following snippet will give us a new View without anything displaying on screen.

```javascript
import {View}               from 'arva-js/core/View.js';

export class HomeView extends View {
}
```

### At your Surface!
Our next step is to add some content to our view. We do this by adding [class properties](https://github.com/jeffmo/es-class-fields-and-static-properties) containing either a Famo.us Surface or an Arva View instance.  Layouting of these "renderables" is done with ES6 [decorators](https://github.com/wycats/javascript-decorators).

```javascript
import Surface              from 'famous/core/Surface.js';
import AnimationController  from 'famous-flex/AnimationController.js';
import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/decorators.js';

export class HomeView extends View {
    /* The size of this surface is 300x25 px */
    @layout.size(300, 25)
    /* Place it in the midddle of the view */
    @layout.stick.center()
    /* Define an animation on creation */
    @layout.animate({
        animation: AnimationController.Animation.FadedZoom,
        transition: {duration: 200}
    })
   /* Initialize the surface itself */
    message = new Surface({
        /* The content of the surface */
        content: 'Hello world',
        /* CSS properties */
        properties: {
            textAlign: 'center',
            color: 'slategray'
        }
    });
}
```
In a similar fashion, we can also define a background for the view:

```javascript
    /* Translate the element in z space to the back */
    @layout.translate(0, 0, -10)
    /* Make the element cover the entire space */
    @layout.fullSize()
    /* Definition of the element */
    background = new Surface({properties: {backgroundColor: 'aliceblue'}});
```

### Extending one view with another
For some characteristic views, you might not feel like constantly reinventing the wheel. Let's define a general view with a top bar.
```javascript
export class ViewWithTopBar extends View {
    /* Dock to the top with a 44px height */
    @layout.dock.top(44)
    /* Define an animation on creation */
    @layout.animate({
        animation: AnimationController.Animation.Slide.Down,
        transition: {duration: 100}
    })
    /* Initialize the surface itself */
    topBar = new Surface({
        /* CSS properties */
        properties: {
            backgroundColor: 'teal'
        }
    });
}
```

Now, we can simply do `HomeView extends ViewWithTopBar` to get a top bar in the HomeView. Easy, right?

>Hint: To make the view appear less busy, you can let the animation in the HomeView wait for the top bar to finish. Just add a property `waitFor: 'topBar'` in the animation options of `message` and you're done.

### Events
To listen for HTML events, the common `on`, `off`, and `once` are readily available. Let's define a surface that will only show once you click the `Hello world` text. We make event listeners in the constructor of the class, which we haven't defined just yet. The following snippet (taken from within a View class) listens for `click` events on the `message` renderable, after which it shows the `answer` renderable:

```javascript
    @layout.size(300, 25)
    @layout.stick.center()
    /* Listen to click events from this renderable */
    @event.on('click', function(){ this.showRenderable('answer'); })
    message = new Surface({
        content: 'Hello world',
        properties: {
            textAlign: 'center',
            color: 'slategray'
        }
    });


    @layout.size(300, 25)
    @layout.translate(0, 100, 0)
    @layout.animate({
        showInitially: false, /* Hide this renderable at first, we show it programmatically. */
        animation: AnimationController.Animation.Slide.Left,
        transition: {duration: 500}
    })
    @layout.stick.center()
    answer = new Surface({content: 'Yes?', properties: {textAlign: 'center'}});
```

> Hint: Events of a child will fire for the parent as well (i.e. they bubble upwards). This means that listening for clicks on the HomeView will trigger automatically when the message click is fired.

### Putting it all together
Let's see how our code turned out in its entire form:

```javascript
import Surface              from 'famous/core/Surface.js';
import AnimationController  from 'famous-flex/AnimationController.js';
import {View}               from 'arva-js/core/View.js';
import {layout, event}   from 'arva-js/layout/decorators.js';


export class ViewWithTopBar extends View {
    /* Dock to the top with a 44px height */
    @layout.dock.top(44)
    /* Place it in the midddle of the view */
    /* Define an animation on creation */
    @layout.animate({
        animation: AnimationController.Animation.Slide.Down,
        transition: {duration: 100}
    })
    /* Initialize the surface itself */
    topBar = new Surface({
        /* CSS properties */
        properties: {
            backgroundColor: 'teal'
        }
    });
}


export class HomeView extends ViewWithTopBar {
    /* The size of this surface is 300x25 px */
    @layout.size(300, 25)
    /* Place it in the midddle of the view */
    @layout.stick.center()
    /* Define an animation on creation */
    @layout.animate({
        waitFor: 'topBar',
        animation: AnimationController.Animation.FadedRotateZoom,
        transition: {duration: 1000}
    })
    /* Listen for click events to show the other Surface */
    @event.on('click', function(){this.showRenderable('answer');})
   /* Initialize the surface itself */
    message = new Surface({
        /* The content of the surface */
        content: 'Hello world',
        /* CSS properties */
        properties: {
            textAlign: 'center',
            color: 'slategray'
        }
    });

    /* Translate the element in z space to the back */
    @layout.translate(0, 0, -10)
    /* Make the element cover the entire space */
    @layout.fullSize()
    /* Definition of the element */
    background = new Surface({properties: {backgroundColor: 'aliceblue'}});

    @layout.size(300, 25)
    /* Translate 100px below our main message */
    @layout.translate(0, 100, 0)
    @layout.animate({
        /* Hide initially */
        showInitially: false,
        /* Slide to the left in form the right */
        animation: AnimationController.Animation.Slide.Left,
        transition: {duration: 500}
    })
    @layout.stick.center()
    answer = new Surface({content: 'Yes?', properties: {textAlign: 'center'}});

}
```

Sweetness, that was the tutorial so far. If you want to some more intricate control over your animations, or something more flashy, be sure to check out the [[Flow]] section.

## Models

Models are one of the areas where Arva really shines. It's super easy to create models with two-way data binding to a realtime data source. Have a look for yourself:

### Defining a new model
When creating a new model, we only have to extend the Model class and define which fields our model should contain.

The model will automagically create a handler that is fired when the model's properties are changed in code, hook the model up to the DataSource you want to use, and synchronise all changes between the two. Isn't that cool?

Let's create a simple model for a Monkey:

```javascript
import {Model}              from 'arva-js/core/Model.js';

export class Monkey extends Model {
    get character() {}
    get tailLength() {}
    get currentMood() {}
}
```

Upon construction, all getters defined in our Monkey class are replaced with getter/setter properties, and connected to the change handlers. The Model will automatically deduce the path to your Monkey on the remote DataSource to be '/Monkeys', if you don't pass a path specifically yourself. It does this by appending 's' to the model's class name, which works fine in most cases.

### Specifying a path
Don't like your Monkey being stored under /Monkeys? That's fine. Let's see how to save our monkey under /TinyGorillas instead.

```javascript
import {Model}              from 'arva-js/core/Model.js';

export class Monkey extends Model {
    get character() {}
    get tailLength() {}
    get currentMood() {}
    constructor(id, data, options) {
        super(id, data, {...options, path: '/TinyGorillas'});
    }
}
```

### Instantiating a model
You can create model instances everywhere, but a proper workflow will probably have you construct them in your Controllers. We'll show you how:

```javascript
import {Controller}                 from 'arva-js/core/Controller.js';

export class MonkeyController extends Controller {
    constructor(){
        this.monkey = new Monkey('Caesar');
    }
}
```

This will create a new Monkey object that points to the remote DataSource at /TinyGorillas/Caesar.

All changes you do locally are reflected on the remote DataSource in real-time:

```javascript
import {Controller}                 from 'arva-js/core/Controller.js';

export class MonkeyController extends Controller {

    constructor(){
        this.monkey = new Monkey('Caesar');
        this.monkey.currentMood = 'world domination';
    }
}
```
It won't start synchronising from the DataSource to local until you tell it you want to, to ensure performance. Let's see how we add an event listener for every time that the model is updated remotely:

```javascript
import {Controller}                 from 'arva-js/core/Controller.js';

export class MonkeyController extends Controller {

    constructor(){
        this.monkey = new Monkey('Caesar');
        this.monkey.on('value', () => {
            console.log(`Caesar's mood changed to: ${this.monkey.currentMood}`);
        });
    }
}
```

Subscribing to the 'value' event will automatically start synchronisation from the DataSource to the local model.

### Multiple changes
If you change a bunch of fields after each other, each of them will trigger a push to the DataSource individually. For example, this will trigger three seperate synchronisation pushes:

```javascript
monkey.tailLength = 100;
monkey.character = 'evil';
monkey.currentMood = 'world domination';
```

Usually we don't want that, because everyone listening to this model will receive a bunch of updated events, and that is bad for UX.

You can use the Model's transaction() method to execute multiple changes, and only trigger one push to the DataSource at the end. You pass it a function to execute, and it will update to the DataSource itself afterwards:

```javascript
monkey.transaction(() => {
    monkey.tailLength = 100;
    monkey.character = 'evil';
    monkey.currentMood = 'world domination';
});
```

This will only generate a single push. That's better.

### Moving beyond basics

#### Arrays of models
Models start becoming cool when you can manipulate a bunch of them. Our [[PrioritisedArray|Model-arrays]] allows you to subscribe to a list of monkeys. That way you can track how many of them are planning world domination all at once. Cool, right?

#### Two-way data bound ScrollViews
With our <a href="./databoundscrollview">DataBoundScrollView</a>, you can hook up a PrioritisedArray to a ScrollView super easily. Pass in the array, and define the renderable used to display each model. Simple as that, you have a scrollable view hooked up to your DataSource. It automatically handles new models, changed models, moved models, and removed models, and syncs the UI with them accordingly. In real-time.

## Routing

The router subscribes to page URL changes, executes controller methods for the current URL route, and was designed to do its work in the background without having to know how its internals work precisely. We'll discuss the use cases where you'll interact with it here.

### Usage inside the App class
#### Configuring the app's default route
This configures what controller method to run if the current URL does not contain a route. This happens on app startup, for example. You can pass in either a controller constructor (a class), a controller instance (an object), or a controller name (a string) for the controller parameter. The method name should be a string. Keep in mind that this string is **case-sensitive**.
```javascript
router.setDefault('Home', 'Index');
```

### Setting up controller animation specs
When the currently displayed view changes, the router will trigger an animation between the current view and the view to be displayed. You can influence this animation by giving the router a Controller Specification, which lists the animations to use from each location to a given controller:

```javascript
router.setControllerSpecs(ControllerSpecification);
```

You can read what the Controller Specification object should look like in the [[Page Animations]] section.

### Usage inside Controllers
#### Navigation
Navigating to another controller method is super easy. Check this out:

```javascript
router.go('Demo', 'someMethod', {param1: 'value1', param2: 2});
```

This changes the page URL to #/Demo/someMethod along with the parameters, and calls ```DemoController.someMethod('value1', 2);```. This then loads and animates the view that method returns.

## Transitions

### Page Transitions
Like explained in the <a href="./router">Router</a> section, you can influence how the transition from one view to another is animated by Arva. By default, all transitions are a simple fade.

To alter an animation, you pass a plain object to the router specifying which animation to use in which scenario.

A typical Controller Specification object might look something like this:
```javascript
{
    HomeController: {
        controllers: [
            {
                transition: {duration: 300, curve: Easing.outQuad},
                animation: AnimationController.Animation.FadedZoom,
                activeFrom: ['DemoController', 'DemoTwoController']
            },
            {
                transition: {duration: 300, curve: Easing.outQuad},
                animation: AnimationController.Animation.Zoom,
                activeFrom: ['DemoThreeController']
            }
        ],
        methods: {
            next: {
                transition: {duration: 300, curve: Easing.outQuad},
                animation: AnimationController.Animation.Slide.Right
            },
            previous: {
                transition: {duration: 300, curve: Easing.outQuad},
                animation: AnimationController.Animation.Slide.Left
            }
        }
    },
    DemoController: {
        controllers: [
            {
                transition: {duration: 300, curve: Easing.outQuad},
                animation: AnimationController.Animation.Slide.Up,
                activeFrom: ['HomeController']
            }
        ]
    }
}
```

Let's cut that up into smaller pieces and analyse what's going on.

#### 'controllers' or 'methods'
The topmost HomeController and DemoController keys specify a target controller. If the new route contains this controller, the router will look inside that object to find the relevant animation.

```javascript
{
    HomeController: {
        /* We're going to #/Home/<someMethod> */
    },
    DemoController: {
        /* We're going to #/Demo/<someMethod> */
    }
}
```

Inside of those objects, we have two keys: 'controllers' and 'methods'. The 'controllers' value is used if we are moving from a different controller to the current controller.

For example, going from #/Demo/someMethod -> #/Home/someOtherMethod, we'll use the 'controllers' value to look for an animation.

If we're staying inside the same controller, but to a different method in that controller, we use the 'methods' value to look for an animation. For example, #/Home/method1 -> #/Home/method2 triggers the router to look in the 'methods' value.

### Deeper look into 'controllers'
The 'controllers' value is an array of plain objects. Each of these objects represents an animation used for one or more source controllers.

We can read the following as "use this animation when going from DemoController or DemoTwoController to HomeController":

```javascript
    HomeController: {
        controllers: [
            {
                transition: {duration: 300, curve: Easing.outQuad},
                animation: AnimationController.Animation.FadedZoom,
                activeFrom: ['DemoController', 'DemoTwoController']
            }
        ]
    }
```

### Deeper look into 'methods'
The 'methods' value is an object containing keys 'next' and 'previous'. The router checks the route history, and if the current route appears earlier in the route history it will use the 'previous' animation. Otherwise, it will use the 'next' animation.

For example, consider this route flow:

```javascript
/* The App start launches #/Home/Index, so the history is ['Home/Index'] */

/* This triggers the methods.next since 'Home/newMethod' is not present
    in the route history. Afterwards, the history is ['Home/Index', 'Home/newMethod']. */
router.go(HomeController, 'newMethod');

/* 'Home/Index' is present in the history, so the router triggers method.previous.
    It pops 'Home/newMethod' from the history since we're going back.
    That means the history is now back to ['Home/Index']. */
router.go(HomeController, 'Index');
```

## Components
We saw in the [[Views]] chapter that a `Surface` takes CSS properties in its constructor for its layout.

Creating pure `Surface` objects all the way might not be awesome when you need to make an entire consistently styled app. Instead of copy pasting your styling all over the place, make reusable components!

```javascript
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import Surface              from 'famous/core/Surface.js';

export class Text extends Surface {
    constructor(options) {
        super(combineOptions({
            properties: {
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight:'110%',
                fontWeight: 'lighter',
                color: "#333"
            }
        }, options));
    }
}
```

There we go. Now we can make freshly styled text surfaces faster than a hungry kid chasing an ice cream truck:

```javascript
import {Text}               from './path/to/component/Text.js';
import {layout}            from 'arva-js/layout/decorators.js';
import {View}              from 'arva-js/core/View.js';

export class ComponentDemoView extends View {
    @layout.size(300, 100)
    @layout.place.center()
    text = new Text({content: 'This text is styled.'});
}
```

## Flow
Sometimes the show and hide animations provided by the decorator @layout.animate() does not suffice, and you want to animate in between multiple different states of a component, each with their own animation curves. For this granularity, we developed a mechanism called Flow.

The core concept of Flow is that renderables can have multiple **states**, each of which contain a collection of **layout properties**. When the renderable changes from one state to another, their layout properties are tweened into each other, creating the effect of seamless animation.

Let's start out with something easy: A button doing nothing.

```javascript
import Surface                  from 'famous/core/Surface.js';
import {View}                   from 'arva-js/core/View.js';
import {layout, event, flow}    from 'arva-js/layout/Decorators.js';

import Easing                   from 'famous/transitions/Easing.js';

export class HomeView extends View {

    @flow.defaultState('initial', {}, layout.translate(0, 50, 0), layout.stick.bottom(), layout.size(100, 100))
    button = new Surface({
        properties: {
            backgroundColor: 'antiquewhite',
            borderRadius: '30%'
        }
    });
}
```

The key difference compared to declaring properties normally is that we're now putting the layout decorators at the end arguments of `@flow.defaultState(stateName, options, ...layoutDecorators)`.

So far, this View doesn't give us any candy at all, it just looks like more complicated way of defining the layout and it won't animate. But bare with us for a second and look at what we're doing now:

```javascript
    @flow.defaultState('initial', {}, layout.translate(0, 50, 0), layout.stick.bottom(), layout.size(100, 100))
    @event.on('mouseover', function () { this.setRenderableFlowState('button','big'); })
    @event.on('click', function () { this.setRenderableFlowState('button','initial'); })
    @flow.stateStep('big', {transition: {duration: 200}}, layout.stick.center())
    @flow.stateStep('big', {
        transition: {
            curve: Easing.inCubic,
            duration: 500
        }
    },
        layout.size((width, height) => width * 2, (width, height) => height * 2),
        layout.rotateFrom(0, 0, 2*Math.PI)
    )
    button = new Surface({
        properties: {
            backgroundColor: 'antiquewhite',
            borderRadius: '30%'
        }
    });
```

### So what's going on here?
 * A **state** consists of one or multiple **steps**
    - A **step** is define by using the decorator `@flow.stateStep` which defines one or more things that is being executed in the step.
  * The **state** is executed by calling `this.setRenderableFlowState(renderableName, stateName)` which in the above example is done on `click` and `mouseout`. Try it out!
  * Decorators applied to each of the states are additions to the previous state. That is why we added `layout.scale(1, 1, 1)` and `layout.skew(0, 0, 0)` to the default state in order to reset previous changes.
  * Useful decorator functions for defining flow are `layout.rotateFrom` and `layout.translateFrom` which changes the renderable rotation/translation starting from the current state, which is why the Hello World text doesn't have to rotate back when going to the initial state.

### View states
The state of a view consists of multiple states of its renderables. Let's create some text that shows up when the button finished animating to it's bigger state.

```javascript
    @flow.defaultState('hidden', {},
        layout.opacity(0),
        layout.size(~300, ~30),
        layout.stick.center())
    @flow.stateStep('shown', {},
        layout.opacity(1))
    text = new Surface({content: "Welcome!"})
```

This text should now show after the button is covering the entire screen size. We'll do that by defining view states:

```javascript
@flow.viewStates({
    enabled: [{button: 'big'}, {text: 'shown'}],
    passive: [{button: 'initial', text: 'hidden'}]
})
export class HomeView extends View {
...
```
Instead of calling `this.setRenderableFlowState` in the events of the `button`, we now call `this.setViewFlowState`, like this:
```javascript
    @flow.defaultState('initial', {},
        layout.translate(0, 50, 0),
        layout.stick.bottom(),
        layout.size(100, 100))
    @event.on('mouseover', function () {
        this.setViewFlowState('enabled');
    })
    @event.on('click', function () {
        this.setViewFlowState('passive');
    })
    @flow.stateStep('big', {transition: {duration: 200}}, layout.stick.center())
    @flow.stateStep('big', {
        transition: {
            curve: Easing.inCubic,
            duration: 500
        }
    },
        layout.size((width, height) => width * 2, (width, height) => height * 2),
        layout.rotateFrom(0, 0, 2*Math.PI)
    )
    button = new Surface({
        properties: {
            backgroundColor: 'antiquewhite',
            borderRadius: '30%'
        }
    });
```

This now grows the button and afterwards shows the text. When the background is clicked, the text fades back to opacity zero and the button shrinks back.

### Beyond states
Flow doesn't have to be limited to states. We can use `this.decorateRenderable(...)` at runtime to animate to any other state. Let's add more chaos.

```javascript
    @flow.defaultState('hidden', {},
        layout.opacity(0),
        layout.size(~300, ~30),
        layout.stick.center())
    @flow.stateStep('shown', {},
        layout.opacity(1))
    @event.on('click', function () {
        this.decorateRenderable('text',
            layout.translate(0, 300 * Math.random() - 150, 0))
    })
    text = new Surface({content: "Welcome!"})
```

The click will move the content to random position along the y axis. Note that the new position the message appears in is the same made by the last translate due to the additive nature of the decorator (state is applied from the current specification).

We use states in Arva for declaring different declarations along with the renderable itself, while `this.decorateRenderable` covers the usecases when the there a lot of unpredictable states (like in this example, randomized).

>Hint: The default transition is based on a spring simulation executed by the Famous physics engine. There are three cases when this could happen:
>  * When there is no transition specified in the `@flow` decorator.
>  * When `this.decorateRenderable` is used.
>  * When one animation is interrupted by another one.

### All together now
The entire code of our example looks like this:

```javascript
import Surface                  from 'famous/core/Surface.js';
import {View}                   from 'arva-js/core/View.js';
import {layout, event, flow}    from 'arva-js/layout/Decorators.js';

import Easing                   from 'famous/transitions/Easing.js';

@flow.viewStates({
    enabled: [{button: 'big'}, {text: 'shown'}],
    passive: [{button: 'initial', text: 'hidden'}]
})
export class HomeView extends View {

    @flow.defaultState('initial', {},
        layout.translate(0, 50, 0),
        layout.stick.bottom(),
        layout.size(100, 100))
    @event.on('mouseover', function () {
        this.setViewFlowState('enabled');
    })
    @event.on('click', function () {
        this.setViewFlowState('passive');
    })
    @flow.stateStep('big', {transition: {duration: 200}}, layout.stick.center())
    @flow.stateStep('big', {
        transition: {
            curve: Easing.inCubic,
            duration: 500
        }
    },
        layout.size((width, height) => width * 2, (width, height) => height * 2),
        layout.rotateFrom(0, 0, 2*Math.PI)
    )
    button = new Surface({
        properties: {
            backgroundColor: 'antiquewhite',
            borderRadius: '30%'
        }
    });

    @flow.defaultState('hidden', {},
        layout.opacity(0),
        layout.size(~300, ~30),
        layout.stick.center())
    @flow.stateStep('shown', {},
        layout.opacity(1))
    @event.on('click', function () {
        this.decorateRenderable('text',
            layout.translate(0, 300 * Math.random() - 150, 0))
    })
    text = new Surface({content: "Welcome!"})

}
```

## Dependency Injection
We're not talking about package dependencies here. Dependency Injection in Arva is about being able to maintain the same instance of the same type of object in different part of the app. We use a forked version of Angular's [di.js](https://github.com/angular/di.js/).

This means that if two parts of the app uses the same data, it won't make two requests to the database on the server.

Starting out with an easy peasy example:

```javascript
import {View}        from 'arva-js/core/View.js';
import {Injection}   from 'arva-js/utils/Injection.js';
import {Tweets}      from './path/to/Tweets.js';

class NewsFeedView extends View{
     allTweets = Injection.get(Tweets, {orderBy: 'timestamp'});
...
}

```

The statement above is essentially equivalent of doing `allTweets = new Tweets({orderBy: 'timestamp'})`. The difference is that next time the same thing is requested, this will return the same instance of the object.


```javascript

//First time: the object is created
let allTweets = Injection.get(Tweets, {orderBy: 'timestamp'});

//Second time: the object is reused!
let someOtherTweets = Injection.get(Tweets, {orderBy: 'timestamp'});

console.log(allTweets === someOtherTweets); // True

//A new object is created here since arguments differ from last time.
let anotherSetOfTweets = Injection.get(Tweets, {orderBy: 'userId'});

console.log(allTweets === anotherSetOfTweets); // False

```

Heading on to a more pragmatic example, lets say that when viewing an individual tweet we still want to keep track of added tweets, so we can update some notification badges:


```javascript

class NewsFeedView extends View{
     allTweets = Injection.get(Tweets, {orderBy: 'timestamp'});
     //Display all the tweets here
}

class TweetView extends View{
     allTweets = Injection.get(Tweets, {orderBy: 'timestamp'});
     //Logic for updating notification badges when a new tweet has been added
}


```

There might be more complicated use cases. For example we might need to filter the tweets for explicit content. We might also need to limit our results to avoid downloading too much data from the database. What if we want to provide a set of general tweets, for all components of the app, without worrying about the specific arguments?

```javascript

import {provide}        from 'arva-js/utils/di/Decorators.js';
import {Tweets}         from './path/to/Tweets.js';

@provide(Tweets)
function processTweets() {
     let tweets = new Tweets({orderBy: 'timestamp', limitToFirst: 100});
     tweets = tweets.filter((tweet) =>
         !tweet.text.toLowerCase().includes('gosh darnit')));
     return tweets;
}

//Will use processTweets
let myTweets = Injection.get(Tweets);
let sameTweetsAgain = Injection.get(Tweets);
console.log(myTweets === sameTweetsAgain); // True

```


# Data

## Arrays

[[Models]] are even cooler if you use them in combination with the <a href="https://github.com/Bizboard/arva-ds/blob/master/src/core/PrioritisedArray.js">PrioritisedArray</a>. We'll go over some of the cool things you can do with this class.

## Creating a model array
Creating a new array is as simple as extending the PrioritisedArray, and in your constructor call the super constructor with the type of model you want populated:
```javascript
import {PrioritisedArray}   from 'arva-js/data/PrioritisedArray.js';
import {Monkey}               from './Monkey.js';

export class Monkeys extends PrioritisedArray {
    constructor() {
        super(Monkey);
    }
}
```
This will point to /Monkeys (the name of the array model) on the remote DataSource. If you want to use a custom path, you can pass in a DataSource with the custom path set as a second parameter to the super constructor of the PrioritisedArray.

### Listening for new models in an array
If you want to be notified of new models being created at the path in the remote DataSource we're subscribed to, you can subscribe to the 'child_added' event emitted by the array:
```javascript
import {Monkeys}             from './Monkeys.js';

let monkeys = new Monkeys();
monkeys.on('child_added', (monkey) => {
    console.log(`A new monkey appeared! His mood is ${monkey.currentMood}`);
});
```
Other events are:
* ready: the DataSource has finished loading all currently available data.
* value: every time a child is added, changed, moved, or removed, returns the entire array.
* child_changed: a child was changed.
* child_moved: a child was moved.
* child_removed: a child was removed.

### Iterating over all items currently in the array
Since the PrioritisedArray extends the plain JavaScript Array object, we can use the ES6 array iterator in a 'for of' loop like this:
```javascript
import {Monkeys}             from './Monkeys.js';

let monkeys = new Monkeys();
monkeys.on('ready', () => {
    for(let monkey of monkeys) {
        console.log(`Found a monkey: its mood is ${monkey.currentMood}`);
    }
});
```

### Adding a new model to the array
There are two ways of adding a new model to our array, both of which result in a new model instance being added to the local array and the remote DataSource.

### Adding a new model instance
```javascript
import {Monkey}              from './Monkey.js';
import {Monkeys}             from './Monkeys.js';

let monkeys = new Monkeys();
let monkey = monkeys.add(new Monkey()); /* Returns the monkey instance passed to it */

/* Optionally, we now modify the monkey's properties */
monkey.currentMood = 'peaceful negotiations';
```

### Adding plain properties
```javascript
import {Monkey}              from './Monkey.js';
import {Monkeys}             from './Monkeys.js';

let monkeys = new Monkeys();
monkeys.add({
     currentMood: 'peaceful negotiations'
});
```
The PrioritsedArray uses the plain object we passed in as base data to construct a new Monkey instance with. This will add a new Monkey object to the array with the given properties already set.

## Removing a model from the array
To remove a model from the array, simply call remove() on the model. This will remove it from the remote DataSource, which will be reflected in the local array:
```javascript
import {Monkeys}             from './Monkeys.js';

let monkeys = new Monkeys();
monkeys.on('ready', () => {
    if(monkeys.length >= 1) {
        monkeys[0].remove();
    }
});
```

### Two-way data binding model arrays to UI
You can create a scrollable view synchronised with a model array super easily with the <a href="https://github.com/Bizboard/arva-js/blob/master/src/components/DataBoundScrollView.js">DataBoundScrollView</a>. Find out more [[in its docs||DataBoundScrollView]].

## DataSources

### Google Firebase
Our <a href="https://github.com/Bizboard/arva-ds/blob/master/src/datasources/FirebaseDataSource.js">FirebaseDataSource</a> should be quite straightforward. We followed the design of Firebase in creating our DataSource base class, so most methods are translated 1:1.

This will most likely be the DataSource of choice for normal Web/Mobile/SmartTV apps, and it is the DataSource used by default in the <a href="https://github.com/Bizboard/arva-seed">Arva Seed</a> project.

### Microsoft SharePoint
For corporate environments we have the <a href="https://github.com/Bizboard/arva-ds/blob/master/src/datasources/SharePointDataSource.js">SharePointDataSource</a> that allows you to use SharePoint as a data store for your app's models.

It uses SharePoint's List structures to save data in a way like we do with Firebase.

Most of the larger corporations have strict security policies on using off-campus data stores, and setting up an on-campus solution can be time consuming. Luckily, most large corporations already have a secure on-campus SharePoint platform, and a server management team that maintains it.

We can simply hook into a new Site on SharePoint, create Lists to store the data in, and synchronise data between SharePoint and your app. In real time.

We wanted to share this component with everyone because we feel it solves a big problem, and nothing like it existed for our purpose.

### Microsoft SignalR



# Operators

## Animations and states

Animation states can be defined using the [flow](http://localhost:63342/arva-js/docs/variable/index.html#static-variable-flow) operator.

The core concept of Flow is that the renderables can have multiple **states**,
each of which contain a collection of layout properties.

When the renderable changes from one state to another using the [layout](http://localhost:63342/arva-js/docs/variable/index.html#static-variable-layout) operations,
their **layout properties** are tweened into each other, creating the effect of seamless animation.


```javascript
    @flow.stateStep('hidden', layout.opacity(0))
    @flow.stateStep('shown', layout.opacity(1))
    layer = Surface.with({properties: {backgroundColor: 'red'}});
```

For a contextual example of using flow and animation, we made a sample component for showing and hiding a menu:

![animation](asset/animation-demo.gif)

[Source code can be found here under 'stateful-animations'](https://github.com/Arva/demo)



## Data binding and Views

Every view is passed options by using the static method `with`:

```
class HomeView extends View {
    @layout.fullSize()
    background = Surface.with({properties: {backgroundColor: 'red'}})
}
```

(See the full source code of the view [here](https://pastebin.com/WzUJW3Vc))

In order to change an option dynamically, the background color in the example is defined as an option:


```
@bindings.setup({
    backgroundColor: 'red'
})
class HomeView extends View {
....
```

The `backgroundColor` can then be referenced inside the view:

```
    background = Surface.with({properties: {backgroundColor: this.options.backgroundColor}})
```

It can be changed through different triggers, one being [events](http://localhost:63342/arva-js/docs/variable/index.html#static-variable-event).

```
    @event.on('click', function() {
        this.options.backgroundColor = 'green';
    })
    background = Surface.with({properties: {backgroundColor: this.options.backgroundColor}})
```

### Chained decorators

All decorators of the same type ([layout](http://localhost:63342/arva-js/docs/variable/index.html#static-variable-layout), [event](http://localhost:63342/arva-js/docs/variable/index.html#static-variable-event), and [flow](http://localhost:63342/arva-js/docs/variable/index.html#static-variable-flow)) can be chained when used.

```
    @layout.dock.top()
        .size(undefined, true)
    centeredText = Surface.with({content: 'This is centered!'})
```

Is the same as


```
    @layout.dock.top()
    @layout.size(undefined, true)
    centeredText = Surface.with({content: 'This is centered!'})
```


### Two-way data binding

Data can go two ways. An example of data that becomes modified is the value of the [InputSurface](http://localhost:63342/arva-js/docs/class/src/surfaces/InputSurface.js~InputSurface.html).
```
    @layout.dock.top()
        .size(undefined, true)
    question = InputSurface.with({
        placeholder: 'What is your name?',
        @bindings.onChange((value) => {
            this.options.myName = value;
        })
        value: this.options.myName
    })

    @layout.dock.top()
        .size(undefined, true)
    answer = Surface.with({
        content: this.options.myName ?
        `Your name is ${this.options.myName}` : `You have no name`
    })
```

For a more advanced example on databinding, we made an app that could come in handy when trying to calculate the
value of your car after a crash:

![logo](asset/dbinding-demo.gif)



[Source code can be found here under 'data-binding'](https://github.com/Arva/demo)


# Components

## DataBoundScrollView
The <a href="https://github.com/Bizboard/arva-js/blob/master/src/components/DataBoundScrollView.js">DataBoundScrollView</a> is a beast that displays real-time data with built-in animations powered by [famous-flex](https://github.com/IjzerenHein/famous-flex/).

It allows you to pass in a [[PrioritisedArray|Model-arrays]] and a renderable constructor, and it will automagically synchronise the UI with the models in the array in real-time. Additions, changes, moves, and removals are immediately reflected in the UI. All beautifully animated, courtesy of famous-flex.

We'll go over some of its features here.

### FlexScrollView additions
The DataBoundScrollView extends the famous-flex <a href="https://github.com/IjzerenHein/famous-flex/blob/master/tutorials/FlexScrollView.md#flexscrollview">FlexScrollView</a>. Reading its documentation will be a good starting point for understanding the DataBoundScrollView.

### Added stuff
On top of what FlexScrollView offers, the following options are provided:
* **dataStore**: the PrioritisedArray to subscribe to.
* **itemTemplate**: a function that receives a Model instance and returns any type of Famous **renderable** (including Arva Views).
* **groupBy**: [Optional] a function that receives a Model and returns the Models group value to group the items with.
* **groupTemplate**: [Optional] a function that receives a group value as returned by groupBy, and returns any Famous renderable
* **headerTemplate**: [Optional] a function that returns any Famous renderable. This renderable will be shown at the top of the list, and scroll along with the content.
* **placeholderTemplate**: [Optional] a function that returns any Famous renderable. This renderable will be shown when there are no items (left) in the `PrioritsedArray`.
* **dataFilter**: [Optional] Filter what data is relevant to the view. Should be a function taking as an argument a model and from there returning a boolean.
* **ensureVisible**: [Optional] Function with a model as an argument, returning `true` if a new item should be forced to be visible by scrolling to it when being added.
* **chatScrolling**: [Optional] Boolean indicating whether we should automatically scroll to newly added items, but only when the user was already at the bottom before the addition. Defaults to `false`.
* **orderBy**: [Optional] A function specifying the order of the renderables. Takes two arguments `model1, model2`, and returns a boolean which is `true` if `model1` should go before `model2`, and `false` otherwise.
* **throttleDelay**: [Optional] a Number stating how long the delay between adding children to the `DataBoundScrollView` should be, in milliseconds. Default `0`. Adding a delay of around 50ms causes the scrollView to load the items more naturally. No delay at all might load items at once, which may not be the look and feel you're after.

>Hint: Sometimes, you might need to wait for something before that an item in the `DataBoundScrollView` can be created. You can achieve this effect by returning a promise in the `dataFilter` option that resolves whenever you're ready. The item will not be shown until the dataFilter method's promise is resolved.

### Events
* **on('child_click', callback)**: executes callback every time a child renderable is clicked, and passes an object with keys 'renderNode' and 'dataObject' to the callback function. The renderNode is the Famous renderable, and the dataObject is the Model instance.

### Example
The following example view will display a full-page scrollable view with the moods of all our monkeys:
```javascript
export class DataView extends View {
    @layout.fullSize()
    scrollView = new DataBoundScrollView({
    layout: CollectionLayout,
    layoutOptions: {
        itemSize: [undefined, 30]
    },
    itemTemplate: (monkey) => new Surface({content: `Mood: ${monkey.currentMood}`}),
    dataStore: new Monkeys()
    });
}
```



# Comparisons

## React

At first glance, it might not be evident what the benefit of Arva is over other frameworks. In particular, the
absence of JSX or templating language seems foreign as almost every other framework is using their own custom language.
An app written with Arva is written with plain (draft stage) ECMAScript syntax. The strict adherence to this standard future-proofs Arva to
be able to run natively in the browser, and also opens up for more super powers as the ECMAScript standard progresses further.

Another important difference to recall is that Arva is an MVC framework, where heavy data logic is put in the controller, rather
than being view-only, as is the case with frameworks like React. React and Arva do in this regard have different approaches,
since React is a framework intended as a component of a bigger picture, whereas Arva is the stand-alone solution for your entire app.

Let's consider a very simple example of an Arva view and its (approximate) counter-part in React,
to serve as a basis for further discussion.


```javascript
@bindings.setup({
    titleText: 'Welcome'
})
class HomeView extends View {
    @layout.dock.top(44)
    topBar = TopBar.with({titleText:this.options.titleText})

    @layout.dock.fill()
    content = Content.with()

    changeTitle(newTitle) {
        this.options.titleText = newTitle
    }
}
```

And now in React. Note that this definition won't include positioning and sizing, which would need custom CSS/HTML configurations.

```javascript
class HomeComponent extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            titleText: props.titleText
        }
    }
    changeTitle(newTitle) {
        this.setState({titleText: newTitle})
    }

    render() {
        return (
            <TopBar titleText=this.state.titleText/>
            <Content />
        )
    }

}
HomeComponent.defaultProps = {titleText: 'Welcome'};

```


### State updates

React is focused on building sound app logic, on simple views using the pure `render` function. Arva does not have a
render function, which means that when an update is needed (`setState` in React, or option assignment in Arva), Arva
can go a different route. When titleText is called, the function assigning `HomeView.topBar` will be called again
(`TopBar.with({titleText:this.options.titleText})`), so that the TopBar updates.

In the case React, the render() function will be called upon invalidation, causing a re-render of both the TopBar *and* the content.

We chose to optimize state updates by taking control over the `options` object of each view, linking the accesses of each
option to their relevant child views. When the child views are updated, the new options will be diffed with the old ones
in order to restrict what children should be updated inside *that* view. The getters and setters work for an arbitrary
level of nestedness inside the `options` object.

Based on the above description, one might object with the concern that performing deep checks for every update sounds
really inefficient. In response to that we've learned by experience that the different `options` objects are generally
not nested nor overly complicated, but rather the *View hierarchy* tends to be much more intricate. By avoiding huge
renders of completely updated view hierarchy we instead focus on limiting this and focusing on detecting a limited
subset of `option` updates. For React developers, you might think of the options propagation to children as
 if every View was a `PureComponent`.



### Layout and Animation

By not using JSX or other markup, we can use ES2017 decorators to focus on layout. Layout is abstracted away from the user
in order to provide flexible animations. The actual HTML output of Arva results in absolutely positioned elements in a rather
 flat structure, in order to be as flexible as possible. When using a normal framework that requires you to define the
 HTML manually, animations are usually implemented in a bit more awkward fashion.

All positioning and sizing done through decorators is hardware accelerated, so
the programmer can comfortably know that the animations defined won't stress the browser unnecessarily.
The decorator structure of Arva provides a natural solution for layout definition. In order to clarify why this is important,
 we will revisit the example we covered in a previous section, with the animating hamburger icon:

![button](asset/button.gif)

The animation declaration is optimized in being as straight forward as possible, so that transition states are defined
in an additive nature from the previous position, while tasks like centering content in relation to parent and proportional
 size are still easy to achieve.

Here's the code, with plenty of comments, for clarity:

```javascript

    /* We start with the top part of the hamburger,
     * which starts in a horizontal state, which we name 'straight'
     */
    @flow.defaultState('straight', {}, layout
    /* We center it and translate 8 pixels upwards */
            .stick.center()
            .translate(0, -8, 0)
    /* Size is 60% of parent size and 3 pixels high */
            .size(0.6, 3)
    /* No rotation */
            .rotate(0, 0, 0))
    /* This is the animation for going to the X.
     * We call the state of this part "tilted". */
    @flow.stateStep('tilted', {}, layout
    /* The first part of tilting the stick involves
     * centering all three lines together.
     * That means that we center the top part, by translating it to the middle */
        .translate(0, 0, 0))
    @flow.stateStep('tilted', {}, layout
    /* We then rotate it 45 degrees, which is the same as Math.PI / 4 */
        .rotate(0, 0, Math.PI / 4)
    )
    /* We defined a simple component with a white background
     * which is used for every portion of the icon
     */
    topStick = WhiteShape.with();

    /* The middle part is easy. We just hide it when the icon turns into
     * the X (since that's just two lines instaed of three) */
    @flow.defaultState('shown', {}, layout
        .stick.center()
        .translate(0, 0, 0)
        .size(0.6, 3)
        .opacity(1))
    @flow.stateStep('hidden', {}, layout
        .opacity(0))
    centerStick = WhiteShape.with();

    /* The bottom part is very similar to the top one,
     * but with a rotation going in the opposite direction,
     * and a translate 8 pixels down instead of 8 pixels up
     */
    @flow.stateStep('tilted', {}, layout
        .translate(0, 0, 0))
    @flow.stateStep('tilted', {}, layout
        .rotate(0, 0, -Math.PI / 4)
    )
    @flow.defaultState('straight', {}, layout
        .translate(0, 8, 0)
        .stick.center()
        .rotate(0, 0, 0)
        .size(0.6, 3))
    bottomStick = WhiteShape.with();
```

# Troubleshooting

## Common pitfalls
### I get an error saying "Controller doesn't exist"
Make sure your controller is present in the array of controllers in your App class' static ```controllers``` property, and is correctly imported at the top of your App class file.

### My renderables are not shown
Make sure that the renderables in your View class are decorated with ```@layout``` decorators. Not having any decorators on properties in a View class will have those properties ignored by the rendering engine.

### My changes are not reflecting when I open www/index.html
Make sure you run ```npm run build``` after every change, or run ```npm run watch``` to rebuild on every file change.

### My DataBoundScrollView won't scroll if I drag in between the items
The FlexScrollView will not by default create listeners outside of the renderables it draws. You can either create a Famous surface behind the scrollView and .pipe() it to the scrollView, or <a href="https://github.com/IjzerenHein/famous-flex/blob/master/tutorials/FlexScrollView.md#clipping--containersurfaces">use a container</a> in the ScrollView.


# Conclusion

We will continue to improve Arva JS in every aspect, including performance, UX possibilities and code brevity. It's a framework
that is going to be frequently revised and evaluated for its goals.

Arva JS is sometimes referred to as *Arva foundation* or *Arva engine* and is a part of a bigger scheme of making
easy and attractive development possible for more people. *Arva Studio* is under development in order to provide a no-code
springboard for rapid application development.
