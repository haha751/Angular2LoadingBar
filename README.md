# Angular2LoadingBar
Angular 2 Loading Bar

Based on https://github.com/chieffancypants/angular-loading-bar and idea from
(@rodrigouroz) https://github.com/rodrigouroz 
[source from https://github.com/angular/angular/issues/2684]

## Usage:
1. include the loading bar as a dependency for your app.
    ```js
    bootstrap(AppComponent, [ LoadingBar.LOADING_BAR_PROVIDERS ]);
    ```
2. render tag loading-bar int your root component (and set directive LoadingBar to component directives)
    ```html
    <loading-bar></loading-bar>
    ```
3. That's it -- you're done!

#### Yes, this is not the best solution, but I don't have another at this moment