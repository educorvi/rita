## [3.0.2](https://github.com/educorvi/rita-http/compare/v3.0.1...v3.0.2) (2022-04-12)


### Bug Fixes

* fix docker release ([afbe7fd](https://github.com/educorvi/rita-http/commit/afbe7fd565ded904f3afa637fd157ba1e24b227f))

## [3.0.1](https://github.com/educorvi/rita-http/compare/v3.0.0...v3.0.1) (2022-04-12)


### Bug Fixes

* create docker image on release ([9882bef](https://github.com/educorvi/rita-http/commit/9882bef003ba3ba6304e5b8bee0fcac82bdf5930))

# [3.0.0](https://github.com/educorvi/rita-http/compare/v2.0.2...v3.0.0) (2022-04-12)


### Bug Fixes

* updated dependencies ([8bd5e2a](https://github.com/educorvi/rita-http/commit/8bd5e2a32722b41077e7710f21d3529997a73cdd))


### BREAKING CHANGES

* Updated rita to v3

## [2.0.2](https://github.com/educorvi/rita-http/compare/v2.0.1...v2.0.2) (2022-03-15)


### Bug Fixes

* update persistent-rita to correctly import Database Config ([536399c](https://github.com/educorvi/rita-http/commit/536399c8c3e6c4b9003c9d18b54065fa90174d94))

## [2.0.1](https://github.com/educorvi/rita-http/compare/v2.0.0...v2.0.1) (2022-03-15)


### Bug Fixes

* update persistent-rita ([49bae68](https://github.com/educorvi/rita-http/commit/49bae683fc157be08451e9a1229cf5b1d19f4912))

# [2.0.0](https://github.com/educorvi/rita-http/compare/v1.0.2...v2.0.0) (2022-03-11)


### Build System

* drop support for node<14 ([710770b](https://github.com/educorvi/rita-http/commit/710770b0e554dbe34c54b999e1d9d8ab2a2ad8b3))


### Features

* api keys ([c5cb059](https://github.com/educorvi/rita-http/commit/c5cb0591b27ac46b461dd3d93f5fb5ddf0fe7758)), closes [#5](https://github.com/educorvi/rita-http/issues/5)
* configure database connection with the .env file ([421634a](https://github.com/educorvi/rita-http/commit/421634a7f716b625bb4767997700adc28467a14c)), closes [#9](https://github.com/educorvi/rita-http/issues/9)
* docker(-compose) for rita-http ([79a1283](https://github.com/educorvi/rita-http/commit/79a12839c52828c0f918fb711c6c2e6a660acd59)), closes [#32](https://github.com/educorvi/rita-http/issues/32)
* evaluation route ([01f8db9](https://github.com/educorvi/rita-http/commit/01f8db92e42452c3fc6c4c9f1a637ab890edefd7))
* management route ([73f5b7e](https://github.com/educorvi/rita-http/commit/73f5b7e9986c58ce6a9a9ce1b37a75fd4bedf82e))
* support .env configuration ([e9e018a](https://github.com/educorvi/rita-http/commit/e9e018a96482d5ed97704a3cd22d4be80e7ed661))


### BREAKING CHANGES

* Node version <14 no longer supported use version 14 or higher instead

Signed-off-by: Julian Pollinger <julian.pollinger@jp-studios.de>
* Rulesets are not read from the local .json file
* API Routes have changed

Signed-off-by: Julian Pollinger <julian.pollinger@jp-studios.de>

## [1.0.2](https://github.com/educorvi/rita-http/compare/v1.0.1...v1.0.2) (2021-10-29)


### Bug Fixes

* endpoints on startpage ([196f29f](https://github.com/educorvi/rita-http/commit/196f29fbc3b9d7a188f254d401cf1859394beaf9))

## [1.0.1](https://github.com/educorvi/rita-http/compare/v1.0.0...v1.0.1) (2021-10-29)


### Bug Fixes

* fixes scripts ([bd85d06](https://github.com/educorvi/rita-http/commit/bd85d06b31da919cdf5ab2018344be39c54561c2))
* log access on debug level ([db7f1d6](https://github.com/educorvi/rita-http/commit/db7f1d6a2de126adf7f144ea7e2bdfe172b4063f))

# 1.0.0 (2021-10-29)


### Features

* basic http server ([9c5e9d3](https://github.com/educorvi/rita-http/commit/9c5e9d37911b0566e8670c885862e15b09320fe0))
