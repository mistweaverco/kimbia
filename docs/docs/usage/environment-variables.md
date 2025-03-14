---
title: Environment Variables
---
# Environment Variables

Kimbia has built-in support for environment variables,
via dotenv files.

## Usage

Create a `.env` file in the root of your project.

```sh
touch .env
```

Add your environment variables to the `.env` file.

```sh title=".env"
GCP_PROJECT=my-project
GCP_SERVICE=my-service
```

You can now use these environment variables in your `kimbia.yaml` file.

```yaml
# yaml-language-server: $schema=https://kimbia.mwco.app/schema.json
---
tasks:

  - name: deploy-web
    description: Deploy the web application
    commands:
      - platforms:
          - linux
          - windows
          - mac
        run:
          - echo "Deploying web application to $GCP_PROJECT/$GCP_SERVICE"
```

## Inline

If you want to have specific environment variables for a task,
you can define them inline.

```yaml
# yaml-language-server: $schema=https://kimbia.mwco.app/schema.json
---
tasks:

  - name: deploy-web
    description: Deploy the web application
    commands:
      - platforms:
          - linux
          - mac
        env:
          - key: GCP_PROJECT
            value: my-project
          - key: GCP_SERVICE
            value: my-service
          - key: GIT_COMMIT_SHORT
            value: $(git rev-parse --short HEAD)
        run:
          - echo "Deploying web application to $GCP_PROJECT/$GCP_SERVICE:$GIT_COMMIT_SHORT"
```

## Inherit

You can also inherit environment variables from the parent task,
so that it is available to all child commands.

```yaml
# yaml-language-server: $schema=https://kimbia.mwco.app/schema.json
  - name: example
    description: Just an example task
    env:
      - key: GIT_COMMIT_SHORT
        value: $(git rev-parse --short HEAD)
    commands:
      - platforms:
          - linux
          - windows
          - mac
        env:
          - key: NODE_ENV
            value: test123
        run:
          - echo $GIT_COMMIT_SHORT
          - echo $NODE_ENV
```

## Dynamic

You can also pass environment variables to the `kimbia` command.

```sh
GCP_PROJECT=my-project GCP_SERVICE=my-service kimbia run deploy-web
```
