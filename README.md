# 🌐 CitizenTech — Painel de Inteligência Territorial
### Global Solution 2026.2 • FIAP — Ciência da Computação (2º Ano — Turma de Fevereiro)
**Disciplina:** Cross-Platform Application Development  

---

## 👥 Integrantes do Grupo

| RM | Nome Completo | Papel Técnico no Projeto |
| :--- | :--- | :--- |
| **564437** | **Pedro Barreto** | Arquitetura Cross-Platform, Integração de APIs & Context State |
| **565994** | **Filippo Picino** | Design System, Telas Mobile & Acessibilidade WCAG 2.1 |
| **563695** | **Gustavo Henrique** | Modelos Preditivos, Persistência Local & Governança LGPD |

---

## 📋 1. Descrição do Projeto

O **Painel de Inteligência Territorial** é um aplicativo mobile multiplataforma (iOS, Android e Web) desenvolvido em **React Native com Expo e TypeScript**, concebido sob a filosofia **CitizenTech** e governança pública baseada em evidências.

O objetivo do aplicativo é funcionar como a **central de comando e apoio à tomada de decisão de um gestor público**, permitindo antecipar problemas que impactam severamente a qualidade de vida da população em áreas urbanas densas, comunidades periféricas, mananciais e zonas rurais.

### 🎯 Princípio Central: Suporte à Decisão Humana (*Human-in-the-Loop*)
O aplicativo adota a premissa de que **nenhuma decisão de alto impacto** (como racionamento de água, desligamento preventivo de alimentadores elétricos, ou interdições viárias) **pode ser automatizada de forma autônoma por algoritmos**. Toda predição gerada pela plataforma é apresentada acompanhada de:
1. **Justificativa técnica explícita** (explicabilidade algorítmica);
2. **Nível de confiança estatística** (Confidence Score em porcentagem);
3. **Limitações e premissas do modelo preditivo** (para evitar viés ou falsa precisão);
4. **Recomendações e simulações de impacto**, deixando a assinatura e despacho final a cargo da autoridade humana competente.

---

## 🗺️ 2. Dimensões Territoriais Monitoradas

O painel integra telemetria e análise preditiva sobre 5 eixos essenciais:

1. 💧 **Recursos Hídricos (Água):** Nível de reservatórios locais, pressão manométrica da rede (bar), taxa de perda na distribuição e projeção de escassez em 24h a 72h.
2. ⚡ **Estabilidade Energética (Energia):** Demanda elétrica em tempo real, percentual de carga nominal da rede e índice de estresse térmico em transformadores de distribuição.
3. 🌦️ **Clima e Riscos Meteorológicos (Clima):** Temperatura atual, sensação térmica, umidade relativa do ar, velocidade dos ventos e precipitação acumulada nas últimas 24h, consumidos em **tempo real via API externa da Open-Meteo**.
4. 🗑️ **Gestão de Resíduos Sólidos (Resíduos):** Taxa de lotação de lixeiras inteligentes e ecopontos comunitários, rotas de coleta atrasadas e mapeamento de descarte irregular.
5. 🏥 **Demanda por Serviços Públicos (Serviços):** Tempo médio de triagem em Unidades Básicas de Saúde (UBS), chamados abertos da ouvidoria e volume de relatos comunitários.

---

## 🏗️ 3. Arquitetura Técnica & Requisitos Atendidos

| Requisito do Desafio | Implementação no Projeto |
| :--- | :--- |
| **Framework Multiplataforma** | **React Native (v0.88) com Expo SDK 58 e TypeScript estrito**. Executa nativamente no iOS, Android e Web. |
| **Navegação entre Telas** | **React Navigation v7** com `createBottomTabNavigator` conectando Dashboard, Alertas, Decisão, Intervenções e Governança, além de modais fluidos. |
| **Gerenciamento de Estado** | **React Context API (`TerritoryContext`)** com desacoplamento de responsabilidades, seleção dinâmica de territórios e atualização reativa. |
| **Consumo de APIs** | Integração direta com a API REST pública do **Open-Meteo** (`https://api.open-meteo.com/v1/forecast`) para clima ao vivo, com fallback resiliente para telemetria local sintetizada. |
| **Persistência de Dados** | **`@react-native-async-storage/async-storage`** para persistir histórico completo de ordens e intervenções, alertas reconhecidos e preferências de acessibilidade. |
| **Formulários com Validação** | Tela de Registro de Intervenção com validações em tempo real: bloqueio de envio, campos obrigatórios, faixas numéricas de impacto/orçamento e tamanho mínimo de justificativa técnica. |
| **Componentes Reutilizáveis** | Design System exclusivo (`StatCard`, `RiskBadge`, `ConfidenceMeter`, `PredictiveAlertCard`, `MiniChart`, `CustomButton`, `CustomInput`, `Header`). |
| **Acessibilidade (A11y)** | Conformidade **WCAG 2.1 AA**: suporte nativo a leitores de tela (`accessibilityLabel`, `accessibilityRole`, `accessibilityHint`), áreas de toque $\ge 44 \times 44\text{ px}$ e alternador dinâmico de **Modo Alto Contraste**. |
| **Privacidade dos Cidadãos** | Arquitetura **Privacy by Design**: ausência de dados pessoais identificáveis (Zero PII) e agregação espacial por setor censitário e limites da LGPD (Lei 13.709/2018). |

---

## 📊 4. Fontes de Dados

1. **Open-Meteo Weather Forecast API:**
   - Endpoint: `https://api.open-meteo.com/v1/forecast`
   - Dados: Temperatura real a 2m, umidade relativa, precipitação acumulada, vento e previsões horárias para as coordenadas exatas dos distritos monitorados.
