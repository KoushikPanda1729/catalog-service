export interface AuthPayload {
    sub: number;
    role: string;
    id?: number;
    tenant?: number; // Tenant ID from auth service is a number
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}
