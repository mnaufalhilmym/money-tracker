import formatDataField from "./formatDataField";

export default function toFormData(
  obj: object,
  files?: { key: string; file: File }[]
) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      const formattedValue = formatDataField(value);
      if (formattedValue) {
        if (Array.isArray(formattedValue)) {
          for (const value of formattedValue) {
            formData.append(key, value);
          }
        } else {
          formData.append(key, formattedValue);
        }
      }
    }
  }
  if (files) {
    for (const file of files) {
      formData.append(file.key, file.file);
    }
  }
  return formData;
}
