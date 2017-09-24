[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-formation)

# \<xtal-formation\>

\<xtal-formation\> declaratively creates objects or http request parameters based on the HTML Form element.

\<xtal-formation\> is somewhat inspired by Polymer's \<iron-form\> component.  The major differences are:

*  \<xtal-formation\> has no legacy Polymer dependencies
*  \<xtal-formation\> does not have any logic to actually submit the form. Instead, its focus is squarely on providing to other components the form input elements in various formats that might be most useful, and applying the validation logic built into the form element / input elements.

## Referencing \<xtal-formation\>

You can reference the component the Polymer < 3 way:

```html
<link rel="import" href="../xtal-formation.html">
```

But if you don't want to be tied to using HTML Imports, you can instead provide your own reference to Polymer.Element independently, from wherever you choose, and just reference the javascript file directly:


```html
<script async src="../xtal-formation.js"></script>
```

Or you can use ES6 modules:

```html
<script type="module" src="../xtal-formation.js"></script>
```


## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
