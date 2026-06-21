"""
Written by Zach Manson, based on the previous script by Harrison Oates

Regenerates the two data files the game consumes:
  ../public/data/recipes.json   (crafting recipes)
  ../public/data/items.json     (item name / icon / stack)

Inputs (all under this conversion_scripts/ folder):
  recipes_json/        - the recipe JSONs extracted from the Minecraft assets
  item_textures/       - flat item sprite PNGs (item/generated icons)
  all_items.json       - old curated item DB (name/icon/stack), stale but still useful
  ../public/data/given_ingredients.json  - the palette the puzzle allows

Only recipes whose every ingredient is a given ingredient are kept, and only the
crafting_shaped / crafting_shapeless types (the grid puzzle can't represent the rest).

Just run this script; it writes the output files directly into ../public/data.
"""

import argparse
import base64
import json
import os

RECIPES_DIR = "./recipes_json/"
ITEM_TEXTURES_DIR = "./item_textures/"
ALL_ITEMS_PATH = "./all_items.json"
GIVEN_INGREDIENTS_PATH = "../public/data/given_ingredients.json"
RECIPES_OUT = "../public/data/recipes.json"
ITEMS_OUT = "../public/data/items.json"

# Converts tags to an acceptable equivalent block. Matched as a substring of the
# tag id (without the leading '#'), so e.g. "logs" matches both "minecraft:logs"
# and "minecraft:oak_logs" -> minecraft:oak_log.
tag_map = {
    "planks": "minecraft:planks",
    "wooden_slabs": "minecraft:oak_slab",
    "logs": "minecraft:oak_log",
    "wool": "minecraft:white_wool",
    "coals": "minecraft:coal",
    "stone_tool_materials": "minecraft:cobblestone",
    "stone_crafting_materials": "minecraft:cobblestone",
    "stone": "minecraft:cobblestone",
    "wooden_tool_materials": "minecraft:planks",
    "iron_tool_materials": "minecraft:iron_ingot",
    "gold_tool_materials": "minecraft:gold_ingot",
    "diamond_tool_materials": "minecraft:diamond",
}

files_to_skip = ["stick_from_bamboo_item"]

given_ingredients = json.load(open(GIVEN_INGREDIENTS_PATH))


def resolve_ingredient(value):
    """Turn a recipe key/ingredient value into an item id (or None for empty)."""
    if value is None:
        return None
    if isinstance(value, list):
        value = value[0]
    # Legacy dict form, just in case ({"item": ...} / {"tag": ...})
    if isinstance(value, dict):
        value = value.get("item") or value.get("tag")

    if isinstance(value, str) and value.startswith("#"):
        tag = value[1:]
        for needle, replacement in tag_map.items():
            if needle in tag:
                return replacement
        return tag  # unmapped tag -> won't be a given ingredient -> recipe skipped

    if value == "minecraft:oak_planks":
        return "minecraft:planks"
    return value


def wood_preference(recipe_name):
    """Rank for picking a representative when wood variants collide; lower wins.
    Prefers the plain oak variant (e.g. oak_planks over acacia_planks)."""
    return 0 if recipe_name == "oak" or recipe_name.startswith("oak_") else 1


