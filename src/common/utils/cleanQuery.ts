export const cleanQuery = (params: Record<string, unknown>): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => [key, String(value)]),
  );
};
