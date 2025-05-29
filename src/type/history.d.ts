interface HistoryI {
  id?: string;
  description?: string;
  type_id?: number;
  type_name?: string;
  wallet_id?: number;
  wallet_name?: string;
  category_id?: number;
  category_name?: string;
  category_color?: string;
  datetime?: string;
  amount?: number;
  image_ids?: string[];
  location?: HistoryLocationI;
  location_name?: string;
  location_display_name?: string;
}

interface HistoryLocationI {
  lat: number;
  lng: number;
}
