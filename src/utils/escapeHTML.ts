/**
 * Escapes <,>,& in string.
 * Golang's json marshaller escapes <,>,& by default.
 * However, because JS doesn't do that by default, to match the sign doc with cosmos-sdk,
 * we should escape <,>,& in string manually.
 * @param str
 */
export default function escapeHTML(str: string) {
    return str
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026");
}
