export default function unescapeHTML(str: string) {
    return str
        .replace(/\\u003c/g, "<")
        .replace(/\\u003e/g, ">")
        .replace(/\\u0026/g, "&");
}
