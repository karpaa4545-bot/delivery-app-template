import { INITIAL_DATA } from '@/lib/data';
import fs from 'fs';
import path from 'path';

const DB_FILE_PATH = path.join(process.cwd(), 'data.json');

export async function getData() {
    const GIST_ID = process.env.GIST_ID;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    // 2. Fallback: Tenta pegar do arquivo local data.json
    if (fs.existsSync(DB_FILE_PATH)) {
        try {
            const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
            const localData = JSON.parse(fileContent);
            return { ...INITIAL_DATA, ...localData }; // Mescla para evitar quebras
        } catch (error) {
            console.error("Erro ao ler banco local:", error);
        }
    }

    // 1. Tenta pegar do Gist se configurado (Prioridade)
    if (GIST_ID && GITHUB_TOKEN) {
        try {
            const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
                cache: 'no-store'
            });

            if (response.ok) {
                const gist = await response.json();
                const file = gist.files['data.json'];
                if (file && file.content) {
                    const gistData = JSON.parse(file.content);
                    // Se o Gist estiver vazio ou incompleto, usa os dados iniciais como base
                    if (!gistData.products || !gistData.store) {
                        return INITIAL_DATA;
                    }
                    return { ...INITIAL_DATA, ...gistData };
                }
            }
        } catch (error) {
            console.error("Erro ao buscar do Gist:", error);
        }
    }

    // 3. Se nada existir, retorna dados iniciais
    return INITIAL_DATA;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveData(newData: any): Promise<{ success: boolean; message: string }> {
    const GIST_ID = process.env.GIST_ID;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    // 1. Tenta salvar no Gist se configurado
    if (GIST_ID && GITHUB_TOKEN) {
        try {
            const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    files: {
                        'data.json': {
                            content: JSON.stringify(newData, null, 2)
                        }
                    }
                })
            });

            if (response.ok) {
                return { success: true, message: "Salvo no Gist com sucesso!" };
            } else {
                return { success: false, message: `Erro Gist: ${response.status} ${response.statusText}` };
            }
        } catch (error: any) {
            console.error("Erro ao salvar no Gist:", error);
            return { success: false, message: `Erro de Conexão Gist: ${error.message}` };
        }
    }

    // 2. Salva localmente em data.json (Funciona no Windows/Linux locais)
    try {
        // Na Vercel, isso vai falhar se não formos persistentes, mas tentamos
        if (process.env.NODE_ENV === 'production') {
            // Se estivermos em produção sem Gist, avisar o usuário explicitamente
            return { success: false, message: "Erro: Na Vercel (Online), é OBRIGATÓRIO configurar o GIST_ID e GITHUB_TOKEN para salvar." };
        }

        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(newData, null, 2));
        return { success: true, message: "Salvo localmente com sucesso!" };
    } catch (error: any) {
        console.error("Erro ao salvar localmente:", error);
        return { success: false, message: `Erro ao salvar disco: ${error.message}` };
    }
}
