import { test, mock } from "node:test";
import assert from "node:assert/strict";

// src/utils/prisma.ts reuses globalThis.prisma outside production,
// so a fake client here replaces the real one for these tests.
(globalThis as any).prisma = {
  user: { count: () => ({}) },
  $queryRaw: () => ({}),
  $transaction: async () => {
    throw new Error("Can't reach database server");
  },
};

function fakeContext(params = {}) {
  return { params, res: { statusCode: 200 } } as any;
}

test("/stats returns 503 instead of redirecting when the DB is down", async () => {
  const logged = mock.method(console, "error", () => {});
  const { getServerSideProps } = await import("../src/pages/stats/index");
  const ctx = fakeContext();
  const result = await getServerSideProps(ctx);

  assert.equal(ctx.res.statusCode, 503);
  assert.deepEqual(result, { props: { unavailable: true } });
  assert.equal(logged.mock.callCount(), 1);
  logged.mock.restore();
});


test("/stats/[userId] returns 503 instead of redirecting when the DB is down", async () => {
  const logged = mock.method(console, "error", () => {});
  const { getServerSideProps } = await import("../src/pages/stats/[userId]");
  const ctx = fakeContext({ userId: "123" });
  const result = await getServerSideProps(ctx);

  assert.equal(ctx.res.statusCode, 503);
  assert.deepEqual(result, { props: { unavailable: true } });
  assert.equal(logged.mock.callCount(), 1);
  logged.mock.restore();  
});