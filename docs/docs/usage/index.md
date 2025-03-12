---
sidebar_position: 4
---

# Usage

At the heart of Kimbia are three commands: `kimbia run` and `kimbia describe` and `kimbia list`.

## Run

The `run` command is used to run one ore more tasks.
You can run one or more tasks by providing the task names as arguments,
separated by spaces.

```sh
kimbia run [task-names]
```

## Describe

The `describe` command is used to describe one or more tasks.

```sh
kimbia describe [task-names]
```

Let's say you have a task called `deploy-web` in your `kimbia.yaml` file.

```sh
kimbia describe deploy-web
```

Will output something like this:

```
🐆 Task: deploy-web
--------------------------------------------------------------------------------

 Deploy the web dashboard

 Needs the following tools:

 • terraform
 • docker


--------------------------------------------------------------------------------
Command:
  Platforms: linux, mac
╭────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ DOCKER_IMAGE="europe-west3-docker.pkg.dev/$GCP_PROJECT/$GCP_SERVICE/$GCP_SERVICE"                                                              │
│                                                                                                                                                │
│ # get short git commit hash                                                                                                                    │
│ GIT_COMMIT=$(git rev-parse --short HEAD) || \                                                                                                  │
│   (echo "Failed to get git commit hash" && exit 1);                                                                                            │
│                                                                                                                                                │
│ # Workaround for bitbucket pipelines                                                                                                           │
│ # See: https://community.atlassian.com/t5/Bitbucket-questions/Docker-build-failing-for-buildkit-with-error-authorization/qaq-p/2377667#M94515  │
│ export PATH=/usr/bin:$PATH                                                                                                                     │
│                                                                                                                                                │
│ # Enable Buildkit                                                                                                                              │
│ # See: https://bitbucket.org/blog/announcing-support-for-docker-buildkit-in-bitbucket-pipelines                                                │
│ # See: https://docs.docker.com/build/buildkit/#getting-started                                                                                 │
│ export DOCKER_BUILDKIT=1                                                                                                                       │
│                                                                                                                                                │
│ cd web || \                                                                                                                                    │
│   (echo "web directory not found" && exit 1);                                                                                                  │
│                                                                                                                                                │
│ (bun install --frozen-lockfile && bun run build) || \                                                                                          │
│   (echo "Build failed" && exit 1);                                                                                                             │
│                                                                                                                                                │
│ # Build docker image                                                                                                                           │
│ docker build -t "$DOCKER_IMAGE:$GIT_COMMIT" -f Dockerfile . || \                                                                               │
│   (echo "Failed to build docker image" && exit 1);                                                                                             │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭────────────────────────────────────────────────────────────────────────────────────╮
│ gcloud auth configure-docker "europe-west3-docker.pkg.dev" --quiet                 │
│                                                                                    │
│ DOCKER_TAG=$(git rev-parse --short HEAD)                                           │
│ DOCKER_IMAGE="europe-west3-docker.pkg.dev/$GCP_PROJECT/$GCP_SERVICE/$GCP_SERVICE"  │
│                                                                                    │
│ docker push "$DOCKER_IMAGE:$DOCKER_TAG"                                            │
│ docker tag "$DOCKER_IMAGE:$DOCKER_TAG" "$DOCKER_IMAGE:latest-$DEPLOY_ENVIRONMENT"  │
│ docker push "$DOCKER_IMAGE:latest-$DEPLOY_ENVIRONMENT"                             │
╰────────────────────────────────────────────────────────────────────────────────────╯
╭───────────────────────────────────────────────────╮
│ GIT_COMMIT_ID=$(git rev-parse --short HEAD)       │
│ export TF_VAR_docker_tag="$GIT_COMMIT_ID"         │
│                                                   │
│ cd iac/app || \                                   │
│   (echo "iac/app directory not found" && exit 1)  │
│                                                   │
│ terraform init -reconfigure -input=false || \     │
│   (echo "terraform init failed" && exit 1)        │
│                                                   │
│ terraform apply -auto-approve || \                │
│   (echo "terraform apply failed" && exit 1)       │
╰───────────────────────────────────────────────────╯
```

Here, you can see the description of the task, the tools needed to run the task,
and the commands that will be run.

The list in the description has rendered hyperlinks (depending on your terminal),
that you can click on to open the link in your browser.

You can suppress the fancy output by using the `--no-fancy` flag.

```sh
kimbia describe deploy-web --no-fancy
```

Or you can use the `--output` flag to get the output in JSON format.

```sh
kimbia describe deploy-web --output json
```

## List

The `list` command is used to list *all* tasks in your `kimbia.yaml` file.

```sh
kimbia list
```

By default, it will only show the tasks that are available on the current platform.

If you want to see all tasks, you can use the `--all` flag.

```sh
kimbia list --all
```
