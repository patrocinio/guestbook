cd helm
helm package channel
helm delete --purge channel --tls
helm install channel -n channel --namespace guestbook --tls -f guestbook/values-openshift.yaml
