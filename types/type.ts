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
