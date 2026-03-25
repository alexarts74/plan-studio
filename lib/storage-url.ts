const STORAGE_BASE =
  "https://xmiccakodjbcnyfmczpj.supabase.co/storage/v1/object/public/media";

export function getStorageUrl(localPath: string): string {
  return `${STORAGE_BASE}${localPath}`;
}
