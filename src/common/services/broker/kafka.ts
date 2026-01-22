import { Kafka, type Producer } from "kafkajs";
import type {
    IMessageBroker,
    Message,
    MessageBrokerConfig,
} from "../../types/broker";

export class KafkaBroker implements IMessageBroker {
    private kafka: Kafka;
    private producer: Producer;

    constructor(config: MessageBrokerConfig) {
        this.kafka = new Kafka({
            clientId: config.clientId,
            brokers: config.brokers,
        });
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
