export interface MessageBrokerConfig {
    clientId: string;
    brokers: string[];
}

export interface Message {
    topic: string;
    key?: string;
    value: string;
    headers?: Record<string, string>;
}

export interface IMessageBroker {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    sendMessage(message: Message): Promise<void>;
}
