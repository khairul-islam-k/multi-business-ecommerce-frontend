import type { ResponseCategory } from "@/types/product/product";

export type CategorySelectOption = {
  label: string;
  value: string;
};

type CategoryRecord = Partial<Omit<ResponseCategory, "children" | "status">> & {
  id?: string;
  name?: string;
  status?: string;
  children?: CategoryOptionCategory[];
};

type CategoryTreeNode = {
  category?: CategoryOptionCategory | null;
  children?: CategoryOptionCategory[];
};

type CategoryOptionCategory = CategoryRecord | CategoryTreeNode;

type CategoryOptionOptions = {
  includeInactive?: boolean;
  excludeIds?: string[];
};

const isTreeNode = (category: CategoryOptionCategory): category is CategoryTreeNode =>
  Boolean(
    category &&
      typeof category === "object" &&
      "category" in category &&
      (category as CategoryTreeNode).category,
  );

const unwrapCategory = (
  category: CategoryOptionCategory,
): CategoryRecord | null => {
  if (!category) return null;

  if (isTreeNode(category)) {
    return unwrapCategory(category.category as CategoryOptionCategory);
  }

  return category;
};

const getChildren = (category: CategoryOptionCategory) => {
  const unwrapped = unwrapCategory(category);
  const nodeChildren = isTreeNode(category) ? category.children ?? [] : [];
  const categoryChildren = unwrapped?.children ?? [];
  const childrenById = new Map<string, CategoryOptionCategory>();

  [...nodeChildren, ...categoryChildren].forEach((child) => {
    const childCategory = unwrapCategory(child);

    if (!childCategory?.id) return;
    childrenById.set(childCategory.id, child);
  });

  return Array.from(childrenById.values());
};

const isVisibleCategory = (
  category: CategoryRecord,
  options: CategoryOptionOptions,
) => {
  if (options.includeInactive) return true;

  return !category.status || category.status.toUpperCase() === "ACTIVE";
};

export function flattenCategories(categories: CategoryOptionCategory[] = []) {
  const flattened: CategoryRecord[] = [];

  const visit = (category: CategoryOptionCategory) => {
    const unwrapped = unwrapCategory(category);

    if (!unwrapped) return;

    flattened.push(unwrapped);
    getChildren(category).forEach(visit);
  };

  categories.forEach(visit);

  return flattened;
}

export function getCategoryDescendantIds(
  category?: CategoryOptionCategory | null,
) {
  const ids = new Set<string>();

  const visit = (item: CategoryOptionCategory) => {
    getChildren(item).forEach((child) => {
      const childCategory = unwrapCategory(child);

      if (childCategory?.id) ids.add(childCategory.id);
      visit(child);
    });
  };

  if (category) visit(category);

  return ids;
}

export function buildCategoryOptions(
  categories: CategoryOptionCategory[] = [],
  options: CategoryOptionOptions = {},
): CategorySelectOption[] {
  const excludedIds = new Set(options.excludeIds ?? []);
  const selectOptions: CategorySelectOption[] = [];

  const visit = (category: CategoryOptionCategory, trail: string[]) => {
    const unwrapped = unwrapCategory(category);

    if (!unwrapped?.id || !unwrapped.name) return;

    const nextTrail = [...trail, unwrapped.name];

    if (
      !excludedIds.has(unwrapped.id) &&
      isVisibleCategory(unwrapped, options)
    ) {
      selectOptions.push({
        label: nextTrail.join(" / "),
        value: unwrapped.id,
      });
    }

    getChildren(category).forEach((child) => visit(child, nextTrail));
  };

  categories.forEach((category) => visit(category, []));

  return selectOptions;
}
