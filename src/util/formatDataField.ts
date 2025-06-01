export default function formatDataField(value: any) {
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
          const val: any = formatDataField(v);
          formatted.push(val);
        }
        return formatted;
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      return JSON.stringify(value);
    case "undefined":
      return undefined;
  }
}
