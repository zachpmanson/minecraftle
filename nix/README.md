# NixOS packaging

Runs minecraftle as a self-hosted NixOS systemd service: a Next.js standalone
server, with PostgreSQL (optionally co-located), secrets via `EnvironmentFile`,
and an nginx reverse proxy in front.

## Files

| File               | Purpose                                        |
|--------------------|------------------------------------------------|
| `../flake.nix`     | Inputs + `packages.default` + `nixosModules.default` |
| `package.nix`      | Build derivation (pnpm offline + Next standalone) |
| `module.nix`       | NixOS module (`services.minecraftle`)          |

The build relies on `output: "standalone"` in `../next.config.js`.

## Build

```sh
nix build
```

### First build — pin the pnpm deps hash

`package.nix` ships with `hash = pkgs.lib.fakeHash`. The first `nix build`
fails with the real hash; paste it in:

```nix
hash = "sha256-...";   # from the build error
```

Re-run this whenever `pnpm-lock.yaml` changes.

## Prisma version alignment (highest-risk item)

`@prisma/client` / `prisma` are pinned to **5.22.0** in `pnpm-lock.yaml`, so the
package uses `prisma-engines_5`. If a `nix build` / runtime error reports an
engine-version mismatch, check `nix eval nixpkgs#prisma-engines_5.version` and,
if it drifts off the 5.x line you need, pin `nixpkgs` in `flake.nix` to a commit
where it matches (or add an overlay overriding `prisma-engines_5`).

## Deploy (`configuration.nix`)

```nix
{
  imports = [ minecraftle.nixosModules.default ];

  services.minecraftle = {
    enable = true;
    port = 3000;
    environmentFile = "/etc/minecraftle/secrets.env";
    postgresql.enable = true;   # omit if using an external DB
  };

  services.nginx.virtualHosts."minecraftle.example.com" = {
    enableACME = true;
    forceSSL = true;
    locations."/".proxyPass = "http://127.0.0.1:3000";
  };
}
```

### Secrets file

`/etc/minecraftle/secrets.env` (mode 0400, root-owned; use sops-nix/agenix in
production):

```ini
DATABASE_URL=postgresql://minecraftle:PASSWORD@localhost/minecraftle
```

## Scoreboard materialized view

`prisma/MVs.sql` creates the `scoreboard` materialized view — it is **not** part
of the Prisma migrations. After the first `migrate deploy`, apply it once and
schedule periodic refreshes yourself:

```sh
psql "$DATABASE_URL" -f prisma/MVs.sql
# then, on a timer: REFRESH MATERIALIZED VIEW scoreboard;
```

## Verify

1. `nix build` — clean build (pin the pnpm hash first).
2. Target host: `systemctl status minecraftle-migrate` — migrations ran.
3. `systemctl status minecraftle` — service is active.
4. `curl -I http://127.0.0.1:3000` — expect `200`.
