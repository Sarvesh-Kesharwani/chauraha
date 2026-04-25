const DRIVE_API = "https://www.googleapis.com/drive/v3";
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";
const FILE_NAME = "chowkcraft-progress.json";
const SPACE = "appDataFolder";

export type DriveProgressData = {
  gameState: string;
  updatedAt: string;
};

function escapeDriveQueryValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

async function findFile(accessToken: string, name = FILE_NAME): Promise<string | null> {
  const qs = new URLSearchParams({
    spaces: SPACE,
    fields: "files(id)",
    q: `name='${escapeDriveQueryValue(name)}' and '${SPACE}' in parents`,
  });
  const res = await fetch(`${DRIVE_API}/files?${qs}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.files?.[0]?.id ?? null;
}

async function readFileJson<T>(accessToken: string, fileId: string): Promise<T | null> {
  const res = await fetch(`${DRIVE_API}/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  return res.json() as Promise<T>;
}

async function uploadJsonFile(
  accessToken: string,
  name: string,
  body: string,
  options?: { fileId?: string },
) {
  if (options?.fileId) {
    await fetch(`${UPLOAD_API}/files/${options.fileId}?uploadType=media`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body,
    });
    return;
  }

  const metadata = JSON.stringify({ name, parents: [SPACE] });
  const boundary = "chowkcraft_boundary";
  const multipart = [
    `--${boundary}`,
    "Content-Type: application/json; charset=UTF-8",
    "",
    metadata,
    `--${boundary}`,
    "Content-Type: application/json",
    "",
    body,
    `--${boundary}--`,
  ].join("\r\n");

  await fetch(`${UPLOAD_API}/files?uploadType=multipart`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body: multipart,
  });
}

export async function readDriveProgress(accessToken: string): Promise<DriveProgressData | null> {
  const fileId = await findFile(accessToken);
  if (!fileId) return null;
  return readFileJson<DriveProgressData>(accessToken, fileId);
}

export async function writeDriveProgress(accessToken: string, progress: DriveProgressData) {
  const fileId = await findFile(accessToken);
  await uploadJsonFile(accessToken, FILE_NAME, JSON.stringify(progress), { fileId: fileId ?? undefined });
}
