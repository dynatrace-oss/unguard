# ❄️ Dynatrace Monaco

> For more information see [dynatrace-monitoring-as-code](https://github.com/dynatrace-oss/dynatrace-monitoring-as-code).

Configuration for the unguard managment zone is at [`monaco/management-zone`](../monaco/management-zone/management-zone.yaml).
For setup, read the [official Monaco docs](https://dynatrace-oss.github.io/dynatrace-monitoring-as-code/).

## ❓ FAQ

**Why is Unguard not recognized by Dynatrace anymore?**

Redeploying the ingress can result in a new frontend hostname. Therefore, you have to update the [application detection rule](https://www.dynatrace.com/support/help/shortlink/application-detection-rules) in Dynatrace manually.

To get the hostname run the following command:

```sh
kubectl get ingress -n unguard unguard-ingress -o=jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

## License

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
