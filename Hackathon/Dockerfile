FROM ubuntu:20.04

#Update & Install wget
RUN apt-get update
RUN apt-get install -y wget vim iputils-ping net-tools iproute2 dnsutils openjdk-11-jdk

#Install Kafka
RUN wget --no-check-certificate https://dlcdn.apache.org/kafka/3.2.0/kafka_2.13-3.2.0.tgz -O - | tar -zxv
RUN mv kafka_2.13-3.2.0 /kafka
WORKDIR /kafka
