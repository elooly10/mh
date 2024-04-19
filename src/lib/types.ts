export interface Product {
        title: any;
        description: any;
        price: any;
        currency: any;
        rating: number | null;
        tags: any;
        link: any;
        image: string;
        purchased: boolean;
        createdAt?: any;
        values: {
            title: string;
            type: "string" | "bool" | "int";
            content: any
        }[];
        id?: any;
        category: any;
};