# CLEDUCA-ODJ — site institutionnel et plateforme d’engagement

Site institutionnel et espace d’administration du **Club d’Éducation Actuelle –
Organisation pour le Développement de la Jeunesse**, organisation de la société
civile burkinabè créée en 1997 à Bobo-Dioulasso (Hauts-Bassins).

- Site public : présentation, 9 domaines d’intervention, projets, actualités,
  impact, ressources, partenaires, contact et pages légales.
- Administration : gestion des contenus, de l’impact, des messages, des abonnés,
  de la médiathèque, des comptes et du journal d’activité.

## Stack

- Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict
- Tailwind CSS 4 (tokens `@theme`) · Lucide
- Supabase (PostgreSQL, Storage, Auth) en production ; stockage local en
  développement
- Déploiement Vercel, sans Docker

## Démarrage local

Prérequis : Node.js ≥ 20.9, npm.

```bash
npm install
cp .env.example .env.local
# renseigner ADMIN_PASSWORD et AUTH_SECRET
npm run dev
```

`AUTH_SECRET` doit contenir au moins 16 caractères aléatoires :

```bash
openssl rand -base64 32
```

Sans Supabase configuré, l’application utilise `.data/content.json`, créé
automatiquement à partir des contenus vérifiés de `src/content`. L’accès à
`/admin` utilise alors `ADMIN_EMAIL` et `ADMIN_PASSWORD`.

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm start` | Serveur de production |
| `npm run typecheck` | Vérification TypeScript |
| `npm run db:seed` | Injection des contenus dans Supabase |

## Passer en production (Supabase)

1. Appliquer `supabase/migrations/0001_initial_schema.sql` (SQL Editor ou CLI).
2. Renseigner `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` et
   `SUPABASE_SERVICE_ROLE_KEY` (serveur uniquement).
3. Lancer `npm run db:seed` pour injecter les contenus vérifiés.
4. Inviter le premier administrateur (Supabase Auth) puis lui attribuer le rôle
   `super_admin` dans `public.users`.

Détails, RLS et modèle de données : [`docs/database.md`](docs/database.md).

## Structure

```
src/app/(site)/        Pages publiques
src/app/admin/         Administration (connexion + dashboard)
src/app/actions/       Server Actions publiques (contact, newsletter)
src/components/        UI publique et composants d’administration
src/content/           Contenus institutionnels vérifiés (seed)
src/lib/content/       Types, dépôts local/Supabase, requêtes, RBAC
src/lib/auth/          Session HMAC, garde d’accès
supabase/migrations/   Schéma PostgreSQL, RLS, Storage
scripts/               Outils (seed Supabase)
docs/                  Documentation technique et éditoriale
CREDITS.md             Attributions des photographies sous licence libre
```

## Administration

Rôles : super administrateur, administrateur, éditeur, contributeur. Le détail
des permissions et du circuit éditorial figure dans
[`docs/cms.md`](docs/cms.md).

Un contributeur ne peut pas publier : les statuts « Publié », « En relecture »
et « Archivé » sont réservés aux rôles habilités. La publication d’un partenaire
exige une référence d’autorisation, celle d’un témoignage exige un consentement
documenté.

## Règles éditoriales et éthiques

- Ne publier que des informations vérifiées : aucun chiffre, partenaire,
  financement ou jalon historique inventé.
- Les informations indisponibles restent explicitement signalées (« à
  confirmer », placeholders assumés).
- Aucune donnée personnelle de bénéficiaire, aucun dossier individuel de
  personne déplacée. CIVI-LINK ne collecte que des données agrégées ou de
  coordination.
- Toute photographie identifiable et tout témoignage exigent un consentement
  préalable documenté.
- Les coordonnées de l’organisation sont configurables dans l’administration ;
  aucun numéro, adresse électronique ou réseau social n’est inventé.

## Sécurité

- Sessions d’administration signées (HMAC, cookie httpOnly, 8 h), secret
  `AUTH_SECRET` obligatoire.
- Mots de passe vérifiés par Supabase Auth en production ; accès local réservé
  au développement.
- RLS activée sur toutes les tables ; clé de service strictement côté serveur.
- Validation Zod, limitation de débit et honeypot sur les formulaires publics ;
  adresse IP hachée avant enregistrement.
- Journal d’activité horodaté pour chaque action d’administration.

## Déploiement Vercel

1. Importer le dépôt dans Vercel (framework Next.js, aucune commande spéciale).
2. Ajouter les variables d’environnement de `.env.example`, en particulier
   `NEXT_PUBLIC_SITE_URL` avec l’URL définitive.
3. Configurer Supabase et le bucket `media` avant la mise en ligne : le stockage
   local `.data/uploads` n’est pas persistant sur Vercel.
4. Vérifier après déploiement : `/sitemap.xml`, `/robots.txt`, connexion à
   `/admin`, envoi d’un message de contact.

## Accessibilité et sobriété

Navigation clavier, lien d’évitement, libellés explicites, contrastes vérifiés,
images décrites, mise en page mobile d’abord. Les polices sont auto-hébergées,
les images servies en AVIF/WebP et les variantes plafonnées à 1920 px pour les
connexions limitées.
