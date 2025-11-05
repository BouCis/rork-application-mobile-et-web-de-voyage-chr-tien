# Configuration des APIs externes

Ce document explique comment configurer les APIs externes pour activer les fonctionnalités de recherche de vols et d'hôtels.

## Mode simulation vs Mode live

L'application fonctionne en **deux modes** :

### Mode simulation (par défaut)
- Aucune clé API requise
- Les recherches retournent des listes vides
- Un bandeau jaune indique "Mode simulation - API non configurée"
- Parfait pour le développement et les tests sans frais

### Mode live
- Nécessite des clés API configurées
- Les recherches retournent des données réelles
- Tarification selon les fournisseurs

---

## APIs supportées

### 1. Amadeus (Vols et Hôtels)

Amadeus est une plateforme leader pour les données de voyage (vols, hôtels, etc.).

#### Obtenir les clés API

1. **Créer un compte** : [Amadeus Self-Service](https://developers.amadeus.com/)
2. **S'inscrire** gratuitement (plan Test gratuit disponible)
3. **Créer une application** dans le dashboard
4. **Récupérer** :
   - `API Key`
   - `API Secret`

#### Configuration

Ajoutez dans votre fichier `.env` :

```bash
AMADEUS_API_KEY=your_api_key_here
AMADEUS_API_SECRET=your_api_secret_here
```

#### Endpoints utilisés

- **Recherche de villes/aéroports** : `/v1/reference-data/locations`
- **Recherche de vols** : `/v2/shopping/flight-offers`
- **Recherche d'hôtels** : `/v1/reference-data/locations/hotels/by-city`

#### Plan gratuit

- **Test environment** : gratuit
- Limites : nombre de requêtes limité (généralement suffisant pour le développement)
- **Production** : requiert un plan payant

#### Documentation

- [Amadeus for Developers](https://developers.amadeus.com/)
- [API Reference](https://developers.amadeus.com/self-service)

---

### 2. Google Places API (Recherche de lieux)

Google Places API permet de rechercher des villes, pays, et lieux d'intérêt.

#### Obtenir la clé API

1. **Console Google Cloud** : [console.cloud.google.com](https://console.cloud.google.com/)
2. **Créer un projet** (ou utiliser un existant)
3. **Activer l'API** :
   - Allez dans "APIs & Services" > "Library"
   - Recherchez "Places API"
   - Cliquez sur "Enable"
4. **Créer une clé API** :
   - Allez dans "APIs & Services" > "Credentials"
   - Cliquez sur "Create Credentials" > "API Key"
   - Copiez la clé

#### Configuration

Ajoutez dans votre fichier `.env` :

```bash
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

#### Endpoint utilisé

- **Text Search** : `/maps/api/place/textsearch/json`

#### Plan gratuit

- **$200 de crédits gratuits par mois** (suffisant pour ~40 000 requêtes Text Search)
- Au-delà : $0.032 par requête

#### Sécurité

Pour protéger votre clé API en production :

1. **Restreindre par IP** (pour serveur backend)
2. **Restreindre par API** (Places API uniquement)
3. **Définir des quotas** pour éviter les abus

#### Documentation

- [Places API Overview](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Text Search](https://developers.google.com/maps/documentation/places/web-service/search-text)

---

## Tester les APIs

### Vérifier la configuration

Lancez l'application et :

1. **Page d'accueil** : Recherchez une ville (ex: "Paris")
2. **Sélectionnez un résultat** → vous arrivez sur `/destination/search-results`
3. **Si mode simulation** : bandeau jaune "Mode simulation - API non configurée"
4. **Si mode live** : pas de bandeau, résultats réels s'affichent

### Recherche de vols

1. Sur la page `/destination/search-results`
2. Onglet "Vols"
3. Renseignez :
   - Origine (code IATA, ex: `PAR` pour Paris)
   - Destination (pré-rempli)
   - Date de départ (format `YYYY-MM-DD`)
4. Cliquez sur "Rechercher"

### Recherche d'hôtels

1. Sur la page `/destination/search-results`
2. Onglet "Hôtels"
3. Cliquez sur "Rechercher"
4. Les hôtels de la ville sélectionnée s'affichent

---

## Dépannage

### Erreur : "Mode simulation - API non configurée"

- Vérifiez que les clés API sont dans `.env`
- Redémarrez le serveur backend après modification de `.env`
- Vérifiez que les clés sont correctes

### Erreur : "401 Unauthorized" (Amadeus)

- Vérifiez que `AMADEUS_API_KEY` et `AMADEUS_API_SECRET` sont corrects
- Assurez-vous d'utiliser les clés du **Test environment**

### Erreur : "REQUEST_DENIED" (Google Places)

- Vérifiez que Places API est activée dans Google Cloud Console
- Vérifiez que la clé API a les permissions nécessaires
- Vérifiez la facturation (un compte facturation doit être lié, même pour le plan gratuit)

### Pas de résultats

- Pour les vols : vérifiez les codes IATA (aéroports/villes)
- Pour les vols : vérifiez la date (doit être future)
- Pour les hôtels : certaines villes peuvent ne pas avoir de données

---

## Coûts estimés

Pour une application en développement/test :

| Service | Plan gratuit | Coût moyen (si dépassement) |
|---------|--------------|------------------------------|
| **Amadeus Test** | Gratuit | N/A (non facturé en test) |
| **Google Places** | $200/mois | $0.032 par requête |

### Conseil

- Utilisez le **mode simulation** pour le développement
- Activez le **mode live** uniquement pour les démos et tests finaux
- Mettez des **quotas** pour éviter les surprises

---

## Support

- **Amadeus** : [Support Amadeus](https://developers.amadeus.com/support)
- **Google Places** : [Support Google Cloud](https://cloud.google.com/support)

---

## Fichiers concernés

- `backend/trpc/routes/external/amadeus.ts` : Routes Amadeus
- `backend/trpc/routes/external/places.ts` : Route Google Places
- `app/destination/search-results.tsx` : UI de recherche
- `app/(tabs)/planner.tsx` : Page d'accueil avec recherche

---

**Note** : Ce document est mis à jour régulièrement. Pour toute question, consultez la documentation officielle des APIs.
