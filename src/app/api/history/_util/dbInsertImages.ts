import { PoolClient } from "pg";

export async function insertImagesTx(
  client: PoolClient,
  savedImages: SavedImage[],
  userId: string
) {
  if (!savedImages.length) return;

  let insertImagesSql =
    "INSERT INTO images" +
    " (id, user_id, file_name, content_type, size, driver, path)" +
    " VALUES";
  const insertImagesParams = [];
  for (const [idx, savedImage] of savedImages.entries()) {
    if (idx > 0) {
      insertImagesSql += ",";
    }
    insertImagesParams.push(
      savedImage.id,
      userId,
      savedImage.fileName,
      savedImage.contentType,
      savedImage.size,
      "LOCAL",
      savedImage.path
    );
    insertImagesSql +=
      " (" +
      `$${idx * 7 + 1},` +
      `$${idx * 7 + 2},` +
      `$${idx * 7 + 3},` +
      `$${idx * 7 + 4},` +
      `$${idx * 7 + 5},` +
      `$${idx * 7 + 6},` +
      `$${idx * 7 + 7}` +
      ")";
  }

  await client.query(insertImagesSql, insertImagesParams);
}
