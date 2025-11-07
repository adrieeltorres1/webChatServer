## 🚀 WebChat Server (Back-end)

Este é o servidor back-end que fornece a camada de comunicação em tempo real para a aplicação WebChat. Ele foi desenvolvido com **Node.js** e a biblioteca **Socket.IO** e é responsável por:

* **Gerenciar as conexões** dos clientes.
* **Armazenar os nicknames** dos usuários ativos.
* **Retransmitir as mensagens** em tempo real entre todos os clientes conectados.

---

### ⚙️ Tecnologias Utilizadas

| Tecnologia | Função |
| :--- | :--- |
| **Node.js** | Ambiente de execução JavaScript. |
| **Express** | Framework web leve (usado primariamente para inicializar o servidor HTTP). |
| **Socket.IO** | Biblioteca essencial para comunicação bidirecional e em tempo real (WebSockets). |
| **CORS** | Configuração de segurança para permitir conexões do front-end (esperado na porta `5173`). |

---

### 📦 Instalação

Antes de rodar o servidor, certifique-se de ter o **Node.js** instalado em sua máquina.

#### 1. Instalar as Dependências

Na pasta do back-end, execute o seguinte comando para instalar as bibliotecas necessárias:

```bash
npm install express socket.io cors