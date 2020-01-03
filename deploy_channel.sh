cd helm
oc project guestbook
helm package channel
helm delete --purge channel --tls
helm install channel -n channel --tls -f guestbook/values-iks.yaml
