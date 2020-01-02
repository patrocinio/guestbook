cd helm
helm package application
helm delete --purge application --tls
helm install application -n application --namespace guestbook --tls 
