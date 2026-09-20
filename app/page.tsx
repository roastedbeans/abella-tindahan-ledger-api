const ROUTES = [
  "/api/customers",
  "/api/customers?delay=4000",
  "/api/customers?empty=1",
  "/api/customers?fail=1",
  "/api/customers/c1",
  "/api/customers/c9",
];

export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 24, lineHeight: 1.8 }}>
      <h1>MC2 class API</h1>
      <ul>
        {ROUTES.map((r) => (
          <li key={r}>
            <a href={r}>{r}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
