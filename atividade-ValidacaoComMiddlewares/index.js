const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let pessoas = [];

// Rota para recuperar todas as pessoas
app.get('/pessoas', (req, res) => {
  res.json(pessoas);
});

// Rota para recuperar uma pessoa específica por meio de seu identificador
app.get('/pessoas/:id', (req, res) => {
  const id = req.params.id;
  const pessoa = pessoas.find(p => p.id === id);
  if (!pessoa) {
    return res.status(404).json({ message: 'Pessoa não encontrada' });
  }
  res.json(pessoa);
});

// Rota para adicionar uma nova pessoa
app.post('/pessoas', (req, res) => {
  const { nome, idade, email, telefone } = req.body;
  if (!nome || !idade || !email || !telefone) {
    return res.status(400).json({ message: 'Todos os atributos devem ser preenchidos' });
  }
  const pessoa = { nome, idade, email, telefone, id: String(Date.now()) };
  pessoas.push(pessoa);
  res.status(201).json(pessoa);
});

// Rota para atualizar uma pessoa existente com base em seu identificador
app.put('/pessoas/:id', (req, res) => {
  const id = req.params.id;
  const index = pessoas.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Pessoa não encontrada' });
  }
  const { nome, idade, email, telefone } = req.body;
  if (!nome || !idade || !email || !telefone) {
    return res.status(400).json({ message: 'Todos os atributos devem ser preenchidos' });
  }
  pessoas[index] = { ...pessoas[index], nome, idade, email, telefone };
  res.json(pessoas[index]);
});

// Rota para remover uma pessoa da lista com base em seu identificador
app.delete('/pessoas/:id', (req, res) => {
  const id = req.params.id;
  const index = pessoas.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Pessoa não encontrada' });
  }
  pessoas.splice(index, 1);
  res.status(204).send();
});

// Rota para adicionar várias pessoas de uma vez
app.post('/pessoas/batch', (req, res) => {
  const pessoasBatch = req.body;
  if (!Array.isArray(pessoasBatch)) {
    return res.status(400).json({ message: 'O corpo da requisição deve ser um array de pessoas' });
  }
  const novasPessoas = [];
  pessoasBatch.forEach(pessoa => {
    const { nome, idade, email, telefone } = pessoa;
    if (!nome || !idade || !email || !telefone) {
      return res.status(400).json({ message: 'Todos os atributos devem ser preenchidos para cada pessoa' });
    }
    const novaPessoa = { nome, idade, email, telefone, id: String(Date.now()) };
    novasPessoas.push(novaPessoa);
    pessoas.push(novaPessoa);
  });
  res.status(201).json(novasPessoas);
});

// Middleware para lidar com pessoa não encontrada
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint não encontrado' });
});

// Middleware para lidar com erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
