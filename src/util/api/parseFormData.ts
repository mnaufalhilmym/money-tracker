"use server";

import formidable from "formidable";
import { NextRequest } from "next/server";
import os from "os";
import { Readable } from "stream";

export default async function parseFormData(request: NextRequest) {
  const form = formidable({
    multiples: true,
    uploadDir: os.tmpdir(),
    keepExtensions: true,
    filter: ({ mimetype }) => mimetype?.startsWith("image/") ?? false,
  });

  const stream = Readable.fromWeb(request.body as any);

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(stream as any, (err, fields, files) => {
        if (err) reject(new Error(err));
        else resolve({ fields, files });
      });
    }
  );
}
