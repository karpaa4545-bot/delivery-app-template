import { INITIAL_DATA } from '@/lib/data';
import fs from 'fs';
import path from 'path';

const DB_FILE_PATH = path.join(process.cwd(), 'data.json');

export async function getData() {
    const GIST_ID = process.env.GIST_ID;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    // 1. Tenta pegar do Gist se configurado
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
                    return JSON.parse(file.content);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar do Gist:", error);
        }
    }

    // 2. Fallback: Tenta pegar do arquivo local data.json
    if (fs.existsSync(DB_FILE_PATH)) {
        try {
            const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error("Erro ao ler banco local:", error);
        }
    }

    // 3. Se nada existir, retorna dados iniciais
    return INITIAL_DATA;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveData(newData: any) {
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
            return response.ok;
        } catch (error) {
            console.error("Erro ao salvar no Gist:", error);
            // Se falhar no Gist, continua para tentar salvar localmente como backup
        }
    }

    // 2. Salva localmente em data.json (Funciona no Windows/Linux locais)
    try {
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(newData, null, 2));
        return true;
    } catch (error) {
        console.error("Erro ao salvar localmente:", error);
        return false;
    }
}
