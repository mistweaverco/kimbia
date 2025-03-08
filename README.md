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

## Usage

Start by creating a `kimbia.yaml` file in the root of your project:

> [!INFO]
> You can also use `kimbia init` to generate a `kimbia.yaml` file.

```yaml
# yaml-language-server: $schema=https://kimbia.mwco.app/schema.json
---
tasks:
  - name: build
    description: Build the project
    commands:
      - platforms:
          - linux
          - mac
        run:
          - make build
      - platforms:
          - windows
        run:
          - build.bat

  - name: test
    description: Run the tests
    commands:
      - platforms:
          - linux
          - mac
          - windows
        run:
          - bun run test

  - name: deploy
    description: Deploy the project
    commands:
      - platforms:
          - linux
          - mac
          - windows
        run:
          - tofu deploy
```

Then run the tasks using the `kimbia` command:

```sh
kimbia run build test deploy
```

If one of the tasks fails,
Kimbia will stop and exit with a non-zero status code.
