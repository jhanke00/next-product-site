# DevOps — Docker

What I added

- `Dockerfile` at the project root which builds the Next.js app using pnpm and starts it.
- `.dockerignore` to avoid sending build artifacts and node_modules into the image.

How to build and run

1. Build the image:

   docker build -t next-product-site .

2. Run it:

   docker run -p 3000:3000 next-product-site

The app will be available at http://localhost:3000.

Notes

- The Dockerfile uses `pnpm` and Node 18 alpine base. If you want smaller images or multi-stage builds, we can optimize further.
