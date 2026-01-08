export interface AuthPayload {
    sub: number;
    role: string;
    id?: number;
    tenant?: string;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}
