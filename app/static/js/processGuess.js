//load in sanitised reciepes
recipenames = ['acacia_boat.json', 'acacia_button.json', 'acacia_door.json', 'acacia_fence.json', 'acacia_fence_gate.json', 'acacia_planks.json', 'acacia_pressure_plate.json', 
'acacia_sign.json', 'acacia_slab.json', 'acacia_stairs.json', 'acacia_trapdoor.json', 'acacia_wood.json', 'activator_rail.json', 'amethyst_block.json', 'andesite.json', 'andesite_slab.json', 'andesite_stairs.json', 'andesite_wall.json', 'anvil.json', 'armor_stand.json', 'arrow.json', 'barrel.json', 'beacon.json', 'beehive.json', 'beetroot_soup.json', 'birch_boat.json', 'birch_button.json', 'birch_door.json', 'birch_fence.json', 'birch_fence_gate.json', 'birch_planks.json', 'birch_pressure_plate.json', 'birch_sign.json', 'birch_slab.json', 'birch_stairs.json', 'birch_trapdoor.json', 'birch_wood.json', 'blackstone_slab.json', 'blackstone_stairs.json', 'blackstone_wall.json', 'black_banner.json', 'black_bed.json', 'black_bed_from_white_bed.json', 'black_candle.json', 'black_carpet.json', 'black_carpet_from_white_carpet.json', 'black_concrete_powder.json', 'black_dye.json', 'black_dye_from_wither_rose.json', 'black_stained_glass.json', 'black_stained_glass_pane.json', 'black_stained_glass_pane_from_glass_pane.json', 'black_terracotta.json', 'black_wool.json', 'blast_furnace.json', 'blaze_powder.json', 'blue_banner.json', 'blue_bed.json', 'blue_bed_from_white_bed.json', 'blue_candle.json', 'blue_carpet.json', 'blue_carpet_from_white_carpet.json', 'blue_concrete_powder.json', 'blue_dye.json', 'blue_dye_from_cornflower.json', 'blue_ice.json', 'blue_stained_glass.json', 'blue_stained_glass_pane.json', 'blue_stained_glass_pane_from_glass_pane.json', 'blue_terracotta.json', 'blue_wool.json', 'bone_block.json', 'bone_meal.json', 'bone_meal_from_bone_block.json', 'book.json', 'bookshelf.json', 'bow.json', 'bowl.json', 'bread.json', 'brewing_stand.json', 
'bricks.json', 'brick_slab.json', 'brick_stairs.json', 'brick_wall.json', 'brown_banner.json', 'brown_bed.json', 'brown_bed_from_white_bed.json', 'brown_candle.json', 'brown_carpet.json', 'brown_carpet_from_white_carpet.json', 'brown_concrete_powder.json', 'brown_dye.json', 'brown_stained_glass.json', 'brown_stained_glass_pane.json', 'brown_stained_glass_pane_from_glass_pane.json', 'brown_terracotta.json', 'brown_wool.json', 'bucket.json', 'cake.json', 'campfire.json', 'candle.json', 'carrot_on_a_stick.json', 'cartography_table.json', 'cauldron.json', 'chain.json', 'chest.json', 'chest_minecart.json', 'chiseled_deepslate.json', 'chiseled_nether_bricks.json', 'chiseled_polished_blackstone.json', 'chiseled_quartz_block.json', 'chiseled_red_sandstone.json', 'chiseled_sandstone.json', 'chiseled_stone_bricks.json', 'clay.json', 'clock.json', 'coal.json', 'coal_block.json', 'coarse_dirt.json', 'cobbled_deepslate_slab.json', 'cobbled_deepslate_stairs.json', 'cobbled_deepslate_wall.json', 'cobblestone_slab.json', 'cobblestone_stairs.json', 'cobblestone_wall.json', 'comparator.json', 'compass.json', 'composter.json', 'conduit.json', 'cookie.json', 'copper_block.json', 'copper_ingot.json', 'copper_ingot_from_waxed_copper_block.json', 'crafting_table.json', 'creeper_banner_pattern.json', 'crimson_button.json', 'crimson_door.json', 'crimson_fence.json', 'crimson_fence_gate.json', 'crimson_hyphae.json', 'crimson_planks.json', 'crimson_pressure_plate.json', 'crimson_sign.json', 'crimson_slab.json', 'crimson_stairs.json', 'crimson_trapdoor.json', 'crossbow.json', 'cut_copper.json', 'cut_copper_slab.json', 'cut_copper_stairs.json', 'cut_red_sandstone.json',
'cut_red_sandstone_slab.json', 'cut_sandstone.json', 'cut_sandstone_slab.json', 'cyan_banner.json', 'cyan_bed.json', 'cyan_bed_from_white_bed.json', 'cyan_candle.json', 'cyan_carpet.json', 'cyan_carpet_from_white_carpet.json', 'cyan_concrete_powder.json', 'cyan_dye.json', 'cyan_stained_glass.json', 'cyan_stained_glass_pane.json', 'cyan_stained_glass_pane_from_glass_pane.json', 'cyan_terracotta.json', 'cyan_wool.json', 'dark_oak_boat.json', 'dark_oak_button.json', 'dark_oak_door.json', 'dark_oak_fence.json', 'dark_oak_fence_gate.json', 'dark_oak_planks.json', 'dark_oak_pressure_plate.json', 'dark_oak_sign.json', 'dark_oak_slab.json', 'dark_oak_stairs.json', 'dark_oak_trapdoor.json', 'dark_oak_wood.json', 'dark_prismarine.json', 'dark_prismarine_slab.json', 'dark_prismarine_stairs.json', 'daylight_detector.json', 'deepslate_bricks.json', 'deepslate_brick_slab.json', 'deepslate_brick_stairs.json', 'deepslate_brick_wall.json', 'deepslate_tiles.json', 'deepslate_tile_slab.json', 'deepslate_tile_stairs.json', 'deepslate_tile_wall.json', 'detector_rail.json', 'diamond.json', 'diamond_axe.json', 'diamond_block.json', 'diamond_boots.json', 'diamond_chestplate.json', 'diamond_helmet.json', 'diamond_hoe.json', 'diamond_leggings.json', 'diamond_pickaxe.json', 'diamond_shovel.json', 'diamond_sword.json', 'diorite.json', 'diorite_slab.json', 'diorite_stairs.json', 'diorite_wall.json', 'dispenser.json', 'dried_kelp.json', 'dried_kelp_block.json', 'dripstone_block.json', 'dropper.json', 'emerald.json', 'emerald_block.json', 'enchanting_table.json', 'ender_chest.json', 'ender_eye.json', 'end_crystal.json', 'end_rod.json', 'end_stone_bricks.json', 'end_stone_brick_slab.json', 
'end_stone_brick_stairs.json', 'end_stone_brick_wall.json', 'exposed_cut_copper.json', 'exposed_cut_copper_slab.json', 'exposed_cut_copper_stairs.json', 'fermented_spider_eye.json', 'firework_rocket_simple.json', 'fire_charge.json', 'fishing_rod.json', 'fletching_table.json', 'flint_and_steel.json', 'flower_banner_pattern.json', 'flower_pot.json', 'furnace.json', 'furnace_minecart.json', 'glass_bottle.json', 'glass_pane.json', 'glistering_melon_slice.json', 'glowstone.json', 'glow_item_frame.json', 'golden_apple.json', 'golden_axe.json', 'golden_boots.json', 'golden_carrot.json', 'golden_chestplate.json', 'golden_helmet.json', 'golden_hoe.json', 'golden_leggings.json', 'golden_pickaxe.json', 'golden_shovel.json', 'golden_sword.json', 'gold_block.json', 'gold_ingot_from_gold_block.json', 'gold_ingot_from_nuggets.json', 'gold_nugget.json', 'granite.json', 'granite_slab.json', 'granite_stairs.json', 'granite_wall.json', 'gray_banner.json', 'gray_bed.json', 'gray_bed_from_white_bed.json', 'gray_candle.json', 'gray_carpet.json', 'gray_carpet_from_white_carpet.json', 'gray_concrete_powder.json', 'gray_dye.json', 'gray_stained_glass.json', 'gray_stained_glass_pane.json', 'gray_stained_glass_pane_from_glass_pane.json', 'gray_terracotta.json', 'gray_wool.json', 'green_banner.json', 'green_bed.json', 'green_bed_from_white_bed.json', 'green_candle.json', 'green_carpet.json', 'green_carpet_from_white_carpet.json', 'green_concrete_powder.json', 'green_stained_glass.json', 'green_stained_glass_pane.json', 'green_stained_glass_pane_from_glass_pane.json', 'green_terracotta.json', 'green_wool.json', 'grindstone.json', 'hay_block.json', 'heavy_weighted_pressure_plate.json', 'honeycomb_block.json', 
'honey_block.json', 'honey_bottle.json', 'hopper.json', 'hopper_minecart.json', 'iron_axe.json', 'iron_bars.json', 'iron_block.json', 'iron_boots.json', 'iron_chestplate.json', 'iron_door.json', 'iron_helmet.json', 'iron_hoe.json', 'iron_ingot_from_iron_block.json', 'iron_ingot_from_nuggets.json', 'iron_leggings.json', 'iron_nugget.json', 'iron_pickaxe.json', 'iron_shovel.json', 'iron_sword.json', 'iron_trapdoor.json', 'item_frame.json', 'jack_o_lantern.json', 'jukebox.json', 'jungle_boat.json', 'jungle_button.json', 'jungle_door.json', 'jungle_fence.json', 'jungle_fence_gate.json', 'jungle_planks.json', 'jungle_pressure_plate.json', 'jungle_sign.json', 'jungle_slab.json', 'jungle_stairs.json', 'jungle_trapdoor.json', 'jungle_wood.json', 'ladder.json', 'lantern.json', 'lapis_block.json', 'lapis_lazuli.json', 'lead.json', 'leather.json', 'leather_boots.json', 'leather_chestplate.json', 'leather_helmet.json', 'leather_horse_armor.json', 'leather_leggings.json', 'lectern.json', 'lever.json', 'lightning_rod.json', 'light_blue_banner.json', 'light_blue_bed.json', 'light_blue_bed_from_white_bed.json', 'light_blue_candle.json', 'light_blue_carpet.json', 'light_blue_carpet_from_white_carpet.json', 'light_blue_concrete_powder.json', 'light_blue_dye_from_blue_orchid.json', 'light_blue_dye_from_blue_white_dye.json', 'light_blue_stained_glass.json', 'light_blue_stained_glass_pane.json', 'light_blue_stained_glass_pane_from_glass_pane.json', 'light_blue_terracotta.json', 'light_blue_wool.json', 
'light_gray_banner.json', 'light_gray_bed.json', 'light_gray_bed_from_white_bed.json', 'light_gray_candle.json', 'light_gray_carpet.json', 'light_gray_carpet_from_white_carpet.json', 'light_gray_concrete_powder.json', 'light_gray_dye_from_azure_bluet.json', 'light_gray_dye_from_black_white_dye.json', 'light_gray_dye_from_gray_white_dye.json', 'light_gray_dye_from_oxeye_daisy.json', 'light_gray_dye_from_white_tulip.json', 'light_gray_stained_glass.json', 'light_gray_stained_glass_pane.json', 'light_gray_stained_glass_pane_from_glass_pane.json', 'light_gray_terracotta.json', 'light_gray_wool.json', 'light_weighted_pressure_plate.json', 'lime_banner.json', 'lime_bed.json', 'lime_bed_from_white_bed.json', 'lime_candle.json', 'lime_carpet.json', 'lime_carpet_from_white_carpet.json', 'lime_concrete_powder.json', 'lime_dye.json', 'lime_stained_glass.json', 'lime_stained_glass_pane.json', 'lime_stained_glass_pane_from_glass_pane.json', 'lime_terracotta.json', 'lime_wool.json', 'lodestone.json', 'loom.json', 'magenta_banner.json', 'magenta_bed.json', 'magenta_bed_from_white_bed.json', 'magenta_candle.json', 'magenta_carpet.json', 'magenta_carpet_from_white_carpet.json', 'magenta_concrete_powder.json', 'magenta_dye_from_allium.json', 'magenta_dye_from_blue_red_pink.json', 'magenta_dye_from_blue_red_white_dye.json', 'magenta_dye_from_lilac.json', 'magenta_dye_from_purple_and_pink.json', 'magenta_stained_glass.json', 'magenta_stained_glass_pane.json', 'magenta_stained_glass_pane_from_glass_pane.json', 'magenta_terracotta.json', 'magenta_wool.json', 'magma_block.json', 'magma_cream.json', 'map.json', 'melon.json', 'melon_seeds.json', 'minecart.json', 
'mojang_banner_pattern.json', 'mossy_cobblestone_from_moss_block.json', 'mossy_cobblestone_from_vine.json', 'mossy_cobblestone_slab.json', 'mossy_cobblestone_stairs.json', 'mossy_cobblestone_wall.json', 'mossy_stone_bricks_from_moss_block.json', 'mossy_stone_bricks_from_vine.json', 'mossy_stone_brick_slab.json', 'mossy_stone_brick_stairs.json', 'mossy_stone_brick_wall.json', 'moss_carpet.json', 'mushroom_stew.json', 'netherite_block.json', 'netherite_ingot.json', 'netherite_ingot_from_netherite_block.json', 'nether_bricks.json', 'nether_brick_fence.json', 'nether_brick_slab.json', 'nether_brick_stairs.json', 'nether_brick_wall.json', 'nether_wart_block.json', 'note_block.json', 'oak_boat.json', 'oak_button.json', 'oak_door.json', 'oak_fence.json', 'oak_fence_gate.json', 'oak_planks.json', 'oak_pressure_plate.json', 'oak_sign.json', 'oak_slab.json', 'oak_stairs.json', 'oak_trapdoor.json', 'oak_wood.json', 'observer.json', 'orange_banner.json', 'orange_bed.json', 'orange_bed_from_white_bed.json', 'orange_candle.json', 'orange_carpet.json', 'orange_carpet_from_white_carpet.json', 'orange_concrete_powder.json', 'orange_dye_from_orange_tulip.json', 'orange_dye_from_red_yellow.json', 'orange_stained_glass.json', 'orange_stained_glass_pane.json', 'orange_stained_glass_pane_from_glass_pane.json', 'orange_terracotta.json', 'orange_wool.json', 'oxidized_cut_copper.json', 'oxidized_cut_copper_slab.json', 'oxidized_cut_copper_stairs.json', 'packed_ice.json', 'painting.json', 'paper.json', 'pink_banner.json', 'pink_bed.json', 'pink_bed_from_white_bed.json', 'pink_candle.json', 'pink_carpet.json', 'pink_carpet_from_white_carpet.json', 'pink_concrete_powder.json', 'pink_dye_from_peony.json', 'pink_dye_from_pink_tulip.json', 'pink_dye_from_red_white_dye.json', 'pink_stained_glass.json', 
'pink_stained_glass_pane.json', 'pink_stained_glass_pane_from_glass_pane.json', 'pink_terracotta.json', 'pink_wool.json', 'piston.json', 'polished_andesite.json', 'polished_andesite_slab.json', 'polished_andesite_stairs.json', 'polished_basalt.json', 'polished_blackstone.json', 'polished_blackstone_bricks.json', 'polished_blackstone_brick_slab.json', 'polished_blackstone_brick_stairs.json', 'polished_blackstone_brick_wall.json', 'polished_blackstone_button.json', 'polished_blackstone_pressure_plate.json', 'polished_blackstone_slab.json', 'polished_blackstone_stairs.json', 'polished_blackstone_wall.json', 'polished_deepslate.json', 'polished_deepslate_slab.json', 'polished_deepslate_stairs.json', 'polished_deepslate_wall.json', 'polished_diorite.json', 'polished_diorite_slab.json', 'polished_diorite_stairs.json', 'polished_granite.json', 'polished_granite_slab.json', 'polished_granite_stairs.json', 'powered_rail.json', 'prismarine.json', 'prismarine_bricks.json', 'prismarine_brick_slab.json', 'prismarine_brick_stairs.json', 'prismarine_slab.json', 'prismarine_stairs.json', 'prismarine_wall.json', 'pumpkin_pie.json', 'pumpkin_seeds.json', 'purple_banner.json', 'purple_bed.json', 'purple_bed_from_white_bed.json', 'purple_candle.json', 'purple_carpet.json', 'purple_carpet_from_white_carpet.json', 'purple_concrete_powder.json', 'purple_dye.json', 'purple_stained_glass.json', 'purple_stained_glass_pane.json', 'purple_stained_glass_pane_from_glass_pane.json', 'purple_terracotta.json', 'purple_wool.json', 'purpur_block.json', 'purpur_pillar.json', 'purpur_slab.json', 'purpur_stairs.json', 'quartz_block.json', 'quartz_bricks.json', 'quartz_pillar.json', 'quartz_slab.json', 'quartz_stairs.json', 'rabbit_stew_from_brown_mushroom.json', 'rabbit_stew_from_red_mushroom.json', 'rail.json', 
'raw_copper.json', 'raw_copper_block.json', 'raw_gold.json', 'raw_gold_block.json', 'raw_iron.json', 'raw_iron_block.json', 'redstone.json', 'redstone_block.json', 'redstone_lamp.json', 'redstone_torch.json', 'red_banner.json', 'red_bed.json', 'red_bed_from_white_bed.json', 'red_candle.json', 'red_carpet.json', 'red_carpet_from_white_carpet.json', 'red_concrete_powder.json', 'red_dye_from_beetroot.json', 'red_dye_from_poppy.json', 'red_dye_from_rose_bush.json', 'red_dye_from_tulip.json', 'red_nether_bricks.json', 'red_nether_brick_slab.json', 'red_nether_brick_stairs.json', 'red_nether_brick_wall.json', 'red_sandstone.json', 'red_sandstone_slab.json', 'red_sandstone_stairs.json', 'red_sandstone_wall.json', 'red_stained_glass.json', 'red_stained_glass_pane.json', 'red_stained_glass_pane_from_glass_pane.json', 'red_terracotta.json', 'red_wool.json', 'repeater.json', 'respawn_anchor.json', 'sandstone.json', 'sandstone_slab.json', 'sandstone_stairs.json', 'sandstone_wall.json', 'scaffolding.json', 'sea_lantern.json', 'shears.json', 'shield.json', 'shulker_box.json', 'skull_banner_pattern.json', 'slime_ball.json', 'slime_block.json', 'smithing_table.json', 'smoker.json', 'smooth_quartz_slab.json', 'smooth_quartz_stairs.json', 'smooth_red_sandstone_slab.json', 'smooth_red_sandstone_stairs.json', 'smooth_sandstone_slab.json', 'smooth_sandstone_stairs.json', 'smooth_stone_slab.json', 'snow.json', 'snow_block.json', 'soul_campfire.json', 'soul_lantern.json', 'soul_torch.json', 'spectral_arrow.json', 'spruce_boat.json', 'spruce_button.json', 'spruce_door.json', 'spruce_fence.json', 'spruce_fence_gate.json', 'spruce_planks.json', 'spruce_pressure_plate.json', 'spruce_sign.json', 'spruce_slab.json', 'spruce_stairs.json', 'spruce_trapdoor.json', 'spruce_wood.json', 'spyglass.json', 'stick.json', 
'sticky_piston.json', 'stick_from_bamboo_item.json', 'stonecutter.json', 'stone_axe.json', 'stone_bricks.json', 'stone_brick_slab.json', 'stone_brick_stairs.json', 'stone_brick_wall.json', 'stone_button.json', 'stone_hoe.json', 'stone_pickaxe.json', 'stone_pressure_plate.json', 'stone_shovel.json', 'stone_slab.json', 'stone_stairs.json', 'stone_sword.json', 'stripped_acacia_wood.json', 'stripped_birch_wood.json', 'stripped_crimson_hyphae.json', 'stripped_dark_oak_wood.json', 'stripped_jungle_wood.json', 'stripped_oak_wood.json', 'stripped_spruce_wood.json', 'stripped_warped_hyphae.json', 'sugar_from_honey_bottle.json', 'sugar_from_sugar_cane.json', 'target.json', 'tinted_glass.json', 'tnt.json', 'tnt_minecart.json', 'torch.json', 'trapped_chest.json', 'tripwire_hook.json', 'turtle_helmet.json', 'warped_button.json', 'warped_door.json', 'warped_fence.json', 'warped_fence_gate.json', 'warped_fungus_on_a_stick.json', 'warped_hyphae.json', 'warped_planks.json', 'warped_pressure_plate.json', 'warped_sign.json', 'warped_slab.json', 'warped_stairs.json', 'warped_trapdoor.json', 'waxed_copper_block_from_honeycomb.json', 'waxed_cut_copper.json', 'waxed_cut_copper_from_honeycomb.json', 'waxed_cut_copper_slab.json', 'waxed_cut_copper_slab_from_honeycomb.json', 'waxed_cut_copper_stairs.json', 'waxed_cut_copper_stairs_from_honeycomb.json', 'waxed_exposed_copper_from_honeycomb.json', 'waxed_exposed_cut_copper.json', 'waxed_exposed_cut_copper_from_honeycomb.json', 'waxed_exposed_cut_copper_slab.json', 'waxed_exposed_cut_copper_slab_from_honeycomb.json', 'waxed_exposed_cut_copper_stairs.json', 'waxed_exposed_cut_copper_stairs_from_honeycomb.json', 'waxed_oxidized_copper_from_honeycomb.json', 'waxed_oxidized_cut_copper.json', 'waxed_oxidized_cut_copper_from_honeycomb.json', 'waxed_oxidized_cut_copper_slab.json', 
'waxed_oxidized_cut_copper_slab_from_honeycomb.json', 'waxed_oxidized_cut_copper_stairs.json', 'waxed_oxidized_cut_copper_stairs_from_honeycomb.json', 'waxed_weathered_copper_from_honeycomb.json', 'waxed_weathered_cut_copper.json', 'waxed_weathered_cut_copper_from_honeycomb.json', 'waxed_weathered_cut_copper_slab.json', 'waxed_weathered_cut_copper_slab_from_honeycomb.json', 'waxed_weathered_cut_copper_stairs.json', 'waxed_weathered_cut_copper_stairs_from_honeycomb.json', 'weathered_cut_copper.json', 'weathered_cut_copper_slab.json', 'weathered_cut_copper_stairs.json', 'wheat.json', 'white_banner.json', 'white_bed.json', 'white_candle.json', 'white_carpet.json', 'white_concrete_powder.json', 'white_dye.json', 'white_dye_from_lily_of_the_valley.json', 'white_stained_glass.json', 'white_stained_glass_pane.json', 'white_stained_glass_pane_from_glass_pane.json', 'white_terracotta.json', 'white_wool_from_string.json', 'wooden_axe.json', 'wooden_hoe.json', 'wooden_pickaxe.json', 'wooden_shovel.json', 'wooden_sword.json', 'writable_book.json', 'yellow_banner.json', 'yellow_bed.json', 'yellow_bed_from_white_bed.json', 'yellow_candle.json', 'yellow_carpet.json', 'yellow_carpet_from_white_carpet.json', 'yellow_concrete_powder.json', 'yellow_dye_from_dandelion.json', 'yellow_dye_from_sunflower.json', 'yellow_stained_glass.json', 'yellow_stained_glass_pane.json', 'yellow_stained_glass_pane_from_glass_pane.json', 'yellow_terracotta.json', 'yellow_wool.json']

