cd helm
helm package guestbook

HELM_OPTIONS=--tls

helm delete --purge guestbook $HELM_OPTIONS
helm install guestbook -n guestbook --namespace guestbook $HELM_OPTIONS -f guestbook/values-openshift.yaml
