export {};

declare global {
  type FrequentItem = {
    id: number;
    name: string;
    price: number;
    saldo: number;
    image: string;
    amount: number;
    unit_name: string;
    unit_id: number;
    barcode: string;
    group_id: number;
    header: string;
    header2: string;
    is_marking: boolean;
    much_used: boolean;
    is_boolean: boolean;
    marking_code?: string[];
  };
}
