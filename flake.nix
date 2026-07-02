{
  description = "minecraftle";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: {
      packages.default = nixpkgs.legacyPackages.${system}.callPackage ./nix/package.nix {};
    }) // {
      nixosModules.default = import ./nix/module.nix self;
    };
}
