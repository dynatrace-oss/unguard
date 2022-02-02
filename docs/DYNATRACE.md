## ❄️ Dynatrace Monaco

Configuration for the unguard managment zone is at [`monaco/management-zone`](../monaco/management-zone/management-zone.yaml).  
For setup, read the [official Monaco docs](https://dynatrace-oss.github.io/dynatrace-monitoring-as-code/) or [this wiki page](https://dev-wiki.dynatrace.org/x/QNBVEw).

## 🙋 FAQ

**How can I setup my AWS configuration?**

Pull AWS configuration via [ACE UPM](https://internal.ace-tools.dynatrace.com/upm/me/dashboard) (see [here](https://dev-wiki.dynatrace.org/x/wx6jF) for your first-time setup).

**Why is Unguard not recognized by Dynatrace anymore?**

Redeploying the ingress can result in a new frontend hostname. Therefore, you have to update the [application detection rule](https://rjc90872.sprint.dynatracelabs.com/#settings/rum/webappmonitoring) in Dynatrace manually.
A workaround to this using Route 53 is described in the [terraform guide](./TERRAFORM.md).

To get the hostname run the following command:

```sh
kubectl get ingress -n unguard unguard-ingress -o=jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

**How can I push the images to the internal Dynatrace registry?**

Run the following command:

```sh
skaffold run --default-repo registry.lab.dynatrace.org/casp
```