PROJECT=guestbook-eduardo

cd helm

oc new-project $PROJECT

oc project $PROJECT

helm package guestbook

helm delete guestbook

helm install guestbook guestbook --namespace $PROJECT -f guestbook/values-openshift.yaml
