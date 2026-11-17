import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { seedSettings } from "@/config/site";
import type {
  ActivityLog,
  CollectionKey,
  CollectionMap,
  ContactMessage,
  NewsletterSubscriber,
  SiteSettings,
  UserAccount,
} from "@/lib/content/types";
import type { ContentRepository, ListOptions } from "./repository";
import {
  collectionHasAudit,
  collectionMeta,
  isPublicItem,
  sortItems,
} from "./registry";

function camelToSnake(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function snakeToCamel(value: string) {
  return value.replace(/_([a-z0-9])/g, (_, letter: string) =>
    letter.toUpperCase(),
  );
}

function mapKeys<T>(value: unknown, mapper: (key: string) => string): T {
  if (Array.isArray(value)) {
    return value.map((entry) => mapKeys(entry, mapper)) as T;
  }
  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        mapper(key),
        mapKeys(entry, mapper),
      ]),
    ) as T;
  }
  return value as T;
}

function toRow(value: unknown) {
  return mapKeys<Record<string, unknown>>(value, camelToSnake);
}

function fromRow<T>(value: unknown): T {
  return mapKeys<T>(value, snakeToCamel);
}

export class SupabaseContentRepository implements ContentRepository {
  readonly mode = "supabase" as const;
  readonly writable = true;

  constructor(private readonly client: SupabaseClient) {}

