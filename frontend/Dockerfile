# Image de base : Nginx sur Alpine Linux (légère)
FROM nginx:alpine

# Notre configuration Nginx (fichiers statiques + redirection de /api)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Les fichiers du site
COPY index.html /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js

EXPOSE 80
