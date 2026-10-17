import type { NextConfig } from "next";

// Antete de securitate pentru toate paginile. CSP-ul e intenționat restrâns la directivele care
// nu afectează scripturile Next.js: interzice încadrarea site-ului în alte pagini (clickjacking),
// pluginurile și schimbarea adresei de bază; iframe-urile sunt permise doar pentru YouTube.
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-src https://www.youtube-nocookie.com https://www.youtube.com",
    ].join("; "),
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  // Browserele îl aplică doar pe HTTPS: după prima vizită, site-ul nu mai poate fi deschis pe HTTP.
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Fonturile certificatului PDF se citesc de pe disc, deci trebuie incluse explicit în build.
  outputFileTracingIncludes: {
    "/api/certificat/*": ["./src/assets/fonts/**/*"],
  },
  // Rutele de cont au fost redenumite în română; adresele vechi rămân valabile (parametrii se păstrează).
  async redirects() {
    return [
      { source: "/login", destination: "/autentificare", permanent: true },
      { source: "/register", destination: "/inregistrare", permanent: true },
    ];
  },
};

export default nextConfig;
