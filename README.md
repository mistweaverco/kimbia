<div align="center">

![Kimbia Logo](assets/logo.svg)

# Kimbia

[![NPM](https://img.shields.io/npm/v/@mistweaverco/kimbia?style=for-the-badge)](https://www.npmjs.com/package/@mistweaverco/kimbia)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=FFF)](https://www.typescriptlang.org/)
[![Rollup](https://img.shields.io/badge/Rollup-bd0f0f.svg?style=for-the-badge&logo=rollup.js&logoColor=FFF)](https://rollupjs.org/)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/mistweaverco/kimbia?style=for-the-badge)](https://github.com/mistweaverco/kimbia/releases/latest)

[Install](#install) • [Usage](#usage)

<p></p>

A minimal cross-platform task runner.

<p></p>

Kimbia is swahili for "run".

<p></p>

</div>

## Install

Via npm:

```sh
npm install -g @mistweaverco/kimbia
```

Via yarn:

```sh
yarn global add @mistweaverco/kimbia
```

Via bun

```sh
bun install -g @mistweaverco/kimbia
```

Via pnpm

```sh
pnpm install -g @mistweaverco/kimbia
```

## Usage

Start by creating a `kimbia.yaml` file in the root of your project:

```sh
kimbia init
```

Then run the tasks using the `kimbia` command:

```sh
kimbia run lint test build deploy
```

If one of the tasks fails,
Kimbia will stop and exit with a non-zero status code.
