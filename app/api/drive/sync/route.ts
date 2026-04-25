import { readDriveProgress, writeDriveProgress } from "@/lib/drive";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session?.accessToken) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const progress = await readDriveProgress(session.accessToken);
  return Response.json({
    synced: !!progress,
    updatedAt: progress?.updatedAt ?? null,
  });
}

export async function PUT() {
  const session = await getSession();
  if (!session?.accessToken) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const progress = await readDriveProgress(session.accessToken);
  return Response.json({
    ok: true,
    progress: progress?.gameState ?? null,
    updatedAt: progress?.updatedAt ?? null,
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.accessToken) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = (await req.json()) as { gameState?: string };
  if (!body.gameState) return Response.json({ error: "Missing gameState" }, { status: 400 });

  const payload = {
    gameState: body.gameState,
    updatedAt: new Date().toISOString(),
  };

  await writeDriveProgress(session.accessToken, payload);
  return Response.json({ ok: true, updatedAt: payload.updatedAt });
}