var solution_id = parseInt(document.getElementById("solution").innerHTML);
console.log(solution_id);
var solution_recipe;
var solution_item;

async function getjson() {
    // const requestJson = "static/data/sanitised recipes/" + recipenames[solution_id];
    const requestJson = "static/data/sanitised recipes/wooden_shovel.json"
    console.log(requestJson);
    const request = new Request(requestJson);
    const response = await fetch(request);
    const rawrecipe = await response.json();
    populate_Solution(rawrecipe);
}

getjson();

function populate_Solution(rawrecipe) {
    solution_recipe = rawrecipe["input"];
    solution_item = rawrecipe["output"];
    init(solution_recipe);
    console.log(solution_item, solution_recipe);
}

/**
 * Compares 2 tables of equal dimensions.  Only considers slots equal to 
 * matchOnly, if given.
 * @param {Array} table1 
 * @param {Array} table2 
 * @param {*} matchOnly 
 * @returns {Array} matchmap, matchcount, isFullMatch
 */
function compareTables(table1, table2, matchOnly) {

    // 0 is wrong, 1 is null match, 2 is item match
    let matchmap = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    let matchcount = 0;
    let isFullMatch = true;
    for (let i = 0; i < table1.length; i++) {
        for (let j = 0; j < table1[0].length; j++) {
            // if matchOnly arg given
            if (matchOnly !== undefined) {
                // if either do not match matchOnly
                if (table1[i][j] !== matchOnly || table1[i][j] !== matchOnly) {
                    // leave matchmap entry as incorrect
                    continue;
                }
            }
            
            if (table1[i][j] === table2[i][j]) {
                if (table1[i][j] === null) {
                    // if match is air
                    matchmap[i][j] = 1;
                } else {
                    // if match is item
                    matchmap[i][j] = 2;
                    matchcount++;
                }

            }
            else {
                isFullMatch = false;
            }
        }                   
    }

    return [matchmap, matchcount, isFullMatch];
}

