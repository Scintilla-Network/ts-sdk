/**
 * Escapes <,>,& in string.
 * Golang's json marshaller escapes <,>,& by default.
 * However, because JS doesn't do that by default, to match the sign doc with cosmos-sdk,
 * we should escape <,>,& in string manually.
 * @param str
 */
export default function escapeHTML(str: string): string;
//# sourceMappingURL=escapeHTML.d.ts.map