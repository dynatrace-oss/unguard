/*
Copyright 2023 Dynatrace LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const path = require('path');

exports.extendURL = function (url) {
    return path.join(process.env.FRONTEND_BASE_PATH, url);
}

exports.extendRenderData = function (data, req) {
  return {
      ...data,
      AD_SERVICE_INGRESS_ADDRESS: req.protocol + '://' + req.get('host') + process.env.AD_SERVICE_BASE_PATH,
      BASE_URL: req.protocol + '://' + req.get('host') + process.env.FRONTEND_BASE_PATH,
      currentPath: req.originalUrl
  }
}
