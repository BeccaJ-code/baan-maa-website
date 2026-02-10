import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: project.title,
    description: project.description || `Support the ${project.title} project at Baan Maa Dog Rescue.`,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug, isActive: true },
  });

  if (!project) {
    notFound();
  }

  const progress = project.goalAmount
    ? Math.min(100, Math.round((project.raisedAmount / project.goalAmount) * 100))
    : 0;
  const remaining = project.goalAmount
    ? project.goalAmount - project.raisedAmount
    : 0;

  // Get other active projects
  const otherProjects = await prisma.project.findMany({
    where: {
      isActive: true,
      id: { not: project.id },
    },
    take: 3,
    orderBy: [{ isPriority: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <>
      {/* Hero */}
      <Section background="blue" padding="md">
        <Container size="lg">
          <Link
            href="/projects"
            className="inline-flex items-center text-blue-200 hover:text-white mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
          <div className="flex items-center gap-3">
            {project.isPriority && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                Priority
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">
            {project.title}
          </h1>
        </Container>
      </Section>

      {/* Project Details */}
      <Section background="sand" padding="lg">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {project.featuredImage && (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
                  <Image
                    src={project.featuredImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {project.description && (
                <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                  <h2 className="font-display text-xl font-bold text-blue-900 mb-4">
                    About This Project
                  </h2>
                  <div className="prose prose-sand max-w-none">
                    {project.description.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="text-sand-700 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Funding Progress */}
              {project.goalAmount && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-display font-bold text-blue-900 mb-4">Funding Progress</h3>

                  <div className="text-center mb-4">
                    <div className="font-display text-4xl font-bold text-teal-600">
                      {progress}%
                    </div>
                    <p className="text-sm text-sand-600">funded</p>
                  </div>

                  <div className="w-full h-4 bg-sand-200 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm mb-6">
                    <div>
                      <p className="font-semibold text-blue-900">
                        £{project.raisedAmount.toLocaleString()}
                      </p>
                      <p className="text-sand-500">raised</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-900">
                        £{project.goalAmount.toLocaleString()}
                      </p>
                      <p className="text-sand-500">goal</p>
                    </div>
                  </div>

                  {remaining > 0 && (
                    <p className="text-sm text-teal-700 font-medium text-center mb-4">
                      £{remaining.toLocaleString()} still needed
                    </p>
                  )}

                  <Link href={`/donate?project=${project.slug}`}>
                    <Button fullWidth size="lg">
                      Donate to This Project
                    </Button>
                  </Link>
                </div>
              )}

              {/* General donation CTA if no goal */}
              {!project.goalAmount && (
                <div className="bg-teal-50 rounded-xl p-6 border border-teal-100">
                  <h3 className="font-display font-bold text-teal-800 mb-2">
                    Support This Project
                  </h3>
                  <p className="text-teal-700 text-sm mb-4">
                    Your donation helps make this project a reality.
                  </p>
                  <Link href={`/donate?project=${project.slug}`}>
                    <Button fullWidth>Donate Now</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <Section background="white" padding="md">
          <Container size="lg">
            <h2 className="font-display text-2xl font-bold text-blue-900 mb-8">
              Other Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherProjects.map((other) => {
                const otherProgress = other.goalAmount
                  ? Math.min(100, Math.round((other.raisedAmount / other.goalAmount) * 100))
                  : 0;

                return (
                  <Link
                    key={other.id}
                    href={`/projects/${other.slug}`}
                    className="bg-sand-50 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    {other.isPriority && (
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded mb-2">
                        Priority
                      </span>
                    )}
                    <h3 className="font-semibold text-blue-900 mb-2">
                      {other.title}
                    </h3>
                    {other.goalAmount && (
                      <div>
                        <div className="w-full h-2 bg-sand-200 rounded-full overflow-hidden mb-1">
                          <div
                            className="h-full bg-teal-600 rounded-full"
                            style={{ width: `${otherProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-sand-500">{otherProgress}% funded</p>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}