/**
 * Will generate every possible variant position a given recipe can be created 
 * in a crafting table.  
 * @param {Array} recipe 
 * @returns {Array} Array of all possible variants
 */
function generateVariants(recipe) {
    let height = recipe.length
    let width = recipe[0].length;
    let verticalVariants = 4 - recipe.length;
    let horizontalVariants = 4 - recipe[0].length;

    let variants = []

    for (let i = 0; i < verticalVariants; i++) {
        for (let j = 0; j < horizontalVariants; j++) {
            let currentVariant = [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ];

            for (let k = 0; k < height; k++) {
                for (let l = 0; l < width; l++) {
                    currentVariant[i+k][j+l] = recipe[k][l];
                }
            }
            variants.push(currentVariant);
        }
    }
    return variants;
}


/**
 * Compares given guess to each variant in allVariants
 * @param {*} guess 
 * @returns {Array} if matches any variants, matchmap of guess and that variant
 */
function checkAllVariants(guess) {
    let isCorrect = false
    let matchmap = null;
    
    allVariants.forEach( (variant, i)=>{
        matchData = compareTables(variant, guess);
        // matchData[2] is boolean isFullMatch
        if (matchData[2]) {
            isCorrect = true;
            matchmap = matchData[0];
        }
    });
    return [isCorrect, matchmap];
}
/**
 * Compares guess to each variant in remainingVariants and counts how many slots
 * are correct.
 * @param {*} guess 3x3 array of crafting guess
 * @returns {Array} array of all matchmaps, array of correct slot counts
 */
