import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { createSeedDatabase, type SeedDatabase } from "@/content";
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
  collectionMeta,
  isPublicItem,
  sortItems,
} from "./registry";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "content.json");

export class LocalWriteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalWriteError";
  }
}

function localAdminUser(): UserAccount | null {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (!email) return null;
  return {
    id: "local-admin",
    email,
    fullName: "Administrateur local",
    role: "super_admin",
    isActive: true,
    createdAt: "2026-11-17T00:00:00.000Z",
    lastSeenAt: "",
  };
}

export class LocalContentRepository implements ContentRepository {
  readonly mode = "local" as const;
  private writableState = true;
  private loaded: Promise<SeedDatabase> | null = null;
  private writeQueue: Promise<void> = Promise.resolve();

  get writable() {
    return this.writableState;
  }

  private async load(): Promise<SeedDatabase> {
    await fs.mkdir(DATA_DIR, { recursive: true }).catch(() => undefined);
    try {
      const raw = await fs.readFile(DATA_FILE, "utf8");
      const parsed = JSON.parse(raw) as SeedDatabase;
      if (!parsed.collections || !parsed.settings) {
        throw new Error("Structure de données locale invalide.");
      }
      return parsed;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== "ENOENT") throw error;
      const seed = createSeedDatabase();
      try {
        await this.persist(seed);
        this.writableState = true;
      } catch {
        this.writableState = false;
      }
      return seed;
    }
  }

  private async ensureLoaded() {
    if (!this.loaded) this.loaded = this.load();
    return this.loaded;
  }

  private async persist(db: SeedDatabase) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = `${DATA_FILE}.${randomUUID()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
    await fs.rename(tmp, DATA_FILE);
  }

  private async mutate<T>(mutator: (db: SeedDatabase) => T): Promise<T> {
    if (!this.writableState) {
      throw new LocalWriteError(
        "Le stockage local est en lecture seule sur cet environnement. Configurez Supabase pour activer la gestion de contenu.",
      );
    }
    const run = async () => {
      const db = await this.ensureLoaded();
      const result = mutator(db);
      await this.persist(db);
      return result;
    };
    const next = this.writeQueue.then(run, run);
    this.writeQueue = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }

  async getSettings(): Promise<SiteSettings> {
    const db = await this.ensureLoaded();
    return db.settings;
  }

  async updateSettings(settings: SiteSettings): Promise<void> {
    await this.mutate((db) => {
      db.settings = { ...settings, updatedAt: new Date().toISOString() };
    });
  }

  async list<K extends CollectionKey>(
    key: K,
    options: ListOptions = {},
  ): Promise<CollectionMap[K][]> {
    const db = await this.ensureLoaded();
    const items = (db.collections[key] || []) as CollectionMap[K][];
    return sortItems(
      key,
      items.filter((item) => {
        if (!options.includeDeleted && (item as { deletedAt?: string | null }).deletedAt) {
          return false;
        }
        if (!options.includeUnpublished && !isPublicItem(key, item)) {
          return false;
        }
        return true;
      }),
    );
  }

  async getById<K extends CollectionKey>(
    key: K,
    id: string,
    options: ListOptions = {},
  ): Promise<CollectionMap[K] | null> {
    const items = await this.list(key, { ...options, includeUnpublished: true });
    const found = items.find((item) => item.id === id) || null;
    if (!found) return null;
    if (!options.includeUnpublished && !isPublicItem(key, found)) return null;
    return found;
  }

  async getBySlug<K extends CollectionKey>(
    key: K,
    slug: string,
    options: ListOptions = {},
  ): Promise<CollectionMap[K] | null> {
    const items = await this.list(key, { ...options, includeUnpublished: true });
    const record = items.find(
      (item) => (item as { slug?: string }).slug === slug,
    ) as CollectionMap[K] | undefined;
    if (!record) return null;
    if (!options.includeUnpublished && !isPublicItem(key, record)) return null;
    return record;
  }

  async upsert<K extends CollectionKey>(
    key: K,
    item: CollectionMap[K],
  ): Promise<CollectionMap[K]> {
    return this.mutate((db) => {
      const list = db.collections[key] as CollectionMap[K][];
      const now = new Date().toISOString();
      const index = item.id
        ? list.findIndex((entry) => entry.id === item.id)
        : -1;
      const slug = (item as { slug?: string }).slug;
      if (collectionMeta[key].slugField && slug) {
        const duplicate = list.find(
          (entry) =>
            entry !== list[index] &&
            (entry as { slug?: string }).slug === slug &&
            !(entry as { deletedAt?: string | null }).deletedAt,
        );
        if (duplicate) {
          throw new LocalWriteError(
            "Une entrée utilise déjà cette adresse (slug). Choisissez une adresse différente.",
          );
        }
      }
      if (index >= 0) {
        const existing = list[index] as CollectionMap[K] & {
          createdAt?: string;
        };
        const merged = {
          ...existing,
          ...item,
          id: existing.id,
          createdAt: existing.createdAt || now,
          updatedAt: now,
        } as CollectionMap[K];
        list[index] = merged;
        return merged;
      }
      const created = {
        ...item,
        id: item.id || randomUUID(),
        createdAt: now,
        updatedAt: now,
      } as CollectionMap[K];
      list.push(created);
      return created;
    });
  }

  async remove(key: CollectionKey, id: string): Promise<void> {
    await this.mutate((db) => {
      const list = db.collections[key] as Array<{
        id: string;
        deletedAt?: string | null;
      }>;
      if (key === "media") {
        const index = list.findIndex((entry) => entry.id === id);
        if (index >= 0) list.splice(index, 1);
        return;
      }
      const entry = list.find((item) => item.id === id);
      if (entry) entry.deletedAt = new Date().toISOString();
    });
  }

  async listMessages(): Promise<ContactMessage[]> {
    const db = await this.ensureLoaded();
    return [...db.messages].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  async addMessage(
    message: Omit<ContactMessage, "id" | "createdAt">,
  ): Promise<void> {
    await this.mutate((db) => {
      db.messages.unshift({
        ...message,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      });
    });
  }

  async updateMessage(id: string, patch: Partial<ContactMessage>): Promise<void> {
    await this.mutate((db) => {
      const index = db.messages.findIndex((message) => message.id === id);
      if (index >= 0) {
        db.messages[index] = {
          ...db.messages[index],
          ...patch,
          id,
        };
      }
    });
  }

  async deleteMessage(id: string): Promise<void> {
    await this.mutate((db) => {
      db.messages = db.messages.filter((message) => message.id !== id);
    });
  }

  async listSubscribers(): Promise<NewsletterSubscriber[]> {
    const db = await this.ensureLoaded();
    return [...db.subscribers].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  async addSubscriber(input: {
    email: string;
    name: string;
    source: string;
    consentedAt: string;
  }): Promise<{ created: boolean }> {
    const email = input.email.trim().toLowerCase();
    return this.mutate((db) => {
      const existing = db.subscribers.find((entry) => entry.email === email);
      if (existing) {
        if (existing.status === "unsubscribed") {
          existing.status = "confirmed";
          existing.consentedAt = input.consentedAt;
          existing.source = input.source;
        }
        return { created: false };
      }
      db.subscribers.unshift({
        id: randomUUID(),
        email,
        name: input.name,
        status: "confirmed",
        source: input.source,
        consentedAt: input.consentedAt,
        createdAt: new Date().toISOString(),
      });
      return { created: true };
    });
  }

  async updateSubscriber(
    id: string,
    patch: Partial<NewsletterSubscriber>,
  ): Promise<void> {
    await this.mutate((db) => {
      const index = db.subscribers.findIndex((entry) => entry.id === id);
      if (index >= 0) {
        db.subscribers[index] = { ...db.subscribers[index], ...patch, id };
      }
    });
  }

  async deleteSubscriber(id: string): Promise<void> {
    await this.mutate((db) => {
      db.subscribers = db.subscribers.filter((entry) => entry.id !== id);
    });
  }

  async listUsers(): Promise<UserAccount[]> {
    const admin = localAdminUser();
    return admin ? [admin] : [];
  }

  async updateUser(): Promise<void> {
    throw new LocalWriteError(
      "La gestion des comptes utilisateurs nécessite Supabase Auth et la clé de service.",
    );
  }

  async logActivity(
    entry: Omit<ActivityLog, "id" | "createdAt">,
  ): Promise<void> {
    await this.mutate((db) => {
      db.activity.unshift({
        ...entry,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      });
      db.activity = db.activity.slice(0, 500);
    });
  }

  async listActivity(limit = 50): Promise<ActivityLog[]> {
    const db = await this.ensureLoaded();
    return db.activity.slice(0, limit);
  }
}
