import { Link } from '@inertiajs/react';
import React from 'react';

interface Props {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function Pagination({ links }: Props) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-1">
            {links.map((link, key) => {
                let label = link.label;
                if (label.includes('Previous')) label = '←';
                else if (label.includes('Next')) label = '→';

                if (link.url === null) {
                    return (
                        <span
                            key={key}
                            className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-300 rounded-lg cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                }

                return (
                    <Link
                        key={key}
                        href={link.url}
                        className={`inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-lg transition-all duration-150 ${
                            link.active
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        dangerouslySetInnerHTML={{ __html: label }}
                    />
                );
            })}
        </div>
    );
}
