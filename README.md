
![Logo](https://tudoprawhats.com.br/wp-content/uploads/2021/08/bot-whatsapp.png)


# API WhatsApp Pessoal

API criada com o intuito de fornecer uma forma de envio de mensagens automáticas com uma conta pessoal no WhatsApp.



## Documentação da API

#### Envia mensagem para um contato

```http
  POST /send
```

| Body   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `contact` | `string` | **Obrigatório**. O nome do contato/grupo salvo no WhatsApp. |
| `message` | `string` | **Obrigatório**. Mensagem à ser enviada |

#### Retorna o status da api

```http
  GET /status
```



## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/alisson-moura/api-personal-wpp
```

Entre no diretório do projeto

```bash
  cd api-personal-wpp
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm start
```


## Stack utilizada
**Back-end:** Node, Express, Puppeteer


## Autores

- [@Alisson Moura](https://www.github.com/alisson-moura)

