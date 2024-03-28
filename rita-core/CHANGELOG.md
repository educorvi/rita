# Change Log - @educorvi/rita

This log was last generated on Thu, 28 Mar 2024 16:26:46 GMT and should not be manually modified.

## 5.0.1

Thu, 28 Mar 2024 16:26:46 GMT

### Patches

-   Add tslib to dependencies

## 5.0.0

Tue, 14 Mar 2023 19:16:22 GMT

### Breaking changes

-   change conversion matrix for durations
-   refactor dateCalculation in extra type independent from calculation
-   atoms that are supposed to read dates have to have the 'isDate' property set to true
-   remove validate from evaluate
-   comparisons now need property "dates" set to true if comparing dates

### Patches

-   round calculation result to 12 decimals to avoid floating point weirdness

## 4.0.1

Wed, 20 Jul 2022 08:46:27 GMT

### Patches

-   Fix IDs in schema

## 4.0.0

Fri, 24 Jun 2022 12:22:43 GMT

### Breaking changes

-   Make evaluation async
-   Add support for plugins and remove XOR
