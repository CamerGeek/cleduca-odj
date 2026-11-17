import type { Metadata } from "next";
import { Compass, ShieldCheck } from "lucide-react";

import { AreaCard } from "@/components/site/cards";
import { CtaBand } from "@/components/site/cta-band";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAreas } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Domaines d’intervention",
  description:
    "Les neuf domaines d’intervention de CLEDUCA-ODJ : éducation, jeunesse, numérique, inclusion, genre, bien-être, cohésion sociale, justice et résilience.",
  alternates: { canonical: "/domaines" },
};

export default async function AreasPage() {
  const areas = await getAreas();
  const documented = areas.filter((area) => area.status === "documented").length;
  const positioning = areas.length - documented;

  return (
    <>
      <PageHero
        eyebrow="Domaines d’intervention"
        title="Neuf domaines pour agir sur les causes et les conséquences des vulnérabilités."
        intro="CLEDUCA-ODJ aborde l’éducation, la jeunesse, le numérique, l’inclusion, l’égalité de genre, la justice de proximité et la cohésion sociale comme des leviers complémentaires d’un même engagement communautaire."
        crumbs={[{ label: "Domaines d’intervention" }]}
        image="/images/literacy-class.jpg"
        imageAlt="Centre d’alphabétisation en briques au Burkina Faso."
        imageCaption="Photo d’illustration : centre d’alphabétisation au Burkina Faso. Crédit : Le Soleil dans la Main, CC BY-SA 4.0."
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="green">{documented} domaines documentés</Badge>
          <Badge tone="outline">{positioning} axes de positionnement</Badge>
        </div>
      </PageHero>

      <section className="bg-white py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Portefeuille thématique"
            title="Une approche intégrée, jamais isolée."
            description="Chaque domaine est présenté avec son statut réel. Les domaines de positionnement institutionnel ne revendiquent aucune intervention active à ce stade : ils sont publiés pour rendre lisible la trajectoire de l’association et préparer de futurs partenariats."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
              <AreaCard key={area.id} area={area} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-sand-300/70 bg-sand-50 py-16">
        <div className="container-site grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-sand-300 bg-white p-6">
            <span className="flex size-10 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
              <Compass aria-hidden className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-lg font-bold text-forest-950">
              Lire les statuts
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              « Documenté » signifie qu’au moins une initiative de l’association
              est présentée dans le portefeuille. « Positionnement » signifie que
              le domaine est revendiqué comme axe de travail, sans intervention
              active publiée à ce stade.
            </p>
          </div>
          <div className="rounded-2xl border border-sand-300 bg-white p-6">
            <span className="flex size-10 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
              <ShieldCheck aria-hidden className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-lg font-bold text-forest-950">
              Un principe de prudence
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Aucune activité, aucun résultat ni aucun partenaire n’est ajouté à un
              domaine sans vérification préalable. Les informations incomplètes
              restent signalées comme telles.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Approfondir"
        title="Un domaine rejoint votre expertise ou vos priorités ?"
        description="Nous sommes ouverts aux échanges avec les institutions, les organisations de la société civile, les acteurs de la recherche et les partenaires techniques qui partagent une approche respectueuse des communautés."
        primaryHref="/projets"
        primaryLabel="Voir les projets"
        secondaryHref="/contact"
        secondaryLabel="Proposer une collaboration"
      />
    </>
  );
}
