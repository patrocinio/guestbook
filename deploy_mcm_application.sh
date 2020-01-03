cd helm
oc new-project guestbook-application
oc project guestbook-application

helm package application
helm delete --purge application --tls
helm install application -n application --namespace guestbook-application --tls
