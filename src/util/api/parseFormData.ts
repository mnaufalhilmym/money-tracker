"use server";

import formidable from "formidable";
import { IncomingMessage } from "http";
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

  const stream = Readable.fromWeb(
    request.body as any
  ) as unknown as IncomingMessage;
  stream.headers = Object.fromEntries(request.headers.entries());

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(stream, (error, fields, files) => {
        if (error) {
          reject(error as Error);
        } else {
          resolve({ fields, files });
        }
      });
    }
  );
}
