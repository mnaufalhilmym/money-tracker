import { selectCategory } from "../../category/_util/dbSelectCategory";
import { selectWallet } from "../../wallet/_util/dbSelectWallet";

export async function validateWalletId(userId: string, walletId?: string) {
  if (!walletId) throw new Error("wallet_id is required");

  if (!(await selectWallet(walletId, userId)).rowCount)
    throw new Error("invalid wallet_id");
}

export async function validateCategoryId(userId: string, categoryId?: string) {
  if (!categoryId) throw new Error("category_id is required");

  if (!(await selectCategory(categoryId, userId)).rowCount)
    throw new Error("invalid category_id");
}
