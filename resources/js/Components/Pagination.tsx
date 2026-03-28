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
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {links.map((link, key) => {
                if (link.url === null) {
                    return (
                        <div
                            key={key}
                            className="px-4 py-2 text-sm text-gray-400 bg-white border border-gray-100 rounded-xl cursor-not-allowed font-bold"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                // Custom label handling for the requested style
                let label = link.label;
                if (label.includes('Previous')) {
                    label = '&laquo;';
                } else if (label.includes('Next')) {
                    label = '&raquo;';
                }

                return (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-4 py-2 text-sm font-black rounded-xl border transition-all duration-200 ${
                            link.active
                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                                : 'bg-white border-gray-100 text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: label }}
                    />
                );
            })}
        </div>
    );
}
