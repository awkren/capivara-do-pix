<p align='center'>
  <img src="./capi.jpg" alt="Image" width='40%'>
</p>

## Sistema de <s>pirâmide</s> investimento onde o seu dinheiro <s>diminui</s> rende 33.33% ao mês.

### ✅ Fiel ao tipo de <s>golpe</s> investimento!

Você deposita e o seu dinheiro <s>some</s> multiplica.

### 🧠 Sabedoria do Egito Antigo

Conforme vai entrando mais <s>otário</s> gente, mais difícil fica para sacar o dinheiro.

<br>

#### Como utilizar

Crie o arquivo `.env` no diretório raiz com o conteúdo `PORT=3307`

``` bash
docker build -t pixramide-mysql .
```

```bash
docker run -d --name pixramide-mysql-container -p 3306:3306 pixramide-mysql
```

`npm i`

`npm run build; npm run dev`

### Features

O sistema permite adicionar novos usuários, deletar usuários e sacar o dinheiro.

GET em /users retorna os usuários cadastrados (id, nome, investimento e lucro).

POST em /users para inserir novos usuários => { name, investment}, o resto é automático.

POST em /users/withdraw com o ID { id: x } para sacar o dinheiro. Mas fica esperto que quanto mais usuários tiver na plataforma, mais difícil fica pra sacar. A cada usuário cadastrado após 5 usuários cadastrados, fica 5% mais difícil sacar o dinheiro.

DELETE em /users passando o ID { id: 5 } pra deletar o usuário

🚨 _Isso aqui é somente para fins de estudo. Não está conectado com nenhum sistema de pagamento nem nada do tipo. Os dados o que o usuário é capaz de inserir são apenas fictícios. Também não me responsabilizo por nada que nenhum usuário faça a partir desse repositório, seja tendo como inspiração ou alterando qualquer funcionalidade do código._
