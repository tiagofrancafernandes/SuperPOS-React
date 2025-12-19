# SuperPOS Pro - PDV Inteligente e Responsivo

O **SuperPOS Pro** é uma solução de Ponto de Venda (POS) de alta performance, projetada para ser totalmente responsiva, funcionando perfeitamente em desktops, tablets e smartphones. Integra o poder da **IA (Google Gemini)** para buscas inteligentes e oferece uma interface premium inspirada em sistemas modernos de autoatendimento.

## 🚀 Tecnologias Utilizadas

- **React 19** (com Hooks e Functional Components)
- **Tailwind CSS v4** (estilização moderna e utilitária)
- **Google Gemini API** (IA para busca semântica de produtos)
- **Lucide/Heroicons** (Ícones vetoriais)
- **Vite/ESBuild** (processamento rápido)

## ✨ Funcionalidades Principais

- **Interface Híbrida**: Modo Operador (padrão) e Modo Kiosk (autoatendimento).
- **IA Lookup**: Pesquisa de produtos por intenção de busca (ex: "algo para limpar a casa" retorna detergentes).
- **Checkout Multi-Pagamento**: Permite dividir uma conta entre Pix, Cartão e Dinheiro.
- **Gestão de Estoque**: Visualização em tempo real do saldo de produtos.
- **Relatórios Dinâmicos**: Gráficos de faturamento por categoria e meio de pagamento.
- **Emissão de Nota Fiscal (Simulada)**: Fluxo completo de cadastro de cliente e transmissão para SEFAZ.
- **Acessibilidade**: Design focado em toque (touch-friendly) com feedbacks visuais claros.

## 💻 Como Rodar Localmente

### Pré-requisitos
- **Node.js** (v18 ou superior)
- **NPM** ou **Yarn**

### Passo a Passo

1. **Clonar o projeto**
   ```bash
   git clone <url-do-repositorio>
   cd superpos-pro
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Configurar Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do projeto e adicione sua chave da API do Google Gemini:
   ```env
   API_KEY=sua_chave_aqui
   ```

4. **Executar em modo Desenvolvimento**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:5173` no seu navegador.

## 📦 Build para Produção

Para gerar a versão otimizada para implantação:
```bash
npm run build
```
Os arquivos serão gerados na pasta `/dist`.

## 🖥️ Modo Kiosk (Autoatendimento)

O sistema suporta um modo de tela cheia sem barras de navegação:
- Para ativar via URL, adicione o parâmetro: `?kiosk=true`.
- No menu do usuário (avatar), selecione **"Ocultar Topo (Kiosk)"**.
- **Sair do Kiosk**: Passe o mouse/toque no canto superior direito para ver o botão "X" ou clique no botão flutuante à esquerda para restaurar a topbar.

## 🔐 Informações de Segurança (Acesso Padrão)

- **Senha Gerencial**: Para cancelar vendas ou realizar estornos, utilize a senha padrão: `1234`.

---

Desenvolvido com foco em UX e Performance. 🛒✨