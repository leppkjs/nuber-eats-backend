# Nuber Eats

The Backend of Nuber Eats Clone

## DB install
### docker install
brew install --cask docker
docker run --name PostgreSQL -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=12345 -d -p 5432:5432 postgres
### postico install
brew install --cask postico
### DB create USER And Database
docker exec -it postgres /bin/bash
psql -U postgres
CREATE USER leppk PASSWORD '12345' SUPERUSER;
CREATE DATABASE nuber-eats OWNER leppk;
### check
\du   
\c test leppk

## User Entity:

- id
- createdAt
- updatedAt

- email
- password
- role(client|owner|delivery)

## User CRUD:

- Create Account
- Log In
- See Profile
- Edit Profile
- Verify Email

## Etc
https://receive-smss.com/sms/
https://app.mailgun.com/app/dashboard