2. **SNIS (Sistema Nacional de Informações sobre Saneamento):**
   - Parâmetros históricos municipais de perdas de faturamento e distribuição em redes de adução de água.
3. **ONS (Operador Nacional do Sistema Elétrico) / Distribuidoras Locais:**
   - Curvas de carga horária e padrões de sazonalidade de demanda elétrica comercial, residencial e industrial.
4. **IBGE (Instituto Brasileiro de Geografia e Estatística):**
   - Dados censitários de densidade demográfica, áreas territoriais e vulnerabilidade socioeconômica por distrito.
5. **Telemetria Sintética Calibrada:**
   - Simulação determinística de sensores IoT instalados em ecopontos, pressostatos de rede e filas de triagem médica.

---

## ⚠️ 5. Limitações Conhecidas dos Modelos Preditivos

Para garantir transparência algorítmica, o aplicativo explicita diretamente ao usuário as seguintes limitações dos modelos:
- **Resolução Espacial Mesoescala:** Os dados meteorológicos possuem grade de precisão de 1 a 2 km; eventos convectivos hiperlocais (como microexplosões pluviais) podem apresentar desvios espaciais.
- **Pressuposto de Estabilidade de Rede Externa:** As projeções de autonomia hídrica assumem fornecimento elétrico estável nas estações de bombeamento (ETA/EEI). Apagões não programados na rede de média tensão reduzem a janela de ação em até 4 horas.
- **Amostragem em Zonas Rurais:** A predição de estresse em transformadores rurais baseia-se em 14 unidades inteligentes amostradas. Produtores não monitorados que realizem bombeamento fora do horário pactuado podem gerar flutuações anômalas.
- **Não Interferência em Direitos:** O aplicativo é categorizado como ferramenta de apoio consultivo; nenhuma intervenção pode ter caráter punitivo automático contra munícipes.

---

## 🚀 6. Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** (versão 18 ou superior instalada — testado com Node.js v24)
- **npm** ou **yarn**
- Opcional: aplicativo **Expo Go** instalado no seu smartphone Android ou iOS.

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/Filippohh/GS.2-PLATAFORM-APPLICATION-DEVELOPMENT.git
cd "GS.2-PLATAFORM-APPLICATION-DEVELOPMENT"
```

### Passo 2: Instalar as Dependências
```bash
npm install
```

### Passo 3: Executar a Aplicação

#### Opção A — Executar no Navegador Web (Recomendado para avaliação rápida):
```bash
npm run web
```
*O Metro Bundler abrirá automaticamente a aplicação em `http://localhost:8081`.*

#### Opção B — Executar no Smartphone com Expo Go:
```bash
npm start
```
*Abra a câmera (iOS) ou o app Expo Go (Android) e escaneie o QR Code exibido no terminal.*

#### Opção C — Verificação Estática de Tipagem (TypeScript):
```bash
npm run type-check
```

---

## 📂 7. Estrutura do Código-Fonte

```
.
├── assets/                          # Ícones e imagens do aplicativo
├── src/
│   ├── api/
│   │   ├── openMeteoService.ts      # Integração real com a API pública da Open-Meteo
│   │   └── territorialDataService.ts # Serviços de dados territoriais e modelos preditivos
│   ├── components/
│   │   ├── ConfidenceMeter.tsx      # Barra visual de nível de confiança estatística (%)
│   │   ├── CustomButton.tsx         # Botão com variantes, estados e acessibilidade nativa
│   │   ├── CustomInput.tsx          # Campo de formulário com validação e feedback visual
│   │   ├── Header.tsx               # Cabeçalho com seletor de territórios e alto contraste
│   │   ├── MiniChart.tsx            # Gráfico de barras interativo (Web e Mobile)
│   │   ├── PredictiveAlertCard.tsx  # Card com justificativa, confiança e limitações
│   │   ├── RiskBadge.tsx            # Badge de criticidade (Estável, Atenção, Alto, Crítico)
│   │   └── StatCard.tsx             # Card de KPI com valor, unidade e tendência
│   ├── context/
│   │   └── TerritoryContext.tsx     # Context API global e persistência no AsyncStorage
│   ├── screens/
│   │   ├── DashboardScreen.tsx      # Visão geral, gráficos de 7 dias e indicadores em tempo real
│   │   ├── AlertsScreen.tsx         # Central de alertas preditivos filtráveis com justificativa
│   │   ├── DecisionSimulatorScreen.tsx # Simulador de impacto para apoio à decisão humana
│   │   ├── InterventionsScreen.tsx  # Histórico auditável e formulário com validação estrita
│   │   └── GovernanceScreen.tsx     # LGPD, termos de privacidade, fontes e integrantes
│   ├── theme/
│   │   └── colors.ts                # Design System CitizenTech / GovTech
│   └── types/
│       └── index.ts                 # Definições estritas de tipos TypeScript
├── App.tsx                          # Entrada principal com React Navigation Tabs
├── app.json                         # Configurações do Expo
├── package.json                     # Dependências e scripts do projeto
├── tsconfig.json                    # Configuração TypeScript
├── entrega_gs_fiap.txt              # Arquivo de entrega formatado para o Portal FIAP
└── README.md                        # Esta documentação oficial
```

---

## 🔒 8. Conformidade com a LGPD e Ética

- **Sem Coleta de PII:** Não há campos para nome, CPF ou geolocalização pessoal de cidadãos.
- **Agregação Territorial:** Os dados são sintetizados por distritos administrativos com população mínima superior a 40.000 habitantes, garantindo anonimato espacial.
- **Rastreabilidade e Auditoria:** Toda diretriz autorizada pelo gestor é salva localmente com carimbo de data, hora e responsável técnico, atendendo aos princípios de transparência pública do Art. 6º da Lei 13.709/2018.
