import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ isPriority: 'desc' }, { createdAt: 'desc' }],
  });

  const activeProjects = projects.filter(p => p.isActive);
  const inactiveProjects = projects.filter(p => !p.isActive);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-blue-900">Projects</h1>
          <p className="text-sand-600 mt-1">Manage donation projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          Add New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-sand-200 mb-6">
        <div className="px-6 py-4 flex gap-4 flex-wrap">
          <span className="text-sm text-sand-600">
            Total: <strong>{projects.length}</strong> projects
          </span>
          <span className="text-sm text-sand-600">
            Active: <strong>{activeProjects.length}</strong>
          </span>
          <span className="text-sm text-sand-600">
            Inactive: <strong>{inactiveProjects.length}</strong>
          </span>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand-50 border-b border-sand-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {projects.map((project) => {
                const progress = project.goalAmount
                  ? Math.min(100, Math.round((project.raisedAmount / project.goalAmount) * 100))
                  : 0;

                return (
                  <tr key={project.id} className="hover:bg-sand-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {project.featuredImage ? (
                          <img
                            src={project.featuredImage}
                            alt={project.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-sand-200 flex items-center justify-center">
                            <span className="text-sand-500 text-lg">💝</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-blue-900">{project.title}</p>
                          {project.description && (
                            <p className="text-sm text-sand-500 truncate max-w-xs">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {project.goalAmount ? (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-sand-700">
                              {formatCurrency(project.raisedAmount)}
                            </span>
                            <span className="text-sm text-sand-500">
                              / {formatCurrency(project.goalAmount)}
                            </span>
                          </div>
                          <div className="w-32 h-2 bg-sand-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-teal-500 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-sand-500">{progress}% funded</span>
                        </div>
                      ) : (
                        <span className="text-sm text-sand-500">
                          {formatCurrency(project.raisedAmount)} raised
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-sand-100 text-sand-600'
                        }`}
                      >
                        {project.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {project.isPriority && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                          Priority
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/projects`}
                          target="_blank"
                          className="text-sand-600 hover:text-blue-700 text-sm"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sand-500">
                    No projects yet.{' '}
                    <Link href="/admin/projects/new" className="text-teal-600 hover:underline">
                      Add your first project
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
