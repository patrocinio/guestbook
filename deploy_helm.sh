cd helm
helm package guestbook
helm delete --purge guestbook --tls
helm install guestbook -n guestbook --namespace guestbook --tls
