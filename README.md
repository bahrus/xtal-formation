# \<xtal-formation\>

\<xtal-formation\> declaratively creates objects or http request parameters based on the HTML Form element.

\<xtal-formation\> is somewhat inspired by Polymer's \<iron-ajax\> component.  The major differences are:

*  \<xtal-formation\> has no legacy Polymer dependencies
*  \<xtal-formation\> does not have any logic to actually submit the form. Instead, its focus is squarely on providing to other components the form input elements in various formats that might be most useful, and applying the validation logic built into the form element / input elements.


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
