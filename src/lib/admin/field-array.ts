/** useFieldArray can't operate on arrays of primitives — these convert a
 * plain string[] to/from the `{ value: string }[]` shape RepeatableListField/
 * StringListField needs, at the form-state boundary. */
export function toRows(values: string[] = []): { value: string }[] {
  return values.map((value) => ({ value }));
}

export function fromRows(rows: { value: string }[] = []): string[] {
  return rows.map((r) => r.value.trim()).filter(Boolean);
}
