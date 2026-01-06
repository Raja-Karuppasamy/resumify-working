export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      {/* Hero */}
      <section className="mb-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Resume Parser API that just works
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Parse PDFs, DOCX, and scanned resumes into clean, structured JSON —
          without brittle regex, layout hacks, or OCR nightmares.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/signup"
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Get API Key
          </a>
          <a
            href="/playground"
            className="rounded-lg border px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            Try Live Demo
          </a>
        </div>
      </section>

      {/* Problem */}
      <section className="mb-20">
        <h2 className="text-2xl font-semibold">
          Parsing resumes is deceptively painful
        </h2>
        <ul className="mt-6 list-disc space-y-3 pl-6 text-gray-600">
          <li>Every resume has a different layout</li>
          <li>Scanned PDFs break most parsers</li>
          <li>OCR edge cases never end</li>
          <li>Maintaining parsing logic drains engineering time</li>
        </ul>
      </section>

      {/* Solution */}
      <section className="mb-20">
        <h2 className="text-2xl font-semibold">One API. Predictable output.</h2>
        <p className="mt-6 text-gray-600">
          Upload a resume and get structured JSON designed for ATS,
          HR tools, and resume platforms.
        </p>
      </section>

      {/* Example */}
      <section className="mb-20 rounded-lg bg-gray-50 p-6">
        <h2 className="mb-4 text-xl font-semibold">Example</h2>
        <pre className="overflow-x-auto text-sm text-gray-800">
{`POST /parse
Headers:
  X-API-Key: your_api_key

Body:
  file=@resume.pdf`}
        </pre>

        <pre className="mt-4 overflow-x-auto text-sm text-gray-800">
{`{
  "name": "John Doe",
  "email": "john@example.com",
  "experience": [...],
  "education": [...],
  "skills": [...]
}`}
        </pre>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-semibold">
          Start parsing resumes in minutes
        </h2>
        <p className="mt-4 text-gray-600">
          Free tier available · No credit card required
        </p>
        <div className="mt-6">
          <a
            href="/signup"
            className="rounded-lg bg-black px-8 py-3 text-white hover:bg-gray-800"
          >
            Get API Key
          </a>
        </div>
      </section>
    </main>
  );
}
