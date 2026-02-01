import {
    Kafka,
    type KafkaConfig,
    type SASLOptions,
    type Producer,
} from "kafkajs";
import type {
    IMessageBroker,
    Message,
    MessageBrokerConfig,
} from "../../types/broker";

export class KafkaBroker implements IMessageBroker {
    private kafka: Kafka;
    private producer: Producer;

    constructor(config: MessageBrokerConfig) {
        let kafkaConfig: KafkaConfig = {
            clientId: config.clientId,
            brokers: config.brokers,
        };

        if (config.sasl) {
            kafkaConfig = {
                ...kafkaConfig,
                ssl: {
                    rejectUnauthorized: true,
                },
                sasl: {
                    mechanism: config.sasl.mechanism,
                    username: config.sasl.username,
                    password: config.sasl.password,
                } as SASLOptions,
            };
        }

        this.kafka = new Kafka(kafkaConfig);
        this.producer = this.kafka.producer();
    }

    async connect(): Promise<void> {
        await this.producer.connect();
    }

    async disconnect(): Promise<void> {
        await this.producer.disconnect();
    }

    async sendMessage(message: Message): Promise<void> {
        await this.producer.send({
            topic: message.topic,
            messages: [
                {
                    key: message.key ?? null,
                    value: message.value,
                    ...(message.headers && { headers: message.headers }),
                },
            ],
        });
    }
}
