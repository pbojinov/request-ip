# Change Log

## [Unreleased](https://github.com/pbojinov/request-ip/tree/HEAD)

[Full Changelog](https://github.com/pbojinov/request-ip/compare/2.0.0...HEAD)

**Implemented enhancements:**

- ES2015 Support [\#22](https://github.com/pbojinov/request-ip/issues/22)

## [2.0.0](https://github.com/pbojinov/request-ip/tree/2.0.0) (2017-03-07)
[Full Changelog](https://github.com/pbojinov/request-ip/compare/1.3.0...2.0.0)

**Closed issues:**

- optimized your code a bit \(no need to evalutate every option before choosing first one that matches. just evaluate then return on first match\) [\#15](https://github.com/pbojinov/request-ip/issues/15)

**Merged pull requests:**

- Refactor to ES6 [\#23](https://github.com/pbojinov/request-ip/pull/23) ([fluxsauce](https://github.com/fluxsauce))

## [1.3.0](https://github.com/pbojinov/request-ip/tree/1.3.0) (2017-03-03)
[Full Changelog](https://github.com/pbojinov/request-ip/compare/1.2.3...1.3.0)

**Closed issues:**

- Support Cloudflare? [\#20](https://github.com/pbojinov/request-ip/issues/20)
- How to receive IP in client [\#17](https://github.com/pbojinov/request-ip/issues/17)

**Merged pull requests:**

- Adding support for CF-Connecting-IP and True-Client-IP [\#21](https://github.com/pbojinov/request-ip/pull/21) ([fluxsauce](https://github.com/fluxsauce))
- Return once we find something and don't crash if req.headers is undefined [\#19](https://github.com/pbojinov/request-ip/pull/19) ([rokob](https://github.com/rokob))
- Ignore 'unknown' ip addresses in X-Forwarded-For header [\#18](https://github.com/pbojinov/request-ip/pull/18) ([raunc](https://github.com/raunc))

## [1.2.3](https://github.com/pbojinov/request-ip/tree/1.2.3) (2016-11-02)
[Full Changelog](https://github.com/pbojinov/request-ip/compare/1.2.2...1.2.3)

**Closed issues:**

- Are there any security concerns when saving the IP directly to a database? [\#16](https://github.com/pbojinov/request-ip/issues/16)
- I'm not getting local host ip address 127.0.0.1 [\#14](https://github.com/pbojinov/request-ip/issues/14)

## [1.2.2](https://github.com/pbojinov/request-ip/tree/1.2.2) (2016-01-27)
[Full Changelog](https://github.com/pbojinov/request-ip/compare/1.2.1...1.2.2)

## [1.2.1](https://github.com/pbojinov/request-ip/tree/1.2.1) (2016-01-27)
[Full Changelog](https://github.com/pbojinov/request-ip/compare/1.2.0...1.2.1)

**Merged pull requests:**

- introduce a built-in default implementation for a connect-middleware [\#12](https://github.com/pbojinov/request-ip/pull/12) ([osherx](https://github.com/osherx))

## [1.2.0](https://github.com/pbojinov/request-ip/tree/1.2.0) (2016-01-27)
[Full Changelog](https://github.com/pbojinov/request-ip/compare/1.1.4...1.2.0)

**Merged pull requests:**

- Cleanup [\#13](https://github.com/pbojinov/request-ip/pull/13) ([minecrawler](https://github.com/minecrawler))
- Got it working in a case that was returning null [\#11](https://github.com/pbojinov/request-ip/pull/11) ([andfaulkner](https://github.com/andfaulkner))

## [1.1.4](https://github.com/pbojinov/request-ip/tree/1.1.4) (2015-07-23)
[Full Changelog](https://github.com/pbojinov/request-ip/compare/1.1.3...1.1.4)

**Merged pull requests:**

- Add case management where you can not find the IP address [\#10](https://github.com/pbojinov/request-ip/pull/10) ([sitexw](https://github.com/sitexw))

## [1.1.3](https://github.com/pbojinov/request-ip/tree/1.1.3) (2015-04-20)
[Full Changelog](https://github.com/pbojinov/request-ip/compare/1.1.2...1.1.3)

## [1.1.2](https://github.com/pbojinov/request-ip/tree/1.1.2) (2015-04-04)
[Full Changelog](https://github.com/pbojinov/request-ip/compare/1.1.1...1.1.2)

## [1.1.1](https://github.com/pbojinov/request-ip/tree/1.1.1) (2015-04-04)
[Full Changelog](https://github.com/pbojinov/request-ip/compare/1.1.0...1.1.1)

**Closed issues:**

- needs semver [\#7](https://github.com/pbojinov/request-ip/issues/7)

## [1.1.0](https://github.com/pbojinov/request-ip/tree/1.1.0) (2015-04-04)
[Full Changelog](https://github.com/pbojinov/request-ip/compare/v0.0.4...1.1.0)

**Merged pull requests:**

- Update README.md [\#9](https://github.com/pbojinov/request-ip/pull/9) ([coolaj86](https://github.com/coolaj86))
- This deserves a production version number. [\#8](https://github.com/pbojinov/request-ip/pull/8) ([coolaj86](https://github.com/coolaj86))

## [v0.0.4](https://github.com/pbojinov/request-ip/tree/v0.0.4) (2015-01-16)
**Closed issues:**

- Invalid header [\#5](https://github.com/pbojinov/request-ip/issues/5)
- replace req.header\('X-Forwarded-For'\) for req.header\('X-Forwarder-For'\)\); [\#3](https://github.com/pbojinov/request-ip/issues/3)
- Nginx problems [\#2](https://github.com/pbojinov/request-ip/issues/2)

**Merged pull requests:**

- Add support for X-Real-IP Header [\#6](https://github.com/pbojinov/request-ip/pull/6) ([pmarques](https://github.com/pmarques))
- fix bug X-Forwarder-For [\#4](https://github.com/pbojinov/request-ip/pull/4) ([morello-cl](https://github.com/morello-cl))
- Add a Bitdeli Badge to README [\#1](https://github.com/pbojinov/request-ip/pull/1) ([bitdeli-chef](https://github.com/bitdeli-chef))



\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*