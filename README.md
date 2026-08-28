# 🚀 Orbit HQ (Discord Clone)

Orbit HQ é uma plataforma completa de comunicação em tempo real inspirada no Discord, desenvolvida com React, Vite, TailwindCSS, Node.js, Express, Socket.IO e MariaDB/MySQL.

---

## ✨ Funcionalidades

- 💬 **Canais de Texto & Mensagens Diretas (DMs)**: Chat em tempo real com suporte a emojis, anexos e formatação.
- 🔊 **Canais de Voz (WebRTC)**: Transmissão e comunicação por voz entre usuários nos servidores.
- 👥 **Servidores e Canais**: Criação, personalização de servidores, canais de texto e voz.
- 🛡️ **Cargos e Permissões**: Sistema granular de cargos, cores e permissões de moderação.
- 🎨 **Personalização de Perfil**: Banners, avatares, status customizado, pronomes e temas.
- ⚡ **WebSockets**: Sincronização instantânea de status, mensagens e atividades via Socket.IO.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, Vite, TailwindCSS, Lucide Icons
- **Backend**: Node.js, Express, Socket.IO, Multer
- **Banco de Dados**: MariaDB / MySQL (`orbit_db`)

---

## 🚀 Como Executar

### 1. Clonar o Repositório
```bash
git clone https://github.com/joaomiguelcode/Orbit.git
cd Orbit
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar o Banco de Dados
Importe o arquivo `schema.sql` no seu servidor MariaDB/MySQL (ex: via HeidiSQL ou phpMyAdmin) para criar a base `orbit_db`.

### 4. Iniciar o Projeto
Execute o script:
```bash
run.bat
```
Ou manualmente:
```bash
npm start
```

- **Frontend**: http://localhost:5173 (ou http://localhost:3001)
- **Backend**: http://localhost:3001

---

## 📄 Licença
Distribuído sob a licença MIT.
