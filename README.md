[![npm version](https://badge.fury.io/js/fasting-troubadour.svg)](http://badge.fury.io/js/fasting-troubadour)

Some useful binding behaviors for aurelia.


## Installation

npm install fasting-troubadour

for requirejs based cli, add to aurelia.json dependencies:

```json
          {
              "name": "fasting-troubadour",
              "path": "../node_modules/fasting-troubadour/dist",
              "main": "index"
          }
```

you can also register it as a plugin in main.ts:

```
      aurelia.use
          .plugin("fasting-troubadour")
```

this is optional, it will just register all of the binding behaviors as global resources

## Trim

trims leading and trailing whitespace

```html
<require from="fasting-troubadour/trim-binding-behavior"></require>

<input type="text" value.bind="val & trim" />
```

Notes
- if you are using aurelia-validation, be sure to place trim after validate

```html
<!-- bad (has cause me problems in the past) -->
<input type="text" value.bind="val & trim & validate" />


<!-- ok -->
<input type="text" value.bind="val & validate & trim" />
```

## Formatted Number

formats number inputs after you tab away. Controls the minimum and maximum permitted values; the bound value is expected to be a number.

```html
<require from="fasting-troubadour/formatted-number-behavior"></require>

<input type="text" value.bind="dollars & formattedNumber"/>

<!-- custom format -->
<input type="text" value.bind="dollars & formattedNumber:'0.00000'"/>

<!-- custom format and min/max -->
<input type="text" value.bind="dollars & formattedNumber:'0.00000':0:1000000"/>
```

Notes
- numeraljs is the formatting engine
- default format is '0.00'
- you can emit an event to force the displayed value to be formatted

```js
    this.eventAggregator.publish("formatted-number:refresh");
```


## Numeric Input

constrains input to only accept numeric characters. Bound value is not expected to be a number (eg a string)

```html
<require from="fasting-troubadour/numeric-input-behavior"></require>

<input type="text" value.bind="zip & numericInput"/>
```

## Alphanumeric Input

constrains input to only accept alphanumeric characters. 

```html
<require from="fasting-troubadour/alphanumeric-input-behavior"></require>

<input type="text" value.bind="zip & alphanumericInput"/>
```

## Name Input

constraints input to only accept alpha characters or space, apostraphe, or dash

```html
<require from="fasting-troubadour/name-input-behavior"></require>

<input type="text" value.bind="zip & nameInput"/>
```

Notes
- todo: accept more than english alphanumeric characters

## Numeric Name Input

constraints input to only above name characters or numeric characters.

```html
<require from="fasting-troubadour/numeric-name-input-behavior"></require>

<input type="text" value.bind="zip & numericNameInput"/>
```

## Custom Characters Input

constrains input to only the characters matched by the provided regex.

```html
<require from="fasting-troubadour/custom-chars-input-behavior"></require>

<input type="text" value.bind="zip & customCharsInput:myRegex"/>
```

Notes
- regex is applied to each character - e.g. regex="[a-z]" will allow the entire input to be "a", "aa", "aaz", etc.

## Number Format

A value converter to format numbers that wraps numeraljs. You've probably seen it in every value converter tutorial you've read.

```html
<require from="fasting-troubadour/number-format"></require>

${ val | numberFormat:'0.0000' }
```