  async getSettings(): Promise<SiteSettings> {
    const { data, error } = await this.client
      .from("site_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();
    if (error) {
      console.error("Unable to read site settings:", error.message);
      return seedSettings;
    }
    return (data?.data as SiteSettings | undefined) ?? seedSettings;
  }

  async updateSettings(settings: SiteSettings): Promise<void> {
    const { error } = await this.client.from("site_settings").upsert({
      id: 1,
      data: { ...settings, updatedAt: new Date().toISOString() },
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(`Impossible d’enregistrer les paramètres : ${error.message}`);
  }

  async list<K extends CollectionKey>(
    key: K,
    options: ListOptions = {},
  ): Promise<CollectionMap[K][]> {
    const meta = collectionMeta[key];
    if (meta.adminOnly && !options.includeUnpublished) return [];
    let query = this.client.from(meta.table).select("*").limit(1000);
    if (!options.includeDeleted && collectionHasAudit(key)) {
      query = query.is("deleted_at", null);
    }
    if (!options.includeUnpublished) {
      if (meta.statusColumn === "content_status") {
        query = query.eq("content_status", "published");
      } else if (meta.statusColumn === "status") {
        query = query.eq("status", "published");
      } else if (meta.statusColumn === "published") {
        query = query.eq("published", true);
      }
    }
    const { data, error } = await query;
    if (error) {
      throw new Error(`Lecture ${meta.label} impossible : ${error.message}`);
    }
    const items = (data || []).map((row) => fromRow<CollectionMap[K]>(row));
    return sortItems(key, items);
  }

  async getById<K extends CollectionKey>(
    key: K,
    id: string,
    options: ListOptions = {},
  ): Promise<CollectionMap[K] | null> {
    const meta = collectionMeta[key];
    let query = this.client.from(meta.table).select("*").eq("id", id);
    if (!options.includeDeleted && collectionHasAudit(key)) {
      query = query.is("deleted_at", null);
    }
    const { data, error } = await query.maybeSingle();
    if (error) throw new Error(`Lecture ${meta.singular} impossible : ${error.message}`);
    if (!data) return null;
    const item = fromRow<CollectionMap[K]>(data);
    if (!options.includeUnpublished && !isPublicItem(key, item)) return null;
    return item;
  }

  async getBySlug<K extends CollectionKey>(
    key: K,
    slug: string,
    options: ListOptions = {},
  ): Promise<CollectionMap[K] | null> {
    const meta = collectionMeta[key];
    if (!meta.slugField) return null;
    let query = this.client.from(meta.table).select("*").eq("slug", slug);
    if (!options.includeDeleted && collectionHasAudit(key)) {
      query = query.is("deleted_at", null);
    }
    const { data, error } = await query.maybeSingle();
    if (error) throw new Error(`Lecture ${meta.singular} impossible : ${error.message}`);
    if (!data) return null;
    const item = fromRow<CollectionMap[K]>(data);
    if (!options.includeUnpublished && !isPublicItem(key, item)) return null;
    return item;
  }

  async upsert<K extends CollectionKey>(
    key: K,
    item: CollectionMap[K],
  ): Promise<CollectionMap[K]> {
    const meta = collectionMeta[key];
    const now = new Date().toISOString();
    const row = toRow(item);
    delete row.deleted_at;
    if (collectionHasAudit(key)) {
      row.updated_at = now;
    }
    if (item.id) {
      delete row.created_at;
      const { data, error } = await this.client
        .from(meta.table)
        .update(row)
        .eq("id", item.id)
        .select("*")
        .single();
      if (error) throw new Error(`Enregistrement ${meta.singular} impossible : ${error.message}`);
      return fromRow<CollectionMap[K]>(data);
    }
    delete row.id;
    row.created_at = now;
    const { data, error } = await this.client
      .from(meta.table)
      .insert(row)
      .select("*")
      .single();
    if (error) throw new Error(`Création ${meta.singular} impossible : ${error.message}`);
    return fromRow<CollectionMap[K]>(data);
  }

  async remove(key: CollectionKey, id: string): Promise<void> {
    const meta = collectionMeta[key];
    if (key === "media") {
      const { error } = await this.client.from(meta.table).delete().eq("id", id);
      if (error) throw new Error(`Suppression impossible : ${error.message}`);
      return;
    }
    const { error } = await this.client
      .from(meta.table)
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw new Error(`Suppression impossible : ${error.message}`);
  }

  async listMessages(): Promise<ContactMessage[]> {
    const { data, error } = await this.client
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(`Lecture des messages impossible : ${error.message}`);
    return (data || []).map((row) => fromRow<ContactMessage>(row));
  }

  async addMessage(
    message: Omit<ContactMessage, "id" | "createdAt">,
  ): Promise<void> {
    const { error } = await this.client
      .from("contact_messages")
      .insert(toRow(message));
    if (error) throw new Error(`Envoi du message impossible : ${error.message}`);
  }

  async updateMessage(id: string, patch: Partial<ContactMessage>): Promise<void> {
    const { error } = await this.client
      .from("contact_messages")
      .update(toRow(patch))
      .eq("id", id);
    if (error) throw new Error(`Mise à jour du message impossible : ${error.message}`);
  }

  async deleteMessage(id: string): Promise<void> {
    const { error } = await this.client
      .from("contact_messages")
      .delete()
      .eq("id", id);
    if (error) throw new Error(`Suppression du message impossible : ${error.message}`);
  }

  async listSubscribers(): Promise<NewsletterSubscriber[]> {
    const { data, error } = await this.client
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) throw new Error(`Lecture des abonnés impossible : ${error.message}`);
    return (data || []).map((row) => fromRow<NewsletterSubscriber>(row));
  }

  async addSubscriber(input: {
    email: string;
    name: string;
    source: string;
    consentedAt: string;
  }): Promise<{ created: boolean }> {
    const email = input.email.trim().toLowerCase();
    const { data, error } = await this.client
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", email)
      .maybeSingle();
    if (error) throw new Error(`Inscription impossible : ${error.message}`);
    if (data) {
      if (data.status === "unsubscribed") {
        const { error: updateError } = await this.client
          .from("newsletter_subscribers")
          .update({
            status: "confirmed",
            consented_at: input.consentedAt,
            source: input.source,
          })
          .eq("id", data.id);
        if (updateError) throw new Error(`Inscription impossible : ${updateError.message}`);
      }
      return { created: false };
    }
    const { error: insertError } = await this.client
      .from("newsletter_subscribers")
      .insert({
        email,
        name: input.name,
        status: "confirmed",
        source: input.source,
        consented_at: input.consentedAt,
      });
    if (insertError) throw new Error(`Inscription impossible : ${insertError.message}`);
    return { created: true };
  }

  async updateSubscriber(
    id: string,
    patch: Partial<NewsletterSubscriber>,
  ): Promise<void> {
    const { error } = await this.client
      .from("newsletter_subscribers")
      .update(toRow(patch))
      .eq("id", id);
    if (error) throw new Error(`Mise à jour impossible : ${error.message}`);
  }

  async deleteSubscriber(id: string): Promise<void> {
    const { error } = await this.client
      .from("newsletter_subscribers")
      .delete()
      .eq("id", id);
    if (error) throw new Error(`Suppression impossible : ${error.message}`);
  }

  async listUsers(): Promise<UserAccount[]> {
    const { data, error } = await this.client
      .from("users")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw new Error(`Lecture des utilisateurs impossible : ${error.message}`);
    return (data || []).map((row) => fromRow<UserAccount>(row));
  }

  async updateUser(
    id: string,
    patch: Partial<Pick<UserAccount, "role" | "isActive" | "fullName">>,
  ): Promise<void> {
    const { error } = await this.client
      .from("users")
      .update(toRow(patch))
      .eq("id", id);
    if (error) throw new Error(`Mise à jour de l’utilisateur impossible : ${error.message}`);
  }

  async logActivity(
    entry: Omit<ActivityLog, "id" | "createdAt">,
  ): Promise<void> {
    const { error } = await this.client
      .from("activity_logs")
      .insert(toRow(entry));
    if (error) {
      console.error("Activity log failed:", error.message);
    }
  }

  async listActivity(limit = 50): Promise<ActivityLog[]> {
    const { data, error } = await this.client
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(`Lecture du journal impossible : ${error.message}`);
    return (data || []).map((row) => fromRow<ActivityLog>(row));
  }
}
