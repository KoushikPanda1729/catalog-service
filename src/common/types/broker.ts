export interface MessageBrokerConfig {
    clientId: string;
    brokers: string[];
    sasl?:
        | ({ mechanism: "plain" } & { username: string; password: string })
        | ({ mechanism: "scram-sha-256" } & {
              username: string;
              password: string;
          })
        | ({ mechanism: "scram-sha-512" } & {
              username: string;
              password: string;
          })
        | null;
    ssl?: boolean;
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
