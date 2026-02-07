import { BRANDING } from './branding';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    available: boolean;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
}

export interface StoreConfig {
    name: string;
    logo: string;
    whatsapp: string;
    address: string;
    pixKey?: string;
    pixQrCode?: string;
    acceptsCard?: boolean;
    acceptsCash?: boolean;
    openingHours: any;
    deliveryFees: { id: string; name: string; fee: number }[];
    deliveryTime?: string;
    reviewLink?: string;
}

export const INITIAL_DATA = {
    store: {
        name: BRANDING.name,
        logo: BRANDING.logo,
        whatsapp: BRANDING.whatsapp,
        address: BRANDING.address,
        pixKey: BRANDING.pixKey,
        pixQrCode: "",
        acceptsCard: true,
        acceptsCash: true,
        openingHours: BRANDING.openingHours,
        deliveryFees: [
            { id: "1", name: "Centro", fee: 5.00 },
            { id: "2", name: "Bairro Exemplo 1", fee: 7.00 },
            { id: "3", name: "Bairro Exemplo 2", fee: 10.00 }
        ],
        deliveryTime: "40-60 min",
        reviewLink: "https://g.page/sua-loja/review"
    },
    categories: [
        { id: "1", name: "Burgers", icon: "Pizza" },
        { id: "2", name: "Pizzas", icon: "Pizza" },
        { id: "3", name: "Bebidas", icon: "Coffee" },
        { id: "4", name: "Sobremesas", icon: "Cake" }
    ],
    products: [
        {
            id: "p1",
            name: "Classic Burger",
            description: "Hambúrguer de 150g, queijo, alface, tomate e maionese especial.",
            price: 25.90,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
            category: "1",
            available: true
        },
        {
            id: "p2",
            name: "Cheeseburger Duplo",
            description: "Dois hambúrgueres, queijo dobro e molho especial.",
            price: 35.00,
            image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60",
            category: "1",
            available: true
        },
        {
            id: "p3",
            name: "Pizza Margherita",
            description: "Molho de tomate, mussarela e manjericão fresco.",
            price: 49.90,
            image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60",
            category: "2",
            available: true
        }
    ],
    banners: [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=60"
    ],
    orders: []
};
