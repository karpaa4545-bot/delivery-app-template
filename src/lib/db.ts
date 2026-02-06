import { INITIAL_DATA } from '@/lib/data';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GIST_ID = process.env.GIST_ID;

export async function getData() {
    // Se tiver GitHub Gist configurado, busca de lá
    if (GITHUB_TOKEN && GIST_ID) {
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
                const content = gist.files['data.json']?.content;
                if (content) {
                    return JSON.parse(content);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar do Gist:", error);
        }
    }

    // Fallback para dados iniciais
    return INITIAL_DATA;
}

export async function saveData(newData: any) {
    // Salva no GitHub Gist
    if (GITHUB_TOKEN && GIST_ID) {
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
            return false;
        }
    }

    console.warn("GitHub Gist não configurado. Configure GITHUB_TOKEN e GIST_ID nas variáveis de ambiente.");
    return false;
}
