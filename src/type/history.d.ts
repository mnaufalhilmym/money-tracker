interface HistoryI {
  id?: string;
  title?: string;
  category_id?: string;
  datetime?: string;
  amount?: number;
  image_ids?: string[];
  location?: { lat: number; lon: number };
}
