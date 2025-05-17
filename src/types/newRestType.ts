/**
 * TIPI PRINCIPALI PER LE OPERAZIONI DI BASE
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status?: number;
}

/**
 * TIPI PER I LINK E LE RISORSE
 */

export interface Link {
  id: string;
  title: string;
  url: string;
  description: string | null;
  created_at: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
}

export interface LinkFormData {
  title: string;
  url: string;
  description: string;
  context_id: string;
  resource_id: string;
  function_id: string;
}

export interface CollectionFormData {
  name: string;
  description: string;
  is_public: boolean;
}

/**
 * TIPI PER LE LISTE
 */

export interface UserList {
  id: number;
  name: string;
  description: string | null;
  public: boolean;
  created_at: string;
  modified_at: string;
}

export interface ListItem {
  id: number;
  id_list: number;
  id_src: number;
}

export interface CreateListData {
  name: string;
  description: string;
  public: boolean;
}

export interface UpdateListData {
  name?: string;
  description?: string;
  public?: boolean;
}

export interface AddItemData {
  id_list: number;
  id_src: number;
}

/**
 * TIPI PER LE CLASSIFICAZIONI
 */

export interface ResourceType {
  resource_id: number;
  name: string;
  description: string;
}

export interface FunctionType {
  function_id: number;
  name: string;
  description: string;
}

export interface ContextType {
  context_id: number;
  name: string;
  description: string;
}

/**
 * TIPI PER LE OPERAZIONI DI TABELLA
 */

export interface MainTableData {
  id?: string | number;
  description?: string;
  icon?: string;
  image?: string;
  logo?: string;
  name: string;
  title?: string;
  url: string;
}

export interface SubMainTableData {
  id_src: string | number;
  user_id: string;
  accessible: boolean;
  domain_exists: boolean;
  html_content_exists: boolean;
  is_public: boolean;
  secure: boolean;
  status_code?: number;
  type?: string;
  valid_url: boolean;
  AI?: boolean;
}

export interface CategoriesTagsData {
  id_src: string | number;
  id_area: number;
  id_cat: number;
  tag_3: string | number;
  tag_4: string | number;
  tag_5: string | number;
  id_provider?: number;
  ratings?: any;
  AI_think?: string;
  AI_Summary?: string;
}

export interface CreateLinkRequest {
  // Main Table Fields
  description?: string;
  icon?: string;
  image?: string;
  logo?: string;
  name: string;
  title?: string;
  url: string;
  
  // Sub Main Table Fields
  user_id: string;
  accessible?: boolean;
  domain_exists?: boolean;
  html_content_exists?: boolean;
  is_public?: boolean;
  secure?: boolean;
  status_code?: number;
  type?: string;
  valid_url?: boolean;
  AI?: boolean;
  
  // Categories Tag Fields
  id_area?: number;
  id_cat?: number;
  id_provider?: number;
  ratings?: any;
  tag_3?: string | number;
  tag_4?: string | number;
  tag_5?: string | number;
  AI_think?: string;
  AI_Summary?: string;
  
  // Common Fields
  id_src?: string | number;
}
