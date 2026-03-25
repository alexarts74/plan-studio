const BLOB_BASE = "https://bvo9cxhu4qde9fk6.public.blob.vercel-storage.com";

export function getBlobUrl(localPath: string): string {
  return `${BLOB_BASE}${localPath}`;
}
