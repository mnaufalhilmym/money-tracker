interface ImageI {
  id?: string;
  user_id?: string;
  file_name?: string;
  content_type?: string;
  size?: number;
  driver?: string;
  path?: string;
}

interface SavedImage {
  id: string;
  fileName: string;
  contentType: string;
  size: number;
  path: string;
}
