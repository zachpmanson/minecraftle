// Re-exports the pure crafting primitives from ./crafting (single source of
// truth). Kept as its own module so existing `@/utils/recipe` imports work.
export { generateVariants, getVariantsWithReflections, compareTables } from "./crafting";
