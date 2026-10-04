import Link from 'next/link';
import type { Publication } from '@/types/publication';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title = 'Selected Publications', enableOnePageMode = false }: SelectedPublicationsProps) {
    return (
        <section aria-label={title}>
            <div className="section-rule mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pb-3">
                <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
                <Link
                    href={enableOnePageMode ? '/#publications' : '/publications'}
                    prefetch={true}
                    className="shrink-0 text-sm text-accent transition-colors duration-200 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                    View all <span aria-hidden="true">→</span>
                </Link>
            </div>
            <ul className="divide-y divide-neutral-200">
                {publications.map((pub) => {
                    const paperUrl = pub.doi ? `https://doi.org/${pub.doi}` : pub.url || pub.pdfUrl;
                    const venue = pub.journal || pub.conference;
                    const conferenceAcronym = pub.conference?.match(/\(([A-Z][A-Z0-9-]*)\)\s*$/)?.[1];
                    const compactVenue = pub.journal || conferenceAcronym || pub.conference;

                    return (
                        <li key={pub.id} className="py-4 last:pb-0">
                            <article>
                                <h3 className="text-base font-medium leading-snug text-primary">
                                    {paperUrl ? (
                                        <a
                                            href={paperUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="transition-colors duration-200 underline-offset-4 hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                                        >
                                            {pub.title}
                                        </a>
                                    ) : pub.title}
                                </h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                                    {pub.authors.map((author, index) => (
                                        <span key={`${author.name}-${index}`}>
                                            {author.isHighlighted ? (
                                                <strong className="font-semibold text-primary">{author.name}</strong>
                                            ) : author.name}
                                            {author.isCorresponding && <sup>†</sup>}
                                            {index < pub.authors.length - 1 && ', '}
                                        </span>
                                    ))}
                                </p>
                                <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                                    {compactVenue && (
                                        <>
                                            {conferenceAcronym && !pub.journal ? (
                                                <abbr title={venue} className="italic no-underline">{compactVenue}</abbr>
                                            ) : <span className="italic">{compactVenue}</span>}
                                            <span aria-hidden="true"> · </span>
                                        </>
                                    )}
                                    {pub.year}
                                </p>
                            </article>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
