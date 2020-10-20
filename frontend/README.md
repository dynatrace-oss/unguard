# frontend

To run simply install all dependencies with yarn (`npm install -g yarn`) and run app.js:

```
yarn install
node app.js
```

It is recommended to set the following environment variables:

|         Name         | Value |
|----------------------|-------|
| JAEGER_SAMPLER_TYPE  | const |
| JAEGER_SAMPLER_PARAM | 1     |
