# frontend

To install all dependencies with yarn (`npm install -g yarn`) run:

```
yarn install
```

It is recommended to set the following environment variables:

|         Name         | Value |
|----------------------|-------|
| JAEGER_SAMPLER_TYPE  | const |
| JAEGER_SAMPLER_PARAM | 1     |

## Running

To run locally, execute:

```
yarn start
```

When developing, to have the server auto-restart on change of a file, use:

```
yarn run dev
```
