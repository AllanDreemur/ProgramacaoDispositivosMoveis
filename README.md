## 🚀 Como rodar o projeto localmente

Após clonar o repositório, você precisará configurar e iniciar tanto o backend quanto o frontend. Siga os passos abaixo:

### 1. Configurando o Backend

Abra um terminal, navegue até a pasta do backend e siga estes passos:

* **Instale as dependências:**
    ```bash
    npm i
    ```
* **Crie o banco de dados:** Certifique-se de que o **PgAdmin esteja aberto** e rodando na sua máquina antes de executar o comando abaixo:
    ```bash
    npm run init-db
    ```
* **Inicie o servidor:**
    ```bash
    npm run dev
    ```

### 2. Configurando o Frontend

Em um **novo terminal**, navegue até a pasta do frontend da aplicação (Expo):

* **Instale as dependências:**
    ```bash
    npm i
    ```
* **Inicie o aplicativo:**
    ```bash
    npx expo start
    ```

> **⚠️ AVISO IMPORTANTE PARA TESTES EM MOBILE:** > Para que o aplicativo funcione corretamente no seu celular (através do Expo Go, por exemplo), o `localhost` não será reconhecido. Você **precisa** alterar as URLs de requisição no código do frontend que estão atualmente como `localhost:3000` para o **endereço IPV4** da sua conexão de rede atual (exemplo: `192.168.0.X:3000`).
