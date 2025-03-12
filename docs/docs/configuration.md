---
sidebar_position: 3
---

# Configuration

Kimbia is configured via a `kimbia.yaml` file in the root of your project.

This file is used to define tasks and their associated commands.

For a quick start, you can use the following command to generate a `kimbia.yaml` file:

```sh
kimbia init
```

The following is an example configuration:

```yaml
# yaml-language-server: $schema=https://kimbia.mwco.app/schema.json
---
tasks:

  - name: publish
    description: |
      Publish the project

      You need [bun](https://bun.sh) to run this task.
    commands:
      - platforms:
          - linux
          - windows
          - mac
        run:
          - bun run build
          - bun publish

  - name: create-release
    description: |
      Publish the project

      You need the following tools to run this task:
      - [bun](https://bun.sh)
      - node 22+ (for `postject`)
      - codesign (for mac)
        - to remove signature
      - pwsh & signtool (for windows)
        - to remove signature

      Postject is a tool to inject a binary into a binary.

      [See single executable applicaton](https://nodejs.org/api/single-executable-applications.html)
      for more information.
    commands:

      - platforms:
          - linux
          - windows
          - mac
        run:
          - bun run build
          - node --experimental-sea-config sea-config.json

      - platforms:
          - linux
        arch:
          - arm64
        run:
          - cp $(command -v node) dist/kimbia-linux-arm64
          - |
            postject dist/kimbia-linux-arm64 NODE_SEA_BLOB dist/sea-prep.blob \
              --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

      - platforms:
          - linux
        arch:
          - x64
        run:
          - cp $(command -v node) dist/kimbia-linux-x64
          - |
            postject dist/kimbia-linux-x64 NODE_SEA_BLOB dist/sea-prep.blob \
            --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

      - platforms:
          - mac
        arch:
          - arm64
        run:
          - cp $(command -v node) dist/kimbia-macos-arm64
          - codesign --remove-signature dist/kimbia-macos-arm64
          - chmod 755 dist/kimbia-macos-arm64
          - |
            postject dist/kimbia-macos-arm64 NODE_SEA_BLOB dist/sea-prep.blob \
              --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 \
              --macho-segment-name NODE_SEA

      - platforms:
          - mac
        arch:
          - x64
        run:
          - cp $(command -v node) dist/kimbia-macos-x64
          - codesign --remove-signature dist/kimbia-macos-x64
          - chmod 755 dist/kimbia-macos-x64
          - |
            postject dist/kimbia-macos-x64 NODE_SEA_BLOB dist/sea-prep.blob \
              --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 \
              --macho-segment-name NODE_SEA

      - platforms:
          - windows
        arch:
          - x64
        run:
          - node -e "require('fs').copyFileSync(process.execPath, 'dist/kimbia-x64.exe')"
          - pwsh -ExecutionPolicy Bypass -File scripts\sign.ps1
          - pwsh -ExecutionPolicy Bypass -File scripts\postiject.ps1

  - name: upload-release
    description: |
      Upload the release

      You need the following tools to run this task:
      - [gh](https://cli.github.com)
      - [jq](https://stedolan.github.io/jq/)
    commands:

      - platforms:
          - linux
        arch:
          - arm64
        run:
          - |
            gh release \
            create v$(jq -r .version package.json) \
            --generate-notes || true
            gh release upload \
            --clobber v$(jq -r .version package.json) \
            dist/kimbia-linux-arm64

      - platforms:
          - linux
        arch:
          - x64
        run:
          - |
            gh release \
            create v$(jq -r .version package.json) \
            --generate-notes || true
            gh release upload \
            --clobber v$(jq -r .version package.json) \
            dist/kimbia-linux-x64

      - platforms:
          - mac
        arch:
          - x64
        run:
          - |
            gh release \
            create v$(jq -r .version package.json) \
            --generate-notes || true
            gh release upload \
            --clobber v$(jq -r .version package.json) \
            dist/kimbia-macos-x64

      - platforms:
          - mac
        arch:
          - arm64
        run:
          - |
            gh release \
            create v$(jq -r .version package.json) \
            --generate-notes || true
            gh release upload \
            --clobber v$(jq -r .version package.json) \
            dist/kimbia-macos-arm64

      - platforms:
          - windows
        arch:
          - x64
        run:
          - pwsh -ExecutionPolicy Bypass -File scripts\gh-release.ps1

  - name: web
    description: |
      Run the website locally

      You need [bun](https://bun.sh) to run this task.
    commands:
      - platforms:
          - linux
          - mac
        run:
          - cd web && bun install --frozen-lockfile && bun run dev

```
