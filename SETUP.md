# Setup — Weave

## Prérequis

- [Node.js](https://nodejs.org) (v18 ou plus)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ou Podman

## Installation

1. **Cloner le repo**
   ```bash
   git clone <url-du-repo>
   cd weave
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.local.example .env.local
   ```
   (les valeurs par défaut fonctionnent directement avec le `docker-compose.yml` fourni, rien à modifier pour un lancement en local)

4. **Lancer la base de données**
   ```bash
   docker compose up -d
   ```
   Le schéma (tables `moodboards`, `users`, `sessions`) se crée automatiquement au premier démarrage.

```docker exec -i weave-postgres psql -U postgres -d weave < schema.sql```

5. **Lancer l'app**
   ```bash
   npm run dev
   ```

6. Ouvrir [http://localhost:3000](http://localhost:3000)

## Réinitialiser la base

Pour repartir d'une base complètement vide (supprime toutes les données) :

```bash
docker compose down -v
docker compose up -d
```

//docker exec -it weave-postgres psql -U postgres -d weave