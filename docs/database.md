# Base de données Supabase

Le site fonctionne sans Supabase (stockage local `.data/content.json`, réservé au
développement). En production, Supabase fournit la base PostgreSQL, le stockage
des médias et l’authentification des comptes d’administration.

## Mise en place

1. Créer un projet Supabase (région la plus proche des utilisateurs).
2. Exécuter [`supabase/migrations/0001_initial_schema.sql`](../supabase/migrations/0001_initial_schema.sql)
   dans l’éditeur SQL du tableau de bord, ou avec la CLI Supabase (`supabase db push`).
3. Renseigner dans `.env.local` (et dans les variables d’environnement Vercel) :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (serveur uniquement)
4. Injecter les contenus vérifiés : `npm run db:seed`.
5. Créer le premier compte d’administration (Authentication → Users → Invite),
   puis lui attribuer le rôle `super_admin` dans la table `public.users`.

## Modèle

| Table | Usage |
| --- | --- |
| `users` | Profils d’administration liés à `auth.users`, avec rôle applicatif. |
| `site_settings` | Document unique (`id = 1`) contenant les paramètres institutionnels. |
| `projects` | Portefeuille de projets (PASEDI, PALVEN, Guiriko, CIVI-LINK…). |
| `intervention_areas` | Les 9 domaines d’intervention. |
| `news_articles` | Actualités et communiqués. |
| `publications` | Rapports, notes et ressources documentaires. |
| `partners` | Partenaires autorisés, avec référence d’autorisation. |
| `impact_indicators` | Indicateurs agrégés et sourcés. |
| `reporting_periods` | Périodes de référence des indicateurs. |
| `milestones` | Jalons historiques sourcés. |
| `testimonials` | Témoignages avec consentement obligatoire. |
| `events` | Événements institutionnels. |
| `pages` | Pages institutionnelles éditables. |
| `media_assets` | Métadonnées des images (fichiers dans le bucket `media`). |
| `contact_messages` | Messages du formulaire public. |
| `newsletter_subscribers` | Abonnés à la lettre d’information. |
| `activity_logs` | Journal des actions d’administration. |

Choix de modélisation :

- Les galeries projet sont stockées dans `projects.gallery` (JSONB) : pas de
  table dédiée, pas de référence individuelle de bénéficiaire.
- Les catégories de projet correspondent aux domaines d’intervention
  (`intervention_areas`) référencés par `projects.area_slugs`.
- Les contenus éditoriaux utilisent une suppression logique (`deleted_at`) ; la
  médiathèque est supprimée physiquement.
- `updated_at` est maintenu par déclencheur sur toutes les tables éditoriales.

## Sécurité et RLS

La RLS est activée sur toutes les tables.

- **Lecture anonyme** : uniquement les contenus publiés (`status`,
  `content_status` ou `published` selon la table), les paramètres du site et les
  médias. Aucun accès anonyme aux messages, abonnés, comptes ou journal.
- **Personnel** (`authenticated` + rôle actif) : lecture élargie et écritures
  des contenus ; les rôles `super_admin` et `admin` gèrent paramètres, messages
  et abonnés ; seul `super_admin` gère les comptes.
- **Formulaires publics** : aucune policy d’insertion anonyme. Les inscriptions
  et messages passent par les Server Actions Next.js, donc par la clé de
  service côté serveur — jamais depuis le navigateur.
- **Bucket `media`** : lecture publique, écriture réservée au personnel.

L’administration utilise une session applicative (cookie HMAC signé, table
`users`), pas un JWT Supabase. C’est pourquoi le serveur Next.js utilise la clé
de service : elle n’est jamais exposée au navigateur et les permissions sont
vérifiées dans les Server Actions (`src/lib/content/repository.ts`).

## Données interdites

Le schéma ne comporte aucune table de bénéficiaires. Ne jamais stocker :

- de pièce d’identité ou de données individuelles de personnes déplacées ;
- de dossier médical ou social nominatif ;
- de coordonnées de bénéficiaires ;
- de photographie identifiable sans consentement documenté.

Le projet CIVI-LINK ne doit collecter que des données agrégées ou strictement
nécessaires à la coordination, jamais des dossiers individuels de déplacés.

## Sauvegardes et rétention

- Activer les sauvegardes automatiques du projet Supabase (plan payant).
- Purger les messages de contact traités au-delà de la durée nécessaire
  (recommandation : 12 mois).
- Supprimer les abonnés désinscrits sur demande explicite.
- Conserver le journal d’activité selon la politique de l’organisation.
