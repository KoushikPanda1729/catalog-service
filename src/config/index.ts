import config from "config";

export const Config = {
    PORT: config.get<number>("server.port"),
    HOST: config.get<string>("server.host"),
    DATABASE_URL: config.get<string>("database.url"),
    JWKS_URI: config.get<string>("auth.jwksUri"),
    AWS_S3_REGION: config.get<string>("aws.s3.region"),
    AWS_S3_BUCKET: config.get<string>("aws.s3.bucket"),
    AWS_S3_ACCESS_KEY_ID: config.get<string>("aws.s3.accessKeyId"),
    AWS_S3_SECRET_ACCESS_KEY: config.get<string>("aws.s3.secretAccessKey"),
    CORS: config.get<{ origin: string[]; credentials: boolean }>("cors"),
    STORAGE_PROVIDER: config.get<string>("storage.provider"),
    BROKER_TYPE: config.get<string>("broker.type"),
    KAFKA_CLIENT_ID: config.get<string>("kafka.clientId"),
    KAFKA_BROKERS: config.get<string[]>("kafka.brokers"),
    KAFKA_SASL: config.has("kafka.sasl")
        ? config.get<{
              mechanism: "plain" | "scram-sha-256" | "scram-sha-512";
              username: string;
              password: string;
          }>("kafka.sasl")
        : null,
    KAFKA_SSL: config.has("kafka.ssl")
        ? config.get<boolean>("kafka.ssl")
        : false,
};
