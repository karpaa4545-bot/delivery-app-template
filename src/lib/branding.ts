/**
 * CONFIGURAÇÃO Rápida DE MARCA (BRANDING)
 * Altere os valores abaixo para cada novo cliente.
 */

export const BRANDING = {
    // Identidade Visual
    name: "Burguer Master", // Nome do Restaurante
    whatsapp: "5511999999999", // Número do WhatsApp (apenas números)
    logo: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80", // URL do Logo
    address: "Rua Exemplo, 123 - Centro", // Endereço físico
    pixKey: "seu-email@pix.com", // Chave PIX do cliente
    deliveryFee: 5.0, // Taxa de entrega padrão

    // Cores (Hexadecimal)
    // DICA: Mude no src/app/globals.css para refletir no site inteiro
    colors: {
        primary: "#E63946", // Cor principal (Botões, ícones)
        secondary: "#FFB703", // Cor secundária
    },

    // Redes Sociais e Mapas
    googleMapsUrl: "https://goo.gl/maps/exemplo",
    instagramUrl: "https://instagram.com/pizzaria_exemplo",

    // Horários de Funcionamento (Formato 24h)
    openingHours: {
        monday: { open: "18:00", close: "23:00", closed: false },
        tuesday: { open: "18:00", close: "23:00", closed: false },
        wednesday: { open: "18:00", close: "23:00", closed: false },
        thursday: { open: "18:00", close: "23:00", closed: false },
        friday: { open: "18:00", close: "23:59", closed: false },
        saturday: { open: "18:00", close: "23:59", closed: false },
        sunday: { open: "18:00", close: "23:00", closed: false },
    }
};
