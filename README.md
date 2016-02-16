AngularJS Rate
=============================

**Angular Rate** is an AngularJS rating directive.

![rate example](https://raw.github.com/gaetansenn/angular-rate/master/rate.gif)

### Current Version 0.1.1

# Getting stated
Optionally: to install with bower, use:

```
bower install --save angular-rate
```

# Add AngularJS Rate

Add the module in your angular module.

````javascript
angular.module('main', ['angularRate']);
````

## How to use

Angular rate directive working with the element attribute and using the value from the ng-model.
 
 ```html
 <rate ng-model="rateValue" class="form-control"></rate>
 ```
 
 If you are using bootstrap framework you can also add the class 'form-control' as you will use with an input.
 
 For more advanced functionality you can add a couple of options:
 
 ```html
 <rate 
 	ng-model = "Number"
 	icon-empty = "String" (the class name of empty icon, default: 'fa-star-o')
 	icon-full = "String" (the class name of full icon, default: 'fa-star')
 	icon-half = "String" (the class name of half icon, default: 'fa-star-half-o')
 	icon-base = "String" (the class name of base icon, default: 'fa')
 	other-class = "String" (the other class to be injected for each stars)
 	readonly = "Boolean" (read only option)
 	>
 </rate>
 ```
 
 
 


