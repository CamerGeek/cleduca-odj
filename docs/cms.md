# Guide de l’administration

Adresse : `/admin` (connexion : `/admin/connexion`).

## Rôles et permissions

| Permission | Super admin | Admin | Éditeur | Contributeur |
| --- | :-: | :-: | :-: | :-: |
| Lire les contenus | ✓ | ✓ | ✓ | ✓ |
| Créer / modifier | ✓ | ✓ | ✓ | ✓ |
| Publier / archiver | ✓ | ✓ | ✓ | — |
| Supprimer (corbeille logique) | ✓ | ✓ | — | — |
| Indicateurs d’impact | ✓ | ✓ | ✓ | — |
| Médiathèque | ✓ | ✓ | ✓ | — |
| Messages et abonnés | ✓ | ✓ | ✓ | — |
| Paramètres du site | ✓ | ✓ | — | — |
| Comptes et rôles | ✓ | — | — | — |
| Journal d’activité | ✓ | ✓ | — | — |

Le principe du moindre privilège s’applique : n’accordez que les droits
nécessaires. Un contributeur prépare les fiches en brouillon ; un éditeur les
relit et publie.

## Circuit éditorial

Chaque contenu possède un statut de publication :

1. **Brouillon** — travail en cours, invisible sur le site.
2. **En relecture** — prêt pour vérification, invisible sur le site.
3. **Publié** — visible publiquement.
4. **Archivé** — retiré du site sans suppression.

La date de publication des actualités et publications est renseignée
automatiquement lors de la première publication.

La suppression est logique : le contenu disparaît du site et de la liste, mais
reste récupérable en base (`deleted_at`). La médiathèque est supprimée
physiquement.

## Création d’un contenu

1. **Contenus** → choisir la collection (projets, actualités, pages, etc.).
2. **Ajouter**, renseigner les champs obligatoires (titre, résumé…).
3. Choisir le statut dans le panneau **Publication**.
4. **Enregistrer** ; vérifier le statut affiché dans la liste.

Règles de saisie :

- L’adresse (slug) est générée depuis le titre ; elle peut être ajustée.
- Les listes (objectifs, activités, résultats, couverture) s’écrivent une entrée
  par ligne.
- Ne jamais inventer de chiffres, de partenaires ou de dates. Utiliser
  « à confirmer » lorsque l’information n’est pas vérifiée.
- Les résultats affichés doivent être sourcés et datés.

## Garde-fous de publication

- **Partenaires** : la publication exige une référence d’autorisation écrite
  (`authorizationNote`). N’utilisez que des logos autorisés.
- **Témoignages** : la publication exige un consentement documenté
  (`consentOnFile`).
- **Photographies identifiables** : consentement préalable obligatoire.
- Un contributeur ne peut pas publier ; le statut précédent est conservé lors
  d’une modification.

## Messages reçus

Les messages du formulaire public arrivent au statut **Nouveau**. Cycle :
Nouveau → En traitement → Clôturé. Répondez directement à l’adresse indiquée.

Ne demandez jamais de pièce d’identité, de dossier médical ou d’information sur
le statut de déplacement d’une personne. Si un message contient de telles
données, traitez-le puis supprimez-le sans en conserver de copie.

## Abonnés à la lettre d’information

- Statuts : En attente, Confirmé, Désinscrit.
- L’export CSV contient uniquement les données nécessaires à l’envoi.
- Conservez l’export de manière sécurisée et supprimez-le après usage.
- Toute demande de désinscription ou de suppression doit être traitée.

## Médiathèque

- Formats acceptés : JPEG, PNG, WebP, AVIF, GIF (5 Mo maximum). Les SVG sont
  refusés pour des raisons de sécurité.
- Le texte alternatif est obligatoire et doit décrire factuellement l’image.
- Les visuels fournis avec le site sont protégés : ils ne peuvent pas être
  supprimés depuis l’administration.
- En production, les fichiers sont stockés dans Supabase Storage (bucket
  `media`) ; en local, dans `.data/uploads`.

## Paramètres du site

Identité, coordonnées, réseaux sociaux, contenu de la page d’accueil et textes
de la lettre d’information. Les coordonnées restent vides tant qu’elles ne sont
pas confirmées : aucun numéro ni adresse n’est inventé. Les modifications sont
immédiatement répercutées sur le site public.

## Comptes et rôles

La gestion des comptes nécessite Supabase Auth et la clé de service. Un
administrateur crée les comptes par invitation (Authentication → Users, ou
panneau d’invitation). Un super administrateur attribue ensuite le rôle dans la
table `public.users`.

Sécurités : impossible de modifier son propre rôle ou de désactiver son compte ;
le dernier super administrateur actif ne peut pas être retiré. Un compte
désactivé perd l’accès.

## Journal d’activité

Chaque création, modification, publication, suppression, connexion ou export
est horodaté avec l’auteur. Le journal est en lecture seule et permet de
retracer les décisions éditoriales. Les entrées contiennent des résumés, jamais
de données sensibles.
