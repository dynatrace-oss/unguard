# based on snippet from https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md
FROM --platform=linux/amd64 ghcr.io/puppeteer/puppeteer:24.11.0 AS base
COPY --chown=pptruser:pptruser . .

RUN npm install
RUN npm run build

ENV NODE_ENV=production
ENV NODE_CONFIG_STRICT_MODE=1
CMD ["npm", "start"]
