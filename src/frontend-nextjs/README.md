# Unguard Next.js Frontend

This is the frontend for the Unguard application. It provides a user interface and an API for interacting with the Unguard microservices platform.

This app is based on the [Next.js 15](https://nextjs.org/docs/getting-started) framework. It consists of two parts:

-   the frontend, available at /ui
-   an API, available at /ui/api, which is used by the frontend to communicate with the backend services and can also be accessed directly.

## Why Next.js

Next.js is a React Framework and was chosen for the frontend, because (besides all React advantages) it provides many built-in features, such as server-side rendering or file-based routing, which make it easy to build a modern, performant and scalable frontend application.

Furthermore, Next.js can also be used as a full-stack framework, which allows implementing the API directly in the same codebase, but still separates the frontend and API logic. This allows to strip most logic from the frontend, making it a "dumb" web-application that only displays data and handles user interactions, while the API handles all the logic for communicating with the backend services.
In this way, there is a clean separation of concerns, which makes the application cleaner and easier to maintain and extend in the future.

Additionally, the Next.js API can also be accessed directly, allowing e.g. the exploit toolkit and malicious load generator to use the API directly without needing to go through the frontend.

## Further Technologies Used
-   [HeroUI](https://heroui.com/) was used for the UI components, as it provides various pre-built components that are easy to use and customize, while also being compatible with Tailwind CSS.
-   [Tailwind CSS](https://tailwindcss.com/) was used for styling the UI components and pages.
-   [React-Markdown-Editor](https://uiwjs.github.io/react-md-editor/) was used for the bio editor, as it provides a simple and customizable markdown editor that works out of the box.
-   [Tanstack Query](https://tanstack.com/query/latest) was used for data fetching, as it makes it easy to manage states and cache and update results from API requests, as well as error handling.
-   [Axios](https://axios-http.com/) is a HTTP client which was used in the Next.js API to communicate with the backend services.
-   [TypeScript](https://www.typescriptlang.org/) was used as the programming language.

## Architecture Overview
- `app/`: Main application using the Next.js App Router to implement a file-based routing system
  - Each page is represented by a directory which can include the following files:
      - `page.tsx`: The main page component
      - `layout.tsx`: Global layout
      - `providers.tsx`: Context providers (only used in the root layout)
      - `error.tsx`: Global error boundary (only used in the root layout)
  - The home/root page (`/`) is located directly in `app/`
  - `app/api/`: Includes API routes for server-side logic that talk with the backend services
    - Each route is represented by a directory which includes a file `routes.ts`
    - Each `routes.ts` can implement one request handler per HTTP method type
- `components/`: Reusable UI components
- `hooks/`: Contains custom React hooks, e.g. for navigation or data fetching and updating using Tanstack Query
- `public/` — Static assets
- `services/`:
  - `services/`: Contains service functions for API calls to the Next.js API used by the frontend
  - `services/api`: Contains service functions for API calls to the backend services used by the Next.js API
- `axios.ts` — Axios instances for API requests to backend services
- `middleware.ts` — Next.js middleware mainly used for route protection
- `constants.ts`, `enums/`, `data/` — Shared constants, enums, and static data

## API Routes Overview
The API routes have the prefix `/ui/api` and provide the following endpoints:
- `GET /ad`: Provides the src of the ad service
- `POST /ad`: Allows uploading new ad images
- `DELETE /ad/[adName]`: Allows deleting ad images
- `GET /ads`: Returns a list of all ad images
- `GET /auth/ad-manager`: Returns a boolean indicating if the user is an ad manager
- `GET /auth/jwt-payload`: Returns the JWT payload of the currently logged-in user
- `POST /auth/login`: Logs in a user and returns a JWT token
- `GET /auth/login`: Returns a boolean indicating if the user is logged in
- `POST /auth/logout`: Logs out the user
- `POST /auth/register`: Registers a new user
- `GET /deployment-health`: Returns the health status of the Kubernetes deployments
- `POST /follow/[username]`: Follows the user with the given username
- `DELETE /follow/[username]`: Unfollows the user with the given username
- `GET /follow[username]`: Returns a boolean indicating if the user is followed by the currently logged-in user
- `GET /followers/[username]`: Returns a list of followers for the user with the given username
- `POST /like/[postId]`: Adds a like for the given post ID for the currently logged-in user
- `DELETE /like?postId=[postId]`: Deletes a like for the given post ID (using search params)
- `GET /likes/[postId]`: Returns the number of likes for the given post ID
- `GET /post/[postId]`: Returns the post with the given post ID
- `POST /post`: Creates a new post
- `GET /posts/[username]`: Returns a list of posts shared by the user with the given username
- `GET /posts/mytimeline`: Returns the personal timeline of the currently logged-in user as a list of posts
- `GET /posts`: Returns a list of all posts (the 'global timeline')
- `GET /roles`: Returns a list of all available roles
- `GET /user/[username]/bio`: Returns the bio of the user with the given username
- `POST /user/[username]/bio`: Updates the bio of the user with the given username
- `GET /user/[username]/membership`: Returns the membership of the user with the given username
- `POST /user/[username]/membership`: Updates the membership of the user with the given username
- `GET /user/[username]/payment`: Returns the payment info of the user with the given username
- `POST /user/[username]/payment`: Updates the payment info of the user with the given username
- `GET /users?name=[name]&roles=[roles]`: Returns a list of users matching the given name (partially) and roles

## Installation
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

Note that the API is dependent on the other microservices, therefore the frontend will fail to retrieve and show any data.

### Developing with Kubernetes services

For further development at the frontend it may be useful to start Unguard in
Kubernetes (general README.md).

For developing use `skaffold dev` instead of `skaffold run`, this will rebuild and redeploy the application after every change to the source files.
Note that this is significantly slower than when running only the frontend on a local development server.

### Developing with Mirrord
For faster development [mirrord](https://plugins.jetbrains.com/plugin/19772-mirrord) can be used to run the frontend locally while still retrieving data from the microservices running in the Kubernetes cluster.
