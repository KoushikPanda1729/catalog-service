# MongoDB Setup Guide

## Docker Setup

Pull image ---> docker pull mongo

Create volume ---> docker volume create catalog-service-mddata

Run container --->
docker run -d \
 --name mongodb-catalog-service \
 -p 27017:27017 \
 -v catalog-service-mddata:/data/db \
 -e MONGO_USERNAME=root \
 -e MONGO_PASSWORD=root \
 mongo

## Container Management

Check container ---> docker ps

Stop container ---> docker stop mongodb-catalog-service

Start container ---> docker start mongodb-catalog-service

Restart container ---> docker restart mongodb-catalog-service

View logs ---> docker logs mongodb-catalog-service

Remove container ---> docker rm mongodb-catalog-service

Remove volume ---> docker volume rm catalog-service-mddata

## MongoDB Shell Commands

Access shell ---> docker exec -it mongodb-catalog-service mongosh -u root -p root --authenticationDatabase admin

Create/Switch database ---> use catalog-service

Create collection ---> db.createCollection("test")

Show databases ---> show dbs

Show collections ---> show collections

Show current database ---> db

## CRUD Operations

Insert one document ---> db.collectionName.insertOne({ field: "value" })

Insert many documents ---> db.collectionName.insertMany([{ field: "value1" }, { field: "value2" }])

Find all documents ---> db.collectionName.find()

Find with filter ---> db.collectionName.find({ field: "value" })

Find one document ---> db.collectionName.findOne({ field: "value" })

Update one document ---> db.collectionName.updateOne({ field: "value" }, { $set: { newField: "newValue" } })

Update many documents ---> db.collectionName.updateMany({ field: "value" }, { $set: { newField: "newValue" } })

Delete one document ---> db.collectionName.deleteOne({ field: "value" })

Delete many documents ---> db.collectionName.deleteMany({ field: "value" })

Count documents ---> db.collectionName.countDocuments()

Drop collection ---> db.collectionName.drop()

Drop database ---> db.dropDatabase()

Exit shell ---> exit

## Connection Details

Connection String ---> mongodb://root:root@localhost:27017/catalog-service?authSource=admin

Database Name ---> catalog-service

Port ---> 27017

Host ---> localhost

Username ---> root

Password ---> root

Auth Database ---> admin

## Application Config

Config file location ---> config/development.yaml

Database URL in config --->
database:
url: "mongodb://root:root@localhost:27017/catalog-service?authSource=admin"

Database init file ---> src/config/initdb.ts

## Troubleshooting

Check port 27017 ---> lsof -i :27017

Reset everything --->
docker stop mongodb-catalog-service
docker rm mongodb-catalog-service
docker volume rm catalog-service-mddata
