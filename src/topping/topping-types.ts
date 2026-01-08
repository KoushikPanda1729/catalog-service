export interface Topping {
    _id?: string;
    name: string;
    image: string;
    price: number;
    tenantId: string; // Tenant ID from auth service (PostgreSQL numeric ID)
    isPublished: boolean;
}
