import "server-only";

import type {
  ActivityLog,
  CollectionKey,
  CollectionMap,
  ContactMessage,
  NewsletterSubscriber,
  Role,
  SiteSettings,
  UserAccount,
} from "@/lib/content/types";

export type RepositoryMode = "local" | "supabase";

export interface ListOptions {
  includeUnpublished?: boolean;
  includeDeleted?: boolean;
}

export interface ContentRepository {
  readonly mode: RepositoryMode;
  readonly writable: boolean;

  getSettings(): Promise<SiteSettings>;
  updateSettings(settings: SiteSettings): Promise<void>;

  list<K extends CollectionKey>(
    key: K,
    options?: ListOptions,
  ): Promise<CollectionMap[K][]>;
  getById<K extends CollectionKey>(
    key: K,
    id: string,
    options?: ListOptions,
  ): Promise<CollectionMap[K] | null>;
  getBySlug<K extends CollectionKey>(
    key: K,
    slug: string,
    options?: ListOptions,
  ): Promise<CollectionMap[K] | null>;
  upsert<K extends CollectionKey>(
    key: K,
    item: CollectionMap[K],
  ): Promise<CollectionMap[K]>;
  remove(key: CollectionKey, id: string): Promise<void>;

  listMessages(): Promise<ContactMessage[]>;
  addMessage(message: Omit<ContactMessage, "id" | "createdAt">): Promise<void>;
  updateMessage(id: string, patch: Partial<ContactMessage>): Promise<void>;
  deleteMessage(id: string): Promise<void>;

  listSubscribers(): Promise<NewsletterSubscriber[]>;
  addSubscriber(input: {
    email: string;
    name: string;
    source: string;
    consentedAt: string;
  }): Promise<{ created: boolean }>;
  updateSubscriber(
    id: string,
    patch: Partial<NewsletterSubscriber>,
  ): Promise<void>;
  deleteSubscriber(id: string): Promise<void>;

  listUsers(): Promise<UserAccount[]>;
  updateUser(
    id: string,
    patch: Partial<Pick<UserAccount, "role" | "isActive" | "fullName">>,
  ): Promise<void>;

  logActivity(entry: Omit<ActivityLog, "id" | "createdAt">): Promise<void>;
  listActivity(limit?: number): Promise<ActivityLog[]>;
}

export const ROLE_PERMISSIONS = {
  super_admin: [
    "content:read",
    "content:write",
    "content:publish",
    "content:delete",
    "impact:write",
    "media:write",
    "communication:manage",
    "users:manage",
    "settings:manage",
    "logs:read",
  ],
  admin: [
    "content:read",
    "content:write",
    "content:publish",
    "content:delete",
    "impact:write",
    "media:write",
    "communication:manage",
    "settings:manage",
    "logs:read",
  ],
  editor: [
    "content:read",
    "content:write",
    "content:publish",
    "impact:write",
    "media:write",
    "communication:manage",
  ],
  contributor: ["content:read", "content:write"],
} as const satisfies Record<Role, readonly string[]>;

export type Permission = (typeof ROLE_PERMISSIONS)[Role][number];

export function can(role: Role, permission: Permission) {
  return (ROLE_PERMISSIONS[role] as readonly string[]).includes(permission);
}
