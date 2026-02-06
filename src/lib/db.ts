import fs from 'fs';
import path from 'path';
import { INITIAL_DATA } from '@/lib/data';
import { supabase } from './supabase';

const DATA_FILE = path.join(process.cwd(), 'data', 'data.json');

// Garante que a pasta e o arquivo local existem
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'));
}

export async function getData() {
    // 1. Tenta Supabase (Nuvem)
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('configs')
                .select('data')
                .eq('key', 'current_store')
                .single();

            if (data && !error) return data.data;
        } catch (e) {
            console.error("Erro Supabase:", e);
        }
    }

    // 2. Fallback para arquivo local
    try {
        if (fs.existsSync(DATA_FILE)) {
            const content = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(content);
        }
    } catch (error) {
        console.error("Erro leitura local:", error);
    }

    return INITIAL_DATA;
}

export async function saveData(newData: any) {
    let success = false;

    // 1. Tenta Salvar no Supabase (Nuvem)
    if (supabase) {
        try {
            const { error } = await supabase
                .from('configs')
                .upsert({ key: 'current_store', data: newData });

            if (!error) success = true;
        } catch (e) {
            console.error("Erro ao salvar no Supabase:", e);
        }
    }

    // 2. Salva sempre no local também (segurança)
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
        success = true; // Se salvou no local, já consideramos sucesso para o usuário
    } catch (error) {
        console.error("Erro ao salvar localmente:", error);
    }

    return success;
}
