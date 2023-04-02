interface User {
  username: string;
}

declare type UserInfo = User | "";

import type { ContentInstance } from "@nuxt/content/types/content";

import type { NuxtConfig } from "@nuxt/types";

declare module "nuxt3" {
  export interface NuxtConfig extends NuxtConfig {}
}
