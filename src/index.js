const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkIdRepository(request, response, next) {
    const { id } = request.params;

    if (!validate(id)) {
        return response.status(404).json({ error: "Id invalid!" });
    }

    return next();
}

function checkExistsRepository(request, response, next) {
    const { id } = request.params;

    repositoryIndex = repositories.findIndex(
        (repository) => repository.id === id
    );

    if (repositoryIndex === -1) {
        return response.status(404).json({ error: "Repository not found" });
    }

    request.repositoryIndex = repositoryIndex;

    return next();
}

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0,
    };

    repositories.push(repository);

    return response.status(201).json(repository);
});

app.put("/repositories/:id", checkExistsRepository, (request, response) => {
    const { repositoryIndex } = request;
    const { title, url, techs } = request.body;

    const updatedRepository = {
        title,
        url,
        techs,
    };

    const repository = {
        ...repositories[repositoryIndex],
        ...updatedRepository,
    };

    repositories[repositoryIndex] = repository;

    return response.status(201).json(repository);
});

app.delete("/repositories/:id", checkExistsRepository, (request, response) => {
    const { repositoryIndex } = request;

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
});

app.post(
    "/repositories/:id/like",
    checkIdRepository,
    checkExistsRepository,
    (request, response) => {
        const { repositoryIndex } = request;

        ++repositories[repositoryIndex].likes;

        return response.json(repositories[repositoryIndex]);
    }
);

module.exports = app;
