# NextJS Product Site

Mock NextJS Product Application for Testing

## Context

This is a dummy product site that needs help adding new features and maturing the project. We are looking for developers who want to help improve various aspects of the site: adding new features, updating the APIs, or improving the project's CI/CD just to name a few. With your help, we are looking to make this site performant, stable, and feature-rich.

### What is Current State

- NextJS
- Mock Product Data
- GitHub Action (CI/CD)
- Testing Framework (Jest)
- Component Testing (Storybook)
- Folder Structure

## Getting Started

### Setup

1. Clone the repository with `git clone`.
2. Run `pnpm i` to install dependencies.
3. Run `pnpm start` to start application.

## Areas of Focus

Select one of the three areas to contribute to and help enhance the application with features that might not be present. Look at the [GitHub Issues](https://github.com/jhanke00/nextjs-product-site/issues) for capabilities to work on. Setup your PRs based on the following areas of focus.

### Frontend

1. Create a new folder under `/app` or `/pages` directory, which will store your capability. (Ex: `/app/product-search`)
2. Create custom components under `/components` and utility functions under `/utils` as a directory with the same name as the capability folder. (Ex: `/components/product-search`)
3. Create a `README.md` detailing what you are trying to build, how it is used within the application, and how to test your changes.

### Backend

1. Create a new folder under `/app/api` or `/pages/api` directory, which will store your API route. (Ex: `/app/api/products`)
2. Create utility functions under `/utils` as a directory with the same name as the API route. (Ex: `/utils/products`)
3. Create a `README.md` detailing what you are trying to build, how it is used within the application, and how to test your changes.

### DevOps

1. Create a new workflow file under `/.github/workflows` or actions folder under `/.github/actions`, which will store changes to the GitHub Actions. (Ex: `/.github/workflows/deploy.yml`)
2. Updates to the project can be made directly to the root and additional configuration files may also be created as well. (Ex: `Dockerfile`)
3. Create a `README.md` detailing what you are trying to build, how it is used within the project, and how to test your changes.

## Contributing

Read more in [Contributing](./CONTRIBUTING.md).
