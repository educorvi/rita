# Change Log - @educorvi/rita

This log was last generated on Mon, 21 Oct 2024 08:48:52 GMT and should not be manually modified.

## 5.3.1

Mon, 21 Oct 2024 08:48:52 GMT

### Patches

-   fix incorrect comparisons

## 5.3.0

Mon, 21 Oct 2024 08:14:32 GMT

### Minor changes

-   allow defaults for atom values

## 5.2.1

Fri, 20 Sep 2024 13:53:01 GMT

### Patches

-   refactor getPropertyByStringMethod

## 5.2.0

Fri, 20 Sep 2024 12:55:57 GMT

### Minor changes

-   improve error handling

## 5.1.3

Fri, 06 Sep 2024 14:13:15 GMT

### Patches

-   don't fail on error due to calling `toString()` on undefined

## 5.1.2

Fri, 05 Jul 2024 12:45:38 GMT

### Patches

-   better error messages

## 5.1.1

Tue, 02 Jul 2024 11:35:12 GMT

### Patches

-   Update dependencies
-   check if data is defined when testing for length property

## 5.1.0

Fri, 21 Jun 2024 14:07:26 GMT

### Minor changes

-   add ´allowDifferentTypes´ option to comparisons

### Patches

-   support length on anything that has a length, not just arrays

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
