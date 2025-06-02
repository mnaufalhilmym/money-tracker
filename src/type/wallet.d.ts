interface WalletI {
  id?: number;
  user_id?: string;
  name?: string;
  type_id?: number;
  deleted_at?: string;

  type_name?: string;
  amount?: number;
  amount_percentage?: number;
  amount_average_per_day?: number;
}
