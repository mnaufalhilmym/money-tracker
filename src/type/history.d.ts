interface HistoryI {
  id?: string;
  title?: string;
  wallet_id?: string;
  category_id?: string;
  datetime?: string;
  amount?: number;
  image_ids?: string[];
  location?: { lat: number; lng: number };
  location_name?: string;
  location_display_name?: string;
}
