import { getDashboardCounts } from "@/lib/admin/queries";

export default async function AdminDashboard() {
  const counts = await getDashboardCounts();

  const stats = [
    { label: "Categories", value: counts.categories, href: "/admin/categories" },
    { label: "Sous-categories", value: counts.subcategories },
    { label: "Projets", value: counts.projects, href: "/admin/projects" },
    { label: "Images", value: counts.images },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Tableau de bord
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
