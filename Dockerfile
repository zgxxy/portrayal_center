FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

ADD default.conf /etc/nginx/conf.d/

COPY /audienceWeb/ /home/portrait_center/audienceWeb/

COPY /static/img/siteImg/ /home/img
