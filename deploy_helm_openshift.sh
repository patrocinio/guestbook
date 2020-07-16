cd helm
helm package guestbook

helm delete guestbook

helm install guestbook guestbook --namespace guestbook -f guestbook/values-openshift.yaml
