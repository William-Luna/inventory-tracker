//Details Page

export default function UpcomingFeaturesPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 px-6">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          🚧 Upcoming Features
        </h1>

        <p className="text-lg text-gray-600">
          This part of the app is currently under development. Check back soon
          for new functionality and improvements.
        </p>

        <div className="bg-white shadow-md rounded-2xl p-6 text-left">
          <h2 className="text-xl font-semibold mb-4">
            What’s Coming Next
          </h2>

          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>📦 Advanced inventory tracking & filtering</li>
            <li>📊 Profit analytics dashboard</li>
            <li>🖼️ Image uploads for items</li>
            <li>🔍 Search & category organization</li>
            <li>🌐 API integration with backend</li>
          </ul>
        </div>

        <div className="text-sm text-gray-500">
          Built with Next.js + Spring Boot + PostgreSQL
        </div>
      </div>
    </main>
  );
}