function checkRemainingVariants(guess) {
    
    let matchmaps = [];
    let matchcounts = []
    
    remainingVariants.forEach( (variant)=>{
        let matchData = compareTables(variant, guess);

        matchmaps.push(matchData[0]);
        matchcounts.push(matchData[1]);
    });

    return [matchmaps, matchcounts];
}

/**
 * Determines which variants in remainingVariants will stay.  Chooses variant 
 * with highest number of matches.  If multiple of these, picks one and only
 * keeps variants with matching correct slots as the chosen one.
 * @param {Array} matchmaps
 * @param {Array} matchcounts 
 * @returns 
 */
function findRemainingVariantsIndices(matchmaps, matchcounts) {
    // Get index of max value in matchcounts
    let maxMatchesIndex = matchcounts.indexOf(Math.max(...matchcounts));
    // generate mask matchmap at this index for 2's
    let correctSlots = compareTables(matchmaps[maxMatchesIndex], matchmaps[maxMatchesIndex], 2)[0];

    let remainingVariantsIndices = []

    matchmaps.forEach( (matchmap, i)=>{
        // mask to only include 2's in matchmaps
        let matchDataToCompare = compareTables(matchmap, matchmap, 2); 
        // compare masked
        let correctSlotOverlapData = compareTables(correctSlots, matchDataToCompare[0])
        
        // if correctSlotOverlapData is full match
        if (correctSlotOverlapData[2]) {
            remainingVariantsIndices.push(i);
        }
    });

    return [remainingVariantsIndices, correctSlots];
}

