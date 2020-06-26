import gqlOrig from "graphql-tag";

const cache = new Map<string, string[]>();

export default function gql(
  strings: TemplateStringsArray,
  ...docs: Array<{
    kind: "Document";
    loc?: { source: { body: string } };
  }>
) {
  const parts = [trim(strings[0])];

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];

    let body = doc.loc?.source.body;
    if (!body) {
      throw Error(`Document must have a source: ${JSON.stringify(doc)}`);
    }

    const cacheParts = cache.get(body);
    if (!cacheParts) {
      throw Error(
        `Are you sure you don't mix gql-dedup usage with the plain graphql-tag? (If you use tsc compiler, also make sure to check if the compiler output file is not stale; tsc has some bugs, especially during incremental builds.) We can't find the following document node in gql-dedup registry: [${body}]`
      );
    }

    parts.push(...cacheParts);
    parts.push(trim(strings[i + 1]));
  }

  const uniqueParts = [...new Set(parts).keys()];
  const uniqueBody = uniqueParts.filter((part) => part !== "").join("\n");
  cache.set(uniqueBody, uniqueParts);

  return gqlOrig(uniqueBody);
}

function trim(str: string) {
  return str.replace(/^([ \t\r]*\n)+/, "").trimRight();
}
