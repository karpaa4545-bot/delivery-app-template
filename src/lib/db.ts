import { INITIAL_DATA } from '@/lib/data';

export async function getData() {
    const GIST_ID = process.env.GIST_ID;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    // Se não tiver configuração, usa dados iniciais (modo estático)
    if (!GIST_ID || !GITHUB_TOKEN) {
        console.warn("Gist não configurado. Usando dados estáticos.");
        return INITIAL_DATA;
    }

    try {
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
            },
            cache: 'no-store' // Importante para não pegar cache velho
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar Gist: ${response.status}`);
        }

        const gist = await response.json();
        const file = gist.files['data.json'];

        if (file && file.content) {
            return JSON.parse(file.content);
        }
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }

    return INITIAL_DATA;
}

export async function saveData(newData: any) {
    const GIST_ID = process.env.GIST_ID;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    if (!GIST_ID || !GITHUB_TOKEN) {
        console.error("Tentativa de salvar sem configuração do Gist.");
        return false;
    }

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
        console.error("Erro ao salvar dados:", error);
        return false;
    }
}
