import { PoolClient } from "pg";

export async function insertImagesTx(
  client: PoolClient,
  savedImages: SavedImage[]
) {
  let insertImagesSql =
    "INSERT INTO images" +
    " (id, file_name, content_type, size, driver, path)" +
    " VALUES";
  const insertImagesParams = [];
  for (const [idx, savedImage] of savedImages.entries()) {
    if (idx > 0) {
      insertImagesSql += ",";
    }
    insertImagesParams.push(
      savedImage.id,
      savedImage.fileName,
      savedImage.contentType,
      savedImage.size,
      "LOCAL",
      savedImage.path
    );
    insertImagesSql +=
      " (" +
      `$${idx * 6 + 1},` +
      `$${idx * 6 + 2},` +
      `$${idx * 6 + 3},` +
      `$${idx * 6 + 4},` +
      `$${idx * 6 + 5},` +
      `$${idx * 6 + 6}` +
      ")";
  }
  await client.query(insertImagesSql, insertImagesParams);
}
