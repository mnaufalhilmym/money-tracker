import { PoolClient } from "pg";

export async function insertHistoryImagesTx(
  client: PoolClient,
  historyId: number,
  savedImages: SavedImage[]
) {
  if (!savedImages.length) return;

  let insertHistoryImagesSql =
    "INSERT INTO history_images" + " (history_id, image_id)" + " VALUES";
  const insertHistoryImagesParams = [];
  for (const [idx, savedImage] of savedImages.entries()) {
    if (idx > 0) {
      insertHistoryImagesSql += ",";
    }
    insertHistoryImagesParams.push(historyId, savedImage.id);
    insertHistoryImagesSql +=
      " (" + `$${idx * 2 + 1},` + `$${idx * 2 + 2}` + ")";
  }
  await client.query(insertHistoryImagesSql, insertHistoryImagesParams);
}
