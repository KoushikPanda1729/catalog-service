import config from "config";

const getCorsOrigin = (): string[] => {
    const origin = config.get<string | string[]>("cors.origin");
    if (typeof origin === "string") {
        return origin.split(",").map((s) => s.trim());
    }
    return origin;
};

const getKafkaBrokers = (): string[] => {
    const brokers = config.get<string | string[]>("kafka.brokers");
    if (typeof brokers === "string") {
        return brokers.split(",").map((s) => s.trim());
    }
    return brokers;
};

const getKafkaSsl = (): boolean => {
    if (!config.has("kafka.ssl")) return false;
    const ssl = config.get<string | boolean>("kafka.ssl");
    if (typeof ssl === "string") {
        return ssl === "true";
    }
    return ssl;
};

const getCorsCredentials = (): boolean => {
    const credentials = config.get<string | boolean>("cors.credentials");
    if (typeof credentials === "string") {
        return credentials === "true";
    }
    return credentials;
};

export const Config = {
    PORT: config.get<number>("server.port"),
    HOST: config.get<string>("server.host"),
    DATABASE_URL: config.get<string>("database.url"),
    JWKS_URI: config.get<string>("auth.jwksUri"),
    AWS_S3_REGION: config.get<string>("aws.s3.region"),
    AWS_S3_BUCKET: config.get<string>("aws.s3.bucket"),
    AWS_S3_ACCESS_KEY_ID: config.get<string>("aws.s3.accessKeyId"),
    AWS_S3_SECRET_ACCESS_KEY: config.get<string>("aws.s3.secretAccessKey"),
    CORS: {
        origin: getCorsOrigin(),
        credentials: getCorsCredentials(),
    },
    STORAGE_PROVIDER: config.get<string>("storage.provider"),
    BROKER_TYPE: config.get<string>("broker.type"),
    KAFKA_CLIENT_ID: config.get<string>("kafka.clientId"),
    KAFKA_BROKERS: getKafkaBrokers(),
    KAFKA_SASL: config.has("kafka.sasl")
        ? config.get<{
              mechanism: "plain" | "scram-sha-256" | "scram-sha-512";
              username: string;
              password: string;
          }>("kafka.sasl")
        : null,
    KAFKA_SSL: getKafkaSsl(),
};
