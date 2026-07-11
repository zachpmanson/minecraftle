{
  description = "minecraftle";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system};
      in {
        packages.default = pkgs.callPackage ./nix/package.nix {};
        devShells.default = pkgs.mkShell {
          packages = [ pkgs.nodejs pkgs.pnpm ];
        };
      }) // {
      nixosModules.default = import ./nix/module.nix self;
    };
}
