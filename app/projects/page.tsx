import Image from 'next/image';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Current fundraising projects at Baan Maa Dog Rescue. See where your donations go.',
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { isActive: true },
    orderBy: [{ isPriority: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <>
      <Section background="blue" padding="lg">
        <Container size="md" className="text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Fundraising Projects
          </h1>
          <p className="text-lg text-white/90">
            See our current fundraising goals and help us reach them.
            Every donation makes a real difference.
          </p>
        </Container>
      </Section>

      <Section background="sand" padding="lg">
        <Container size="lg">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-sand-600">No active projects at the moment.</p>
            </div>
          )}
        </Container>
      </Section>

      <Section background="white" padding="md">
        <Container size="md" className="text-center">
          <h2 className="font-display text-2xl font-bold text-blue-800 mb-4">
            General Fund
          </h2>
          <p className="text-sand-700 mb-6">
            Can&apos;t decide on a specific project? Donations to our general fund
            help us respond to emergencies and cover daily operations.
          </p>
          <Link href="/donate">
            <Button>Donate to General Fund</Button>
          </Link>
        </Container>
      </Section>

      <Section background="blue" padding="md">
        <Container size="md" className="text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-4">
            100% Transparency
          </h2>
          <p className="text-white/80 mb-6">
            We publish regular updates on how funds are used. Every penny goes
            directly to dog care - we are entirely volunteer-run.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-block">
              <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:-translate-y-0.5 transition-all">
                Request Financial Report
              </button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}

function ProjectCard({ project }: { project: { title: string; slug: string; description: string | null; featuredImage: string | null; goalAmount: number | null; raisedAmount: number; isPriority: boolean } }) {
  const progress = project.goalAmount ? (project.raisedAmount / project.goalAmount) * 100 : 0;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      {project.featuredImage && (
        <div className="relative aspect-[16/9]">
          <Image
            src={project.featuredImage}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
      {project.isPriority && (
        <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded mb-3">
          Priority
        </span>
      )}
      <h3 className="font-semibold text-xl text-blue-800 mb-2">{project.title}</h3>
      {project.description && (
        <p className="text-sand-700 mb-4 line-clamp-3">
          {project.description.replace(/<[^>]*>/g, '')}
        </p>
      )}

      {project.goalAmount && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-sand-600">Raised</span>
            <span className="font-semibold text-teal-700">
              £{project.raisedAmount.toLocaleString()} / £{project.goalAmount.toLocaleString()}
            </span>
          </div>
          <div className="h-3 bg-sand-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-sand-500 mt-1">
            {Math.round(progress)}% funded
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Link href={`/projects/${project.slug}`} className="flex-1">
          <Button variant="outline" fullWidth>
            Learn More
          </Button>
        </Link>
        <Link href={`/donate?project=${project.slug}`} className="flex-1">
          <Button fullWidth>
            Donate
          </Button>
        </Link>
      </div>
      </div>
    </div>
  );
}
