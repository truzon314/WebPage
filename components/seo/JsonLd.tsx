export function JsonLd({ data }: { data: object }) {
  // Escaping `<` prevents a `</script>` sequence inside any CMS-controlled
  // string reaching this object (a blog title, a custom schema_jsonld field
  // in the SEO module, etc.) from breaking out of the script tag — standard
  // JSON-in-<script> hardening (the same technique Next.js itself uses for
  // __NEXT_DATA__). A JSON parser treats < and a literal `<` as
  // identical, so this has no effect on the parsed structured data that
  // Google/crawlers actually read — output and SEO behavior are unchanged.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
