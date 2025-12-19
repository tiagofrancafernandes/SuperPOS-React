
# SuperPOS Pro - PDV Inteligente e Responsivo

O **SuperPOS Pro** é uma solução de Ponto de Venda (POS) moderna, totalmente responsiva e flexível. Projetado para funcionar em desktops, tablets e smartphones com uma interface premium inspirada nas melhores fintechs.

## 🚀 Tecnologias Utilizadas

- **React 19**
- **Tailwind CSS v4**
- **Google Gemini API** (Opcional - para busca semântica)
- **Lucide Icons**
- **Vite/ESBuild**

## ✨ Funcionalidades Principais

- **IA Modular (Opcional)**: Pesquisa de produtos por intenção (ex: "coisas para o café da manhã"). Ativada apenas se uma `API_KEY` for detectada.
- **Interface Híbrida**: Alterne entre Modo Operador e Modo Kiosk (Autoatendimento).
- **Checkout Flexível**: Suporte a múltiplos pagamentos (Pix, Cartão, Dinheiro).
- **Gestão de Estoque**: Controle em tempo real com alertas visuais de baixo estoque.
- **Relatórios**: Visão consolidada de faturamento por categoria.
- **Emissão Fiscal**: Fluxo simulado de NF-e integrado ao checkout.

---

## 🎨 IA e Design Modular

As funcionalidades de IA no SuperPOS Pro foram projetadas para serem **Plug-and-Play**:
1. **Sem Configuração**: Se você não fornecer uma `API_KEY`, o sistema oculta automaticamente os botões de IA e funciona como um PDV tradicional de alta performance.
2. **Controle Manual**: Em *Configurações*, o gerente pode desativar a IA a qualquer momento para economizar recursos ou simplificar a interface.
3. **Design Fluido**: A interface se ajusta automaticamente para preencher o espaço da barra de busca quando a IA está desativada.

---

## 💻 Como Rodar Localmente

### Passo a Passo

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Configuração da IA (Opcional)**
   Para usar a busca inteligente, adicione sua chave ao arquivo `.env`:
   ```env
   API_KEY=sua_chave_aqui
   ```

3. **Executar**
   ```bash
   npm run dev
   ```

---

Desenvolvido com foco em UX, Performance e Flexibilidade. 🛒✨
