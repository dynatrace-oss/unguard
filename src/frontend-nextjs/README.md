# Frontend

This app is based on the Next.js 15 framework. It consists of two parts:
- the frontend, available at /ui
- an API, with which the frontend communicates with the other microservices, available at /ui/api

Technologies Used:
- [Next.js 15](https://nextjs.org/docs/getting-started)
- [HeroUI](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

To install all dependencies with [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) run:

```bash
npm install
```

## Running


### Running only the frontend on a local development server

To run only the frontend locally run:

```bash
npm run dev
```

Note that the API is dependent on the other microservices.

### Developing with Kubernetes services
For further development at the frontend it may be useful to start Unguard in
Kubernetes (general README.md).

For developing use ```skaffold dev``` instead of ```skaffold run```, this will rebuild and redeploy the application after every change to the source files.
Note that this is significantly slower than when running only the frontend on a local development server.
