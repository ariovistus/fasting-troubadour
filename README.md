Some useful binding behaviors for aurelia.


## Installation

### jspm

jspm install fasting-troubadour=github:ariovistus/fasting-troubadour

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

## Number Format

A value converter to format numbers that wraps numeraljs. You've probably seen it in every value converter tutorial you've read.

```html
<require from="fasting-troubadour/number-format"></require>

${ val | numberFormat:'0.0000' }
```
