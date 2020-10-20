<p align="center">
  <a href="" rel="noopener">
 <!-- <img width=200px height=200px src="https://i.imgur.com/6wj0hh6.jpg" alt="Project logo"></a> -->
</p>

<h3 align="center">Teacher-O-Matic</h3>

<div align="center">

[![Status](https://img.shields.io/github/workflow/status/itggot-TE4/Fire-experts/tests/master?label=Tests%20Master&style=for-the-badge&branch=dev)]()
[![Status](https://img.shields.io/github/workflow/status/itggot-TE4/Fire-experts/tests/dev?label=Tests%20Dev&style=for-the-badge&branch=master)]()
[![GitHub Issues](https://img.shields.io/github/issues/itggot-TE4/Fire-experts.svg?style=for-the-badge)](https://github.com/itggot-TE4/Fire-experts/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/itggot-TE4/Fire-experts.svg?style=for-the-badge)](https://github.com/itggot-TE4/Fire-experts/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](/LICENSE)

</div>

---

<p align="center"> Teacher-O-Matic is a program that with the help of the GitHub API let's teachers easily see, comment, and review a students code.
    <br> 
</p>

## About

The purpose of this project is to help streamline the process for teachers to view, comment, and grade their students' code.

This is achieved by allowing the teacher to view forks of a GitHub repository containing a ```.manifest.json``` file. The ```.manifest.json``` contains a path to a file which is supposed to be graded, as well as specifications of what language the function(s) is (are) written in and the results from provided tests.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Required software to get up and running.

```
Ruby > 2.6.x
Node > 14.9.x
```

You will also need a GitHub account to get started.

### Installing
Clone this repository and run the following commands:

```
$ npm install
$ bundle install
```

To make the application work as inteded you will also need to add a ```.env``` file with the following content.
Replace XXX with the GitHub OAuth clientID and secret ID as provided when configuring your GitHub [application](https://github.com/settings/developers).

```
GH_BASIC_CLIENT_ID=xxxxxxxxxxxxxxxxxzxxxxxxxx
GH_BASIC_SECRET_ID=xxxxxxxxxxxxxxxxxzxxxxxxxx
```

To start the server run

```
$ rackup
```
The server should now be served on port `9292` unless otherwise specified.

## Running the tests

To run ESlint use ``` npm run lint ``` <br>
To run test use ``` npm run test ```

## Built Using

- [Sinatra](http://sinatrarb.com/) - Server Framework
- [VueJs](https://materializecss.com/) - Style, Scripting Framework
- [NodeJs](https://nodejs.org/en/) - Testing Enviroment

## Authors

- [@te4-adrian-almetun-smeds](https://github.com/te4-adrian-almetun-smeds)
- [@te4-andre-skvarc](https://github.com/te4-andre-skvarc)
- [@te4-david-jensen](https://github.com/te4-david-jensen)
- [@te4-tintin-wihlborg](https://github.com/te4-tintin-wihlborg)

See also the list of [contributors](https://github.com/itggot-TE4/Fire-experts/contributors) who participated in this project.

## Acknowledgements

- Hats off to anyone whose code was used
