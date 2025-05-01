interface HistoryI {
  id?: string;
  category_id?: string;
  datetime?: string;
  amount?: number;
  description?: string;
  image_ids?: string[];
  location?: { lat: number; lon: number };
}
