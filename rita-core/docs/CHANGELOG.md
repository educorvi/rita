## [3.1.2](https://github.com/educorvi/rita/compare/v3.1.1...v3.1.2) (2022-05-05)


### Bug Fixes

* **schema:** add missing `"type": "object"` to quantifier.json ([65b2210](https://github.com/educorvi/rita/commit/65b2210346f4f69d520738ceca1629f3067f2182))

## [3.1.1](https://github.com/educorvi/rita/compare/v3.1.0...v3.1.1) (2022-04-28)


### Bug Fixes

* export enums ([238bbdb](https://github.com/educorvi/rita/commit/238bbdb4635294ea7e01a44137a6b2dc941bfe9f))

# [3.1.0](https://github.com/educorvi/rita/compare/v3.0.0...v3.1.0) (2022-04-26)


### Bug Fixes

* fix validation ([e25b38a](https://github.com/educorvi/rita/commit/e25b38a29c746221c7bd0b34062ad5c3fede8586))


### Features

* macros ([2dc01ec](https://github.com/educorvi/rita/commit/2dc01ec3f7cefda40c8903a99743e44294db1d18)), closes [#13](https://github.com/educorvi/rita/issues/13)

# [3.0.0](https://github.com/educorvi/rita/compare/v2.0.0...v3.0.0) (2022-04-12)


### Bug Fixes

* renamed various things for consistency ([4bc20a6](https://github.com/educorvi/rita/commit/4bc20a63be78387b2babe699ab676bdc2ac251b7))


### Features

* add Quantifiers ([92d4d56](https://github.com/educorvi/rita/commit/92d4d56f9f9a46c0dba4d66126b6023133b1bdee)), closes [#9](https://github.com/educorvi/rita/issues/9)
* export version number ([ec30608](https://github.com/educorvi/rita/commit/ec3060817b5b12a3b6dba95c19a4f8e51d235245))


### BREAKING CHANGES

* Term is now called Formula and parameters are now called arguments

# [2.0.0](https://github.com/educorvi/rita/compare/v1.3.6...v2.0.0) (2022-03-03)


### Bug Fixes

* do not use array extension for evaluate all ([e2db467](https://github.com/educorvi/rita/commit/e2db4679a7b8dd2843598252063c5c65aa71497d)), closes [#22](https://github.com/educorvi/rita/issues/22)


### Build System

* drop support for node <14 ([8a09ee2](https://github.com/educorvi/rita/commit/8a09ee21b680e20e4d02fed1772def258c969802))


### BREAKING CHANGES

* Use node 14 or later
* Arrays returned by rita can no longer be evaluated by using `Array.evaluateAll(data)`.
Instead the function `evaluateAll(rules, data)` can be imported from the package.

## [1.3.6](https://github.com/educorvi/rita/compare/v1.3.5...v1.3.6) (2022-01-05)


### Bug Fixes

* **implementation:** fix enum for comparisons ([d305b33](https://github.com/educorvi/rita/commit/d305b33455ae311cba0cea12a942ebe92ec60e22)), closes [#19](https://github.com/educorvi/rita/issues/19) [#20](https://github.com/educorvi/rita/issues/20)

## [1.3.5](https://github.com/educorvi/rita/compare/v1.3.4...v1.3.5) (2021-12-17)


### Bug Fixes

* better errors ([c6423af](https://github.com/educorvi/rita/commit/c6423af1096189c60b9e517d045ab265a7f824fd)), closes [#12](https://github.com/educorvi/rita/issues/12)

## [1.3.4](https://github.com/educorvi/rita/compare/v1.3.3...v1.3.4) (2021-11-26)


### Bug Fixes

* export Errors ([20a8194](https://github.com/educorvi/rita/commit/20a8194ea8de384c0aff1c3ef10260d516025a1c)), closes [#12](https://github.com/educorvi/rita/issues/12)

## [1.3.3](https://github.com/educorvi/rita/compare/v1.3.2...v1.3.3) (2021-11-26)


### Bug Fixes

* export Logger ([afee761](https://github.com/educorvi/rita/commit/afee761a5d087d346cdde6cd5390e8d518fd7086)), closes [#15](https://github.com/educorvi/rita/issues/15)

## [1.3.2](https://github.com/educorvi/rita/compare/v1.3.1...v1.3.2) (2021-11-19)


### Bug Fixes

* include dist in release ([958f928](https://github.com/educorvi/rita/commit/958f9285b8536b061ecb88a86f44fe3e48186615))

## [1.3.1](https://github.com/educorvi/rita/compare/v1.3.0...v1.3.1) (2021-11-19)


### Bug Fixes

* change scripts ([4baf0f5](https://github.com/educorvi/rita/commit/4baf0f5b4c0fc5eea33835879786ec5342a522a6))

# [1.3.0](https://github.com/educorvi/rita/compare/v1.2.1...v1.3.0) (2021-11-19)


### Bug Fixes

* change format from date to date-time ([7f7826b](https://github.com/educorvi/rita/commit/7f7826b53f563ff492c575d65bb68e213ec8a66b))
* parse rule comment ([2662da4](https://github.com/educorvi/rita/commit/2662da47826ac3b7a6774263f5b579266bc8594c))
* **implementation:** add debug level to Logger ([51c9d7e](https://github.com/educorvi/rita/commit/51c9d7e15680c68202d6f0a9243c4b2f16606705))
* **implementation:** fix imports ([d119905](https://github.com/educorvi/rita/commit/d1199051f4e467bf3ae95a66b6b8ff7d9c275e66))
* **implementation:** renamed Logger critical to warn ([e95fc0f](https://github.com/educorvi/rita/commit/e95fc0fffec5625cda889d4bbec2908ea2a23fa0))
* **implementation:** toJSONReady in calculation ([96d2b9b](https://github.com/educorvi/rita/commit/96d2b9b9a15cd093f56a2a5ded69f50adea2b5a5))
* **implementation:** toJSONReady in Comparison ([7255b95](https://github.com/educorvi/rita/commit/7255b95b077172300c159b47e08479fb0e475294))
* **schema:** fix format of dates ([dfa1d37](https://github.com/educorvi/rita/commit/dfa1d37d5b3b0d3575080c9aaa8cb1478d1a7c4c))
* **schema:** minor fixes in schema and example ([e656d3f](https://github.com/educorvi/rita/commit/e656d3fc08d7e62e2f39df6964bba76dc00792a6))
* **schema:** typo ([824e364](https://github.com/educorvi/rita/commit/824e364c8e63465a950632e67fb297abde21fcb3))
* correct format of date in schema and add format validation to ajv to validate schema ([5ac3e20](https://github.com/educorvi/rita/commit/5ac3e206c77d8f76b8618a1adfb1c25ed3d3d8e2))


### Features

* **implementation:** calculation ([82fe495](https://github.com/educorvi/rita/commit/82fe495b654b2dfa4370d27f54bc8cecedd851cb))
* **implementation:** calculation and comparison ([9e1f0aa](https://github.com/educorvi/rita/commit/9e1f0aa4328b9359bbb2075dbb6147c52e1a3ecb))
* string comparison ([cc904c7](https://github.com/educorvi/rita/commit/cc904c73e19657c3bd265a8d4544b8bda4696a50)), closes [#6](https://github.com/educorvi/rita/issues/6)
* **implementation:** evaluateAll ([23ece22](https://github.com/educorvi/rita/commit/23ece2206ae33c4b4998e4d3cce73d872f94d378)), closes [#4](https://github.com/educorvi/rita/issues/4)
* **schema:** add ability to use basic math and compare numbers/dates ([edb5337](https://github.com/educorvi/rita/commit/edb53370e43cf852762c6e8979e3b39442f7c5ae))
* **schema:** add comment to rule ([580ac43](https://github.com/educorvi/rita/commit/580ac4356a584f35ec97554ecc41a1bc5fdcc62a))
