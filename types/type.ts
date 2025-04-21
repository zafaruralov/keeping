export interface Transaction {
  id: number;
  title: string;
  date: string;
  time: string;
  sum: number;
  price?: number;
  currency?: string;
  final_sum: number;
  num?: number;
  qr_code_url?: string | null;
  status: string;
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Receipt {
  storeName: string;
  storeAddress: string;
  phoneNumber: string;
  receiptNumber: string;
  date: string;
  time: string;
  cashier: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  change: number;
}

export interface ApiResponse {
  data: {
    total: number;
    producs: Item[];
  };
}

export interface Item {
  id: number;
  name: string;
  price: number;
  image: string;
  unit_name: string;
  saldo: number;
  barcode?: string;
  header?: string;
  header2?: string;
  is_marking?: boolean;
  much_used?: boolean;
  is_boolean?: boolean;
}

export interface Filter {
  name: string;
  isActive?: boolean;
  id: number;
}

export interface AllCategoryResponse {
  response: {};
  frequent: FrequentItem[];
}

interface UserExtraData {
  id: number;
  attributes: {
    user_birth_date: string;
  };
  username: string;
  area_id: number | null;
  full_name: string;
  level: number | null;
  mobile_phone: string;
  obl_id: number | null;
  org_id: number;
  org_type: number;
  post_name: string;
  tag: number;
  key1: string | null;
  key2: string | null;
  header_passport: string;
  header_fullname: string | null;
  header_shortname: string | null;
  header_pinfl: string | null;
  header_tin: string | null;
  pinfl: number;
  tin: number | null;
  registered_with_eimzo: boolean | null;
  offer: boolean;
  user_id: string;
  permissions: string[];
  staff_id: number | null;
  local_bdate: string;
  local_edate: string;
  checkout_id: number | null;
  billing_state: boolean;
  ip_addresses: string;
}

export interface User {
  username: string;
  fullName: string;
  permissions: string[];
  updateId: number;
  locale: string;
  staffId: number | null;
  pinfl: number;
  tin: number | null;
  orgId: number;
  loggingLevel: string;
  id: string;
  postName: string;
  lastActivityPage: string | null;
  lastActivityAt: string | null;
  extraData: UserExtraData;
}
export interface MutationParams {
  method?: "get" | "post" | "put" | "delete" | "patch";
  link: string;
  data?: Record<string, any> | null;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}