/**
 * Creates a table of with correct items that have been guessed filled in
 * @param {Array} guess 
 * @param {Arrray} correctSlots a matchmap of guess on the solution
 * @returns {Array} table with item strings filled in
 */
function generateNextGuessStartingTable(guess, correctSlots) {
    let startingTable = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    for (let i = 0; i < guess.length; i++) {
        for (let j = 0; j < guess[0].length; j++) {
            if (correctSlots[i][j] === 2) {
                startingTable[i][j] = guess[i][j];
            }
        }
    }

    return startingTable;
}

/**
 * Takes guess table, checks against all variants.  If not a full match to any,
 * it checks the remainingVariants.  Trims remainingVariants based on 
 * correctSlots identified.
 * @param {Array} guess 
 * @returns {Array} isGuessTheSolution, matchmap of guess to remainingVariants
 */
function processGuess(guess) {
    guessCount++;
    console.log("GUESS #"+guessCount)

    // Checks guess against ALL variants.
    // May be able to replace this later when the crafting decision tree is implemented
    let allVariantsData = checkAllVariants(guess);
    let isFullMatch = allVariantsData[0];
    let matchmap = allVariantsData[1];

    if (isFullMatch) {
        return [true, matchmap];
    }

    // if it isn't a fullmatch to any variant

    // Generates matchmaps and matchcounts for guess compared to all remainingVariants
    let remainingMatchData = checkRemainingVariants(guess);
    // Generates list of indices to keep in remainingVariants, and a matchmap for the matches shared by all variants indices and the guess
    let remainingVariantsData = findRemainingVariantsIndices(remainingMatchData[0], remainingMatchData[1]);
    let remainingVariantsIndices = remainingVariantsData[0]; // indices to keep in remainingVariants
    let correctSlots = remainingVariantsData[1]; // matches shared by all variants indices and the guess 


    // Recreate remainingVariants based on the given indices
    let cleanedVariants = []
    remainingVariantsIndices.forEach((variantIndex)=>{
        cleanedVariants.push(remainingVariants[variantIndex]);
    });
    remainingVariants = cleanedVariants;

    // this may unnecessary, depends how we want game to function
    startingTable = generateNextGuessStartingTable(guess, correctSlots);

    return [false, correctSlots];
}

