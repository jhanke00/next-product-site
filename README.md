# NextJS Product Site

Mock NextJS Product Application for Testing

## Context

This is a dummy product site that needs help adding new features and maturing the project. We are looking for developers who want to help improve various aspects of the site: adding new features, updating the APIs, or improving the project's CI/CD just to name a few. Currently, the project is a basic NextJS application with some tooling built into the project's setup. There are three types of mock data provided: products, users, and orders. Orders link users to products that they have purchased. There are two sizes in JSON format: large (1000+ entries) and small (<= 100 entries).

### What is Current State

- NextJS (`/app` or `/pages`)
- Mock Data (`/src/mock`)
- GitHub Actions for CI/CD (`/.github`)
- Jest (`/tests`)
- Storybook (`/.storybook`)
- Husky (`/.husky`)
- Docs (`/docs`)
- Types (`/src/type`)
- Environment Variables (`.env.local`)
- Prettier
- ESLint
- Folder Structure
- Mock Product Page (`/app/products`)

## Getting Started

### Prerequisite

- [Install Node v18+](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
- [Install PNPM v8+](https://pnpm.io/installation)
- [Install Docker Desktop](https://www.docker.com/products/docker-desktop)

### Setup

1. Clone the repository with `git clone` or fork the repository.
2. Run `pnpm i` to install dependencies.
3. Run `pnpm dev` to start application.
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Codespaces is also available and is pre-configured with node and pnpm.

### Storybook

1. Run `pnpm storybook`
2. Open [http://localhost:6006/](http://localhost:6006/) with your browser to see the result.

### Jest

1. Run `pnpm test`

## Task

Select one of the four areas to contribute to and help enhance the application with features that might not be present. Look at the [GitHub Issues](https://github.com/jhanke00/next-product-site/issues) for capabilities to work on. Feature requests will have the `feature request` label associated with the GitHub Issue and may encompass one or multiple areas of focus. You are not limited to one issue. If you are working on multiple issues, make sure to assign the issues to yourself and link it in your PR.

You can also come up with your own feature request if there are none that cover what you want to contribute. The issues are there to be picked up or to give you an idea of what can be worked on. [Create a new feature request](https://github.com/jhanke00/next-product-site/issues/new?assignees=&labels=feature+request&projects=&template=FEATURE_REQUEST.yml&title=%5BNew+Feature%5D%3A+) that covers what you will be working on and add the appropriate labels for the area of focus that the feature covers.

If you choose to add infrastructure, make sure that it can run locally with Docker. Update the `README.md` with additional local setup information.

> Remember we want to understand your thought process, so if you are unable to complete the changes please note down what has been attempted and what is left to complete.

## Areas of Focus

Setup your PRs based on the following areas of focus. For all changes, please detail what you planned on doing to make those changes in the `/docs` folder and define the MVP.

### Frontend

1. Create a new folder under `/app` or `/pages` directory, which will store a new route on the site if you are creating a page. (Ex: `/app/product-search`)
2. Create custom components under `/src/components` and utility functions under `/src/utils` as a directory with the same name as the capability folder. (Ex: `/src/components/product-search`)
3. Create a Markdown file in the `/docs` folder detailing what you are trying to build, how it is used within the application, and how to test your changes. (Ex: `/docs/frontend/products.md`)

### Backend

1. Create a new folder under `/app/api` or `/pages/api` directory, which will store your API route. (Ex: `/app/api/products`)
2. Create utility functions under `/src/utils` as a directory with the same name as the API route. (Ex: `/src/utils/products`)
3. Create a Markdown file in the `/docs` folder detailing what you are trying to build, how it is used within the application, and how to test your changes. (Ex: `/docs/backend/products-api.md`)

### DevOps

1. Create a new workflow file under `/.github/workflows` or actions folder under `/.github/actions`, which will store changes to the GitHub Actions. (Ex: `/.github/workflows/deploy.yml`)
2. Updates to the project can be made directly to the root and additional configuration files may also be created as well. (Ex: `Dockerfile`)
3. Create a Markdown file in the `/docs` folder with the name of your change detailing what you are trying to build, how it is used within the project, and how to test your changes. (Ex: `/docs/devops/github-action-workflow-deploy.md`)

### Infrastructure

1. Create a new folder under `/infra`, which will store the infrastructure setup with Docker. (Ex: `/infra/products`)
2. Create a `Dockerfile` or `docker-compose.yml` for any image you want to use to manage creating local resources. (`/infra/products/Dockerfile`)
3. Create a Markdown file in the `/docs` folder with the name of your change detailing what you are trying to build, how it is used within the project, and how to test your changes. (Ex: `/docs/infrastructure/products-db.md`)

## Contributing

Read more in [Contributing](./CONTRIBUTING.md).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
