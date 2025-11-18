/**
 * FORM ORDERING UTILITIES
 *
 * Ensures that forms are always sorted correctly:
 * 1. By FormGrouping order
 * 2. By Field order within each grouping
 *
 * This is the single source of truth for form ordering logic.
 */

import { FormTemplate, FormGrouping, FormField } from "../types/forms";

/**
 * Sorts a FormTemplate to ensure:
 * 1. FormGrouping is sorted by order property
 * 2. Each FormGrouping.Fields is sorted by order property
 *
 * Creates a new template object - does not mutate the original
 *
 * @param template - The FormTemplate to sort
 * @returns A new FormTemplate with properly sorted groupings and fields
 */
export function sortFormTemplate(template: FormTemplate): FormTemplate {
  if (!template || !template.FormGrouping) {
    return template;
  }

  // Sort groupings by order
  const sortedGroupings = [...template.FormGrouping]
    .sort((a, b) => a.order - b.order)
    .map((grouping) => sortFormGrouping(grouping));

  return {
    ...template,
    FormGrouping: sortedGroupings,
  };
}

/**
 * Sorts a single FormGrouping to ensure Fields are sorted by order
 *
 * @param grouping - The FormGrouping to sort
 * @returns A new FormGrouping with properly sorted fields
 */
export function sortFormGrouping(grouping: FormGrouping): FormGrouping {
  if (!grouping || !grouping.Fields) {
    return grouping;
  }

  const sortedFields = [...grouping.Fields].sort((a, b) => a.order - b.order);

  return {
    ...grouping,
    Fields: sortedFields,
  };
}

/**
 * Validates that a FormTemplate has proper ordering
 * Useful for debugging ordering issues
 *
 * @param template - The FormTemplate to validate
 * @returns Object with validation results
 */
export function validateFormOrdering(template: FormTemplate): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!template?.FormGrouping) {
    return { valid: true, issues: [] };
  }

  // Check grouping order
  const groupingOrders = template.FormGrouping.map((g) => g.order);
  for (let i = 1; i < groupingOrders.length; i++) {
    if (groupingOrders[i] < groupingOrders[i - 1]) {
      issues.push(
        `FormGrouping not sorted by order: ${groupingOrders[i - 1]} > ${
          groupingOrders[i]
        }`
      );
    }
  }

  // Check field order within each grouping
  for (const grouping of template.FormGrouping) {
    if (!grouping.Fields) continue;

    const fieldOrders = grouping.Fields.map((f) => f.order);
    for (let i = 1; i < fieldOrders.length; i++) {
      if (fieldOrders[i] < fieldOrders[i - 1]) {
        issues.push(
          `Fields in grouping "${grouping.title}" not sorted by order: ${
            fieldOrders[i - 1]
          } > ${fieldOrders[i]}`
        );
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
