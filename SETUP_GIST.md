# Configuração do GitHub Gist para Persistência de Dados

Este projeto usa GitHub Gist como backend de armazenamento quando hospedado na Vercel.

## Como Configurar:

### 1. Criar um GitHub Token
1. Acesse: https://github.com/settings/tokens/new
2. Dê um nome: `Delivery App Storage`
3. Marque apenas: `gist` (Create gists)
4. Clique em "Generate token"
5. **COPIE O TOKEN** (você não vai ver ele de novo!)

### 2. Criar um Gist
1. Acesse: https://gist.github.com/
2. Clique em "+" (New gist)
3. Nome do arquivo: `data.json`
4. Cole este conteúdo inicial:
```json
{}
```
5. Escolha "Create secret gist"
6. **COPIE O ID DO GIST** da URL (ex: `https://gist.github.com/seu-usuario/ABC123` → o ID é `ABC123`)

### 3. Adicionar na Vercel
1. Vá em: https://vercel.com/dashboard
2. Clique no projeto
3. Settings → Environment Variables
4. Adicione:
   - `GITHUB_TOKEN` = seu token copiado
   - `GIST_ID` = o ID do gist copiado
5. Clique em "Save"
6. Faça um novo deploy (ou espere o automático)

Pronto! O admin vai salvar os dados no Gist.
