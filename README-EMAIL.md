# Configuration de l'envoi d'emails

Ce guide explique comment configurer l'envoi d'emails de vérification dans l'application.

## Service utilisé : Resend

L'application utilise [Resend](https://resend.com) pour envoyer des emails de vérification lors de la création de compte.

### Pourquoi Resend ?

- ✅ Gratuit jusqu'à 3000 emails/mois (100/jour)
- ✅ API simple et moderne
- ✅ Excellente délivrabilité
- ✅ Templates HTML supportés
- ✅ Pas de configuration serveur complexe

## Configuration

### 1. Créer un compte Resend

1. Allez sur [https://resend.com](https://resend.com)
2. Cliquez sur "Sign up" pour créer un compte gratuit
3. Vérifiez votre email

### 2. Obtenir votre clé API

1. Connectez-vous à votre compte Resend
2. Allez dans la section **API Keys**
3. Cliquez sur **Create API Key**
4. Donnez un nom à votre clé (ex: "Voyage App")
5. Copiez la clé API générée

### 3. Configurer les variables d'environnement

1. Copiez le fichier `env.example` vers `.env` :
   ```bash
   cp env.example .env
   ```

2. Ouvrez `.env` et ajoutez votre clé API Resend :
   ```env
   RESEND_API_KEY=re_votre_cle_api_ici
   ```

3. Assurez-vous que le fichier `.env` est dans `.gitignore` (déjà configuré)

### 4. Configurer votre domaine (Optionnel pour production)

Par défaut, Resend utilise `onboarding@resend.dev` comme adresse d'envoi. Pour la production, vous devez :

1. Dans Resend, allez dans **Domains**
2. Cliquez sur **Add Domain**
3. Suivez les instructions pour vérifier votre domaine
4. Une fois vérifié, mettez à jour l'adresse dans `backend/trpc/routes/emails/send-verification.ts` :
   ```typescript
   from: 'Voyage App <noreply@votre-domaine.com>',
   ```

## Fonctionnalités

### Email de vérification

Lorsqu'un utilisateur crée un compte :
1. Un code de 6 chiffres est généré
2. Le code est stocké dans la base de données avec une expiration de 15 minutes
3. Un email est envoyé via Resend avec le code
4. L'utilisateur entre le code pour vérifier son email

### Template d'email

L'email envoyé contient :
- Un header avec le logo de l'application
- Un message de bienvenue personnalisé avec le prénom
- Le code de vérification en gros caractères
- Une note sur la validité du code (15 minutes)
- Des conseils (vérifier les spams)

## Test sans configuration

Si vous ne configurez pas `RESEND_API_KEY`, l'application :
- ❌ N'enverra pas de vrais emails
- ✅ Affichera le code dans les logs console
- ✅ Continuera de fonctionner normalement
- ⚠️ L'utilisateur devra consulter les logs pour voir le code

Exemple de log :
```
📧 Email de vérification envoyé à user@example.com
📋 Code de vérification: 123456
⏰ Expiration: 15 minutes
```

## Limites du plan gratuit

- 100 emails par jour
- 3 000 emails par mois
- 1 domaine personnalisé
- Support par email

Pour plus d'emails, consultez les [plans payants de Resend](https://resend.com/pricing).

## Dépannage

### L'email n'arrive pas

1. Vérifiez les logs backend pour voir si l'email a été envoyé
2. Consultez les spams
3. Vérifiez votre quota sur le dashboard Resend
4. Assurez-vous que `RESEND_API_KEY` est correctement configuré

### Erreur "Email service not configured"

Cela signifie que `RESEND_API_KEY` n'est pas défini dans vos variables d'environnement. Le code de vérification sera affiché dans les logs console.

### Erreur "Invalid API key"

Vérifiez que votre clé API commence par `re_` et est correctement copiée depuis Resend.

## Code source

- Route backend : `backend/trpc/routes/emails/send-verification.ts`
- Page d'inscription : `app/auth/signup.tsx`
- Page de vérification : `app/auth/verify-email.tsx`

## Alternative : Autres services d'email

Si vous préférez utiliser un autre service, vous pouvez modifier `backend/trpc/routes/emails/send-verification.ts` pour utiliser :

- **SendGrid** - Gratuit jusqu'à 100 emails/jour
- **Mailgun** - Gratuit jusqu'à 5000 emails/mois
- **AWS SES** - Très bon marché mais configuration complexe
- **Postmark** - Excellent pour les emails transactionnels
