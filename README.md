# Laptop Store

Projet académique d’application web autour d’une boutique d’ordinateurs portables, développé avec React et Vite.

## Technologies

- **Interface :** React, Material UI, Emotion et Lucide React.
- **Navigation :** React Router.
- **Formulaires et validation :** Formik et Yup.
- **Services Firebase :** bibliothèque Firebase intégrée au projet.
- **API locale :** JSON Server, à partir du fichier `db.json`.
- **Génération de PDF :** jsPDF et jsPDF AutoTable.
- **Qualité du code :** ESLint.

## Installation

### Prérequis

- Une version de Node.js compatible avec Vite 8.
- npm.
- Git.

### Récupérer le projet

```bash
git clone https://github.com/yasmine88A/laptop-store.git
cd laptop-store
npm install
```

### Configuration Firebase

Si les fonctionnalités utilisées nécessitent Firebase, configurer son propre projet Firebase dans le fichier de configuration prévu par l’application.

### Démarrer l’API locale

Dans un premier terminal :

```bash
npm run server
```

JSON Server utilise le fichier `db.json` et le port **3001**.

### Démarrer l’interface

Dans un deuxième terminal :

```bash
npm run dev
```

Ouvrir l’adresse affichée par Vite dans le terminal.

## Autres commandes

```bash
# Vérifier le code avec ESLint
npm run lint

# Générer la version de production
npm run build

# Prévisualiser la version de production après compilation
npm run preview
```

## Remarque

JSON Server sert d’API locale de développement. Le démarrage de l’interface et celui de l’API se font dans deux terminaux distincts.

## Auteure

Yasmine Anwar
