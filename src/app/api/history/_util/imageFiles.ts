import { fileTypeFromFile } from "file-type";
import formidable from "formidable";
import path from "path";
import { uuidv7 } from "uuidv7";
import fs from "fs/promises";
import { PathLike } from "fs";

interface SavedImage {
  id: string;
  fileName: string;
  contentType: string;
  size: number;
  path: string;
}

export async function saveImages(
  uploadedImages: formidable.File[],
  userId: string
): Promise<SavedImage[]> {
  const savedImages = [];
  for (const [idx, image] of uploadedImages.entries()) {
    if (!image) continue;

    const imageId = uuidv7();

    const typeInfo = await fileTypeFromFile(image.filepath);

    const imageName =
      image.originalFilename ??
      `image_${userId}_${Date.now()}_${idx}${
        typeInfo?.ext ? `.${typeInfo.ext}` : ""
      }`;

    const imagePrefixPath = path.join(process.cwd(), "uploaded-images");
    await fs.mkdir(imagePrefixPath, { recursive: true });
    const imagePath = path.join(imagePrefixPath, imageId);

    await fs.rename(image.filepath, imagePath);

    savedImages.push({
      id: uuidv7(),
      fileName: imageName,
      contentType:
        typeInfo?.mime ?? image.mimetype ?? "application/octet-stream",
      size: image.size,
      path: imagePath,
    });
  }
  return savedImages;
}

export async function deleteImages(savedImagePaths: PathLike[]) {
  for (const path of savedImagePaths) {
    await fs.unlink(path);
  }
}
