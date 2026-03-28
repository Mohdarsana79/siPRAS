const fs = require('fs');

const file = 'C:/laragon/www/siPRAS/resources/js/Pages/Laporan/Index.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacements = [
    {
        from: /<h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 tracking-tight">/g,
        to: '<h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-white tracking-tight">'
    },
    {
        from: /<div className="py-12 bg-gray-50\/50 min-h-screen">/g,
        to: '<div className="py-12 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen transition-colors duration-300">'
    },
    {
        from: /<h3 className="text-3xl font-black text-gray-900 mb-2">/g,
        to: '<h3 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-2">'
    },
    {
        from: /<p className="text-gray-500 font-medium tracking-tight">/g,
        to: '<p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">'
    },
    {
        from: /className={`group relative block overflow-hidden rounded-3xl bg-white shadow-xl shadow-gray-200\/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:scale-95 cursor-pointer`}/g,
        to: 'className={`group relative block overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:scale-95 cursor-pointer`}'
    },
    {
        from: /<h4 className="text-xl font-bold text-gray-900 mb-1">/g,
        to: '<h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">'
    },
    {
        from: /<p className="text-sm text-gray-400 font-medium mb-6">/g,
        to: '<p className="text-sm text-gray-400 dark:text-gray-500 font-medium mb-6">'
    },
    {
        from: /<div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-indigo-50 transition-colors duration-300" \/>/g,
        to: '<div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-gray-50 dark:bg-gray-700/30 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 transition-colors duration-300" />'
    },
    {
        from: /<span className="text-gray-300">\|<\/span>/g,
        to: '<span className="text-gray-300 dark:text-gray-600">|</span>'
    },
    {
        from: /<h3 className="text-2xl font-black text-gray-900 tracking-tight">/g,
        to: '<h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">'
    },
    {
        from: /<p className="text-sm text-gray-500 font-medium">/g,
        to: '<p className="text-sm text-gray-500 dark:text-gray-400 font-medium">'
    },
    {
        from: /<label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">/g,
        to: '<label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">'
    },
    {
        from: /border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm/g,
        to: 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 shadow-sm'
    },
    {
        from: /border-gray-100 bg-white text-gray-500 hover:border-gray-200/g,
        to: 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-gray-600'
    }
];

replacements.forEach(({from, to}) => {
    content = content.replace(from, to);
});

fs.writeFileSync(file, content);
console.log('✅ Updated Laporan Index structure with Dark Mode classes.');
