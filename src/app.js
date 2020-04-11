const express = require('express');
const cors = require('cors');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (req, res) => {
  return res.json(repositories);
});

app.post('/repositories', (req, res) => {
  const { title, url, techs } = req.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return res.json(repository);
});

app.put('/repositories/:id', (req, res) => {
  const { id } = req.params;
  const { title, url, techs, likes } = req.body;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (!!likes) {
    return res.json({ likes: 0 });
  }

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  const repository = { id, title, url, techs };

  repositories[repositoryIndex] = repository;

  return res.json(repository);
});

app.delete('/repositories/:id', (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post('/repositories/:id/like', (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  repositories[repositoryIndex].likes++;

  return res.json({ likes: repositories[repositoryIndex].likes });
});

module.exports = app;
