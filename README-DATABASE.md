# Configuration de la Base de Données

Votre application utilise maintenant **Turso** (SQLite dans le cloud) avec **Drizzle ORM** pour stocker vos données de manière persistante et sécurisée.

## 📋 Prérequis

Avant de commencer, vous devez configurer une base de données Turso.

## 🚀 Configuration rapide

### 1. Créer un compte Turso

1. Allez sur [https://turso.tech](https://turso.tech)
2. Créez un compte gratuit (offre gratuite généreuse)

### 2. Installer le CLI Turso

```bash
# macOS / Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows (PowerShell)
irm https://get.tur.so/install.ps1 | iex
```

### 3. Se connecter au CLI

```bash
turso auth login
```

### 4. Créer une base de données

```bash
turso db create voyage-app
```

### 5. Obtenir l'URL de la base de données

```bash
turso db show voyage-app --url
```

Copiez l'URL qui ressemble à : `libsql://voyage-app-[votre-nom].turso.io`

### 6. Créer un token d'authentification

```bash
turso db tokens create voyage-app
```

Copiez le token généré.

### 7. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```bash
TURSO_DATABASE_URL=libsql://voyage-app-[votre-nom].turso.io
TURSO_AUTH_TOKEN=votre-token-ici
```

### 8. Initialiser la base de données

```bash
bun run backend/db/migrate.ts
```

Cette commande va créer toutes les tables nécessaires dans votre base de données.

## 📊 Structure de la Base de Données

Voici les tables créées :

### Tables principales :
- **users** - Informations des utilisateurs
- **trips** - Voyages planifiés/complétés
- **locations** - Lieux visités lors des voyages
- **expenses** - Dépenses par voyage
- **checklists** - Listes de tâches pour les voyages
- **media** - Photos et vidéos
- **saved_places** - Lieux sauvegardés
- **journals** - Journaux de voyage
- **playlists** - Playlists musicales
- **posts** - Publications sociales
- **notifications** - Notifications de l'app

## 🔄 Comment ça fonctionne

### Avant (AsyncStorage uniquement)
- Données stockées uniquement sur l'appareil
- Perdues si l'app est désinstallée
- Pas de synchronisation entre appareils

### Maintenant (Base de données + AsyncStorage)
- **AsyncStorage** : Cache local pour accès rapide
- **Base de données** : Stockage permanent et synchronisé
- Vos données sont sauvegardées dans le cloud
- Possibilité de se connecter depuis plusieurs appareils (à implémenter)

## 📱 Utilisation dans l'app

Les fonctions du `AppContext` ont été mises à jour pour utiliser automatiquement la base de données :

```typescript
import { useApp } from '@/store/AppContext';

function MyComponent() {
  const { user, trips, saveUser, addTrip } = useApp();

  // Les données sont automatiquement synchronisées avec la base de données
  const handleCreateTrip = async () => {
    await addTrip(newTrip); // Sauvegarde en DB + cache local
  };

  return (
    // Votre composant
  );
}
```

## 🛠️ Développement local

Si vous voulez développer sans connexion Internet, vous pouvez utiliser une base de données SQLite locale :

1. Modifiez `.env` :
```bash
TURSO_DATABASE_URL=file:local.db
# Commentez ou supprimez TURSO_AUTH_TOKEN
```

2. Lancez la migration :
```bash
bun run backend/db/migrate.ts
```

Un fichier `local.db` sera créé à la racine du projet.

## 🔍 Consulter vos données

### Via Turso CLI

```bash
# Ouvrir un shell SQL
turso db shell voyage-app

# Exemples de requêtes
SELECT * FROM users;
SELECT * FROM trips WHERE user_id = 'xxx';
```

### Via Turso Dashboard

1. Allez sur [https://app.turso.tech](https://app.turso.tech)
2. Sélectionnez votre base de données
3. Utilisez l'éditeur SQL intégré

## 🔒 Sécurité

- Les tokens Turso sont sensibles - ne les committez JAMAIS dans Git
- Le fichier `.env` est dans `.gitignore` par défaut
- Utilisez des variables d'environnement pour la production

## ⚡ API tRPC disponibles

Votre backend expose maintenant les API suivantes via tRPC :

### Utilisateurs
- `trpc.users.create` - Créer un utilisateur
- `trpc.users.get` - Récupérer un utilisateur par ID
- `trpc.users.getByEmail` - Récupérer un utilisateur par email
- `trpc.users.update` - Mettre à jour un utilisateur
- `trpc.users.delete` - Supprimer un utilisateur

### Voyages
- `trpc.trips.create` - Créer un voyage
- `trpc.trips.getByUser` - Récupérer tous les voyages d'un utilisateur
- `trpc.trips.getById` - Récupérer un voyage par ID
- `trpc.trips.update` - Mettre à jour un voyage
- `trpc.trips.delete` - Supprimer un voyage

## 🆘 Aide et Support

### Problèmes courants

**Erreur : "TURSO_DATABASE_URL is not defined"**
- Vérifiez que votre fichier `.env` existe
- Redémarrez votre serveur de développement

**Erreur de connexion à Turso**
- Vérifiez votre token d'authentification
- Assurez-vous d'avoir une connexion Internet

**Tables non créées**
- Lancez `bun run backend/db/migrate.ts`

### Ressources

- [Documentation Turso](https://docs.turso.tech)
- [Documentation Drizzle ORM](https://orm.drizzle.team)
- [Documentation tRPC](https://trpc.io)

## 🎉 Prochaines étapes

- [ ] Implémenter l'authentification utilisateur complète
- [ ] Ajouter la gestion des rôles et permissions
- [ ] Implémenter la synchronisation temps réel
- [ ] Ajouter des endpoints pour expenses, checklists, etc.
- [ ] Implémenter le partage de voyages entre utilisateurs
