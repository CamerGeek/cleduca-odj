import "server-only";

import type { ContentRepository } from "./repository";
import { LocalContentRepository } from "./local";
import { SupabaseContentRepository } from "./supabase";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
  hasServiceRole,
  hasSupabaseConfig,
} from "@/lib/supabase/server";

const localRepository = new LocalContentRepository();

// L’administration utilise une session applicative (cookie signé), pas un JWT
// Supabase : les écritures passent donc par la clé de service, réservée au
// serveur. Sans cette clé, le site fonctionne en lecture seule via la clé
// anonyme et les policies de lecture publique.
export async function getRepository(): Promise<ContentRepository> {
  if (hasSupabaseConfig()) {
    if (!hasServiceRole()) {
      console.warn(
        "Supabase est configuré sans SUPABASE_SERVICE_ROLE_KEY : les écritures du CMS seront refusées par RLS.",
      );
    }
    const client = hasServiceRole()
      ? createSupabaseAdminClient()
      : await createSupabaseServerClient();
    return new SupabaseContentRepository(client);
  }
  return localRepository;
}

export { LocalWriteError } from "./local";