def process_recipes(path):
    recipe_filenames = sorted(
        recipe for recipe in os.listdir(path) if recipe.endswith(".json")
    )
    new_recipes = {}
    seen_inputs = {}  # json(input) -> recipe name that claimed it (for dedup)

    for recipe_filename in recipe_filenames:
        extless_filename = recipe_filename[: recipe_filename.find(".")]
        if extless_filename in files_to_skip:
            continue

        jsonfile = json.load(open(os.path.join(path, recipe_filename)))
        recipe_type = jsonfile.get("type")
        if recipe_type not in (
            "minecraft:crafting_shaped",
            "minecraft:crafting_shapeless",
        ):
            continue

        skip = False
        recipe_input = []

        if recipe_type == "minecraft:crafting_shaped":
            for row in jsonfile["pattern"]:
                new_row = []
                for char in row:
                    if char == " ":
                        new_row.append(None)
                        continue
                    itemname = resolve_ingredient(jsonfile["key"][char])
                    new_row.append(itemname)
                    if itemname not in given_ingredients:
                        skip = True
                recipe_input.append(new_row)
        else:  # crafting_shapeless
            ingredients = [resolve_ingredient(x) for x in jsonfile["ingredients"]]
            for itemname in ingredients:
                if itemname not in given_ingredients:
                    skip = True
            recipe_input = [ingredients]

        if skip:
            continue

        recipe = {
            "type": recipe_type,
            "group": jsonfile.get("group", ""),
            "output": jsonfile["result"]["id"],
            "input": recipe_input,
        }

        # Drop recipes that produce an input grid we've already got: in the
        # positional grid puzzle two recipes with the same input are ambiguous
        # (e.g. all wood-plank shapeless recipes collapse to a single oak_log).
        # When that happens, keep the more-preferred variant (oak for wood types).
        input_key = json.dumps(recipe_input)
        if input_key in seen_inputs:
            previous = seen_inputs[input_key]
            if wood_preference(extless_filename) < wood_preference(previous):
                print(f"  collision: replacing {previous} with {extless_filename}")
                del new_recipes[previous]
            else:
                print(
                    f"  skipping {extless_filename}: input collides with {previous}"
                )
                continue
        seen_inputs[input_key] = extless_filename
        new_recipes[extless_filename] = recipe

    return new_recipes


def create_recipes():
    processed_recipes = process_recipes(RECIPES_DIR)
    with open(RECIPES_OUT, "w") as write_file:
        json.dump(processed_recipes, write_file, indent=2)
    print(f"Written {len(processed_recipes)} recipes to {RECIPES_OUT}")
    return processed_recipes


def title_from_id(item_id):
    short = item_id.split(":", 1)[-1]
    return " ".join(word.capitalize() for word in short.split("_"))


def texture_icon(item_id, texture_dirs):
    """data: URI for a flat item sprite, or None if no sprite is found in any
    of the search dirs (checked in order)."""
    short = item_id.split(":", 1)[-1]
    for directory in texture_dirs:
        path = os.path.join(directory, short + ".png")
        if os.path.isfile(path):
            with open(path, "rb") as f:
                encoded = base64.b64encode(f.read()).decode("ascii")
            return "data:image/png;base64," + encoded
    return None


def texture_search_dirs(textures_dir):
    """Ordered list of dirs to look for <item>.png sprites in. Always starts with
    the local item_textures/ folder; if a Minecraft assets textures directory is
    given, its item/ then block/ subfolders are appended as extra sources."""
    dirs = [ITEM_TEXTURES_DIR]
    if textures_dir:
        for sub in ("item", "block"):
            candidate = os.path.join(textures_dir, sub)
            if os.path.isdir(candidate):
                dirs.append(candidate)
    return dirs


def create_all_items(recipes, texture_dirs):
    existing_items = json.load(open(ITEMS_OUT))
    all_items = json.load(open(ALL_ITEMS_PATH))

    wanted = set(given_ingredients)
    wanted.update(recipe["output"] for recipe in recipes.values())

    items = {}
    missing = []
    for item_id in sorted(wanted):
        # 1. preserve whatever the current items.json already has
        if item_id in existing_items:
            items[item_id] = existing_items[item_id]
            continue
        # 2. fall back to the old curated DB (proper renders for a few blocks)
        if item_id in all_items:
            items[item_id] = all_items[item_id]
            continue
        # 3. build from a flat item sprite (spears, chain, ...)
        icon = texture_icon(item_id, texture_dirs)
        if icon is not None:
            items[item_id] = {
                "name": title_from_id(item_id),
                "icon": icon,
                "stack": 1,
            }
            continue
        missing.append(item_id)

    if missing:
        print("WARNING: no icon found for:", ", ".join(missing))

    with open(ITEMS_OUT, "w") as write_file:
        json.dump(items, write_file, indent=4)
    print(f"Written {len(items)} items to {ITEMS_OUT}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Regenerate recipes.json and items.json from the Minecraft data."
    )
    parser.add_argument(
        "--textures-dir",
        help=(
            "Path to the Minecraft assets textures directory used to collate the "
            "item_textures folder (the one containing item/ and block/ subfolders). "
            "Used as an extra source of item sprites when an icon isn't already "
            "available. Optional."
        ),
    )
    args = parser.parse_args()

    recipes = create_recipes()
    create_all_items(recipes, texture_search_dirs(args.textures_dir))