function init(solution) {
    allVariants = allVariants.concat(generateVariants(solution));
    remainingVariants = remainingVariants.concat(generateVariants(solution));
    // Account for horizontal reflection
    solution[0].reverse();
    solution[1].reverse();
    solution[2].reverse();
    allVariants = allVariants.concat(generateVariants(solution));
    remainingVariants = remainingVariants.concat(generateVariants(solution));
}


/* Recipes must be in format
[
    ["minecraft:planks","minecraft:planks"],
    [null,"minecraft:stick"],
    [null,"minecraft:stick"]
]
 */

let remainingVariants = [];
let allVariants = [];
let guessCount = -1; // this is just for console output

//randomly select a recipe to be the solution for today

//TODO implement difficulties and recipe selection changes based on difficulty, also implement solution changing every 24 hours rather than every time the server is loaded
// init(solution_recipe);



/*Used for manual testing.  Can remove when hooked up to GUI * /
let recipe = [
    ["minecraft:planks","minecraft:planks"],
    [null,"minecraft:stick"],
    [null,"minecraft:stick"]
];
let recipe2 = [
    ["minecraft:coal"],
    ["minecraft:stick"]
]

let guesses = [
    [
        [null, null, null],
        [null, "minecraft:stick", null],
        [null, "minecraft:stick", null]
    ],
    [
        [null, "minecraft:planks", null],
        [null, "minecraft:stick", null],
        [null, "minecraft:stick", null]
    ],
    [
        ["minecraft:planks", "minecraft:planks", null],
        ["minecraft:planks", "minecraft:stick", null],
        [null, "minecraft:stick", null]
    ],
    [
        ["minecraft:planks", "minecraft:planks", null],
        [null, "minecraft:stick", null],
        [null, "minecraft:stick", null]
    ]
]

init(recipe);

console.log(processGuess(guesses[0]))
console.log(processGuess(guesses[1]))
console.log(processGuess(guesses[2]))
console.log(processGuess(guesses[3]))
//*/






