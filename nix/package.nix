{ pkgs ? import <nixpkgs> {} }:

let
  # Prisma engines must match @prisma/client / prisma from pnpm-lock.yaml exactly.
  # Both are pinned to 6.19.3, which is what prisma-engines_6 ships in nixos-26.05.
  prisma-engines = pkgs.prisma-engines_6;

  pnpmDeps = pkgs.fetchPnpmDeps {
    pname = "minecraftle";
    version = "0.1.0";
    src = ../.;
    fetcherVersion = 3;
    # Re-derive whenever pnpm-lock.yaml changes: set to pkgs.lib.fakeHash,
    # run `nix build`, and paste the hash from the error.
    hash = "sha256-jsZvykQYkC4IY1jjXQxZuLpbijnMNiJ3TBQuc1WBXQM=";
  };
in

pkgs.stdenv.mkDerivation {
  pname = "minecraftle";
  version = "0.1.0";
  src = ../.;

  nativeBuildInputs = [ pkgs.nodejs_22 pkgs.pnpm pkgs.pnpmConfigHook prisma-engines ];

  inherit pnpmDeps;

  # Point Prisma at the nixpkgs engines — no network download at build time.
  PRISMA_QUERY_ENGINE_LIBRARY = "${prisma-engines}/lib/libquery_engine.node";
  PRISMA_SCHEMA_ENGINE_BINARY = "${prisma-engines}/bin/schema-engine";
  PRISMA_FMT_BINARY           = "${prisma-engines}/bin/prisma-fmt";
  # Avoids prisma generate crash at build time; no connection is made.
  DATABASE_URL = "postgresql://localhost/dummy";

  buildPhase = ''
    pnpm install --offline --frozen-lockfile
    pnpm prisma generate
    pnpm next build
  '';

  # Prisma's .node engine binary is not traced by Next.js NFT — copy it manually.
  postBuild = ''
    dest=.next/standalone/node_modules/.prisma/client
    mkdir -p "$dest"
    cp ${prisma-engines}/lib/libquery_engine.node \
       "$dest/libquery_engine-linux-musl-openssl-3.0.x.node"
  '';

  installPhase = ''
    find .next/standalone -xtype l -delete
    mkdir -p $out
    cp -r .next/standalone/. $out/
    cp -r .next/static $out/.next/static
    cp -r public $out/public
    # Ship the Prisma schema + migrations so the module can run `migrate deploy`.
    cp -r prisma $out/prisma
  '';
}
