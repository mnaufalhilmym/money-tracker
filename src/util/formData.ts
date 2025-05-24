export default function toFormData(
  obj: object,
  files?: { key: string; file: File }[]
) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  }
  if (files) {
    for (const file of files) {
      formData.append(file.key, file.file);
    }
  }
  return formData;
}
