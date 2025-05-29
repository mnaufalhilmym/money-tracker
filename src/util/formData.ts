export default function toFormData(
  obj: object,
  files?: { key: string; file: File }[]
) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      const formattedValue = formatValue(value);
      if (formattedValue) {
        formData.append(key, formattedValue);
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

function formatValue(value: any) {
  switch (typeof value) {
    case "bigint":
    case "function":
    case "symbol":
      return value.toString();
    case "boolean":
    case "number":
    case "string":
      return value;
    case "object":
      return JSON.stringify(value);
    case "undefined":
      return undefined;
  }
}
