interface HistoryI {
  id?: string;
  description?: string;
  type_id?: number;
  type_name?: string;
  wallet_id?: number;
  wallet_name?: string;
  category_id?: number;
  category_name?: string;
  datetime?: string;
  amount?: number;
  image_ids?: string[];
  location?: { lat: number; lng: number };
  location_name?: string;
  location_display_name?: string;
}
