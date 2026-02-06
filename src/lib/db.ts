import { INITIAL_DATA } from '@/lib/data';
import { kv } from '@vercel/kv';

// Chave para armazenar os dados no Vercel KV
const STORE_KEY = 'delivery_app_data';

export async function getData() {
    // Tenta buscar do Vercel KV (funciona na produção)
    if (process.env.KV_REST_API_URL) {
        try {
            const data = await kv.get(STORE_KEY);
            if (data) return data;
        } catch (error) {
            console.error("Erro ao buscar do KV:", error);
        }
    }

    // Fallback para dados iniciais
    return INITIAL_DATA;
}

export async function saveData(newData: any) {
    // Salva no Vercel KV (funciona na produção)
    if (process.env.KV_REST_API_URL) {
        try {
            await kv.set(STORE_KEY, newData);
            return true;
        } catch (error) {
            console.error("Erro ao salvar no KV:", error);
            return false;
        }
    }

    // Se não tiver KV configurado, retorna erro
    console.warn("Vercel KV não configurado. Configure em: https://vercel.com/dashboard");
    return false;
}
