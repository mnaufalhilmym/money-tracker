export default function toFormData(
  obj: object,
  files?: { key: string; file: File }[]
) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      const formattedValue = formatValue(value);
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
      if (Array.isArray(value)) {
        const formatted = [];
        for (const v of value) {
          const val: any = formatValue(v);
          formatted.push(val);
        }
        return formatted;
      }
      return JSON.stringify(value);
    case "undefined":
      return undefined;
  }
}
