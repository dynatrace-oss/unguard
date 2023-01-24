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
