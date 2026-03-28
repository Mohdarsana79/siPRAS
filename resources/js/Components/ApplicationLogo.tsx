import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M 100 4 L 16 52 L 16 148 L 100 196 L 184 148 L 184 52 Z M 100 27 L 164 64 L 164 136 L 100 173 L 36 136 L 36 64 Z M 100 58 L 60 81 L 100 104 L 140 81 Z M 56 85 L 56 131 L 96 154 L 96 108 Z M 144 85 L 144 131 L 104 154 L 104 108 Z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    );
}
