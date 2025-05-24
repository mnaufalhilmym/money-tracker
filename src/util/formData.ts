export default function toFormData(obj: object) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  }
}
