# 🔧 Correction de l'erreur de création de compte

## Problème identifié

L'erreur lors de la création de compte est causée par un problème de mapping entre les noms de colonnes de la base de données :

- **Avant** : Les colonnes utilisaient `snake_case` (ex: `first_name`, `last_name`)
- **Après** : Le code utilise `camelCase` (ex: `firstName`, `lastName`)

Drizzle ORM ne fait pas automatiquement le mapping entre ces deux formats, ce qui causait l'erreur "impossible de créer le compte".

## Solution appliquée

J'ai corrigé le problème en :

1. ✅ **Mis à jour le schéma** (`backend/db/schema.ts`) pour utiliser `camelCase`
2. ✅ **Mis à jour la migration** (`backend/db/migrate.ts`) pour utiliser `camelCase`
3. ✅ **Créé un script de reset** (`backend/db/reset.ts`) pour recréer la base de données

## Actions à effectuer

### Étape 1 : Réinitialiser la base de données

Exécutez cette commande dans votre terminal :

```bash
bun backend/db/reset.ts
```

Cette commande va :
- Supprimer l'ancienne base de données avec les mauvaises colonnes
- Créer une nouvelle base de données avec le bon schéma en camelCase

### Étape 2 : (Optionnel) Réinsérer les activités

Si vous avez besoin des activités de démonstration :

```bash
bun backend/db/seed-activities.ts
```

### Étape 3 : Tester la création de compte

1. Redémarrez votre application si nécessaire
2. Allez dans **Paramètres** > **Créer un compte**
3. Remplissez le formulaire et créez un compte
4. Vous devriez recevoir un code de vérification (visible dans les logs si RESEND_API_KEY n'est pas configuré)

## Ce qui a été modifié

### Fichiers modifiés

1. **backend/db/schema.ts**
   - Tous les noms de colonnes sont maintenant en camelCase
   - Exemple : `first_name` → `firstName`

2. **backend/db/migrate.ts**
   - Script de migration mis à jour avec le nouveau schéma
   - Ajout des tables `activities` et `activity_bookings` qui manquaient

3. **backend/db/reset.ts** (nouveau fichier)
   - Script pour réinitialiser complètement la base de données
   - Supprime l'ancien fichier `local.db` et crée un nouveau

## Vérification

Après avoir exécuté `bun backend/db/reset.ts`, vous devriez voir :

```
🗑️  Resetting database...
✅ Old database deleted
🚀 Creating new database schema...
✅ Database reset completed successfully!
📊 All tables created with new schema.
🎉 Database reset complete!
```

## Si vous avez encore des erreurs

1. Vérifiez que le fichier `local.db` a bien été supprimé
2. Vérifiez les logs de la console pour voir les erreurs spécifiques
3. Assurez-vous que toutes les dépendances sont installées (`bun install`)

## Note importante

⚠️ **Cette opération supprime toutes les données existantes dans la base de données locale.**

Si vous avez des utilisateurs ou données de test que vous voulez conserver, faites une sauvegarde du fichier `local.db` avant d'exécuter le reset.
