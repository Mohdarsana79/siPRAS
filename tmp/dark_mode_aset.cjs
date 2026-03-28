const fs = require('fs');
const filepath = 'C:/laragon/www/siPRAS/resources/js/Pages/AsetData/Index.tsx';

let content = fs.readFileSync(filepath, 'utf8');

// Container
content = content.replace(/bg-\[#FDFDFF\]/g, 'bg-[#FDFDFF] dark:bg-gray-900');

// Header
content = content.replace(/text-gray-900 leading-tight/g, 'text-gray-900 dark:text-white leading-tight');
content = content.replace(/text-xs sm:text-gray-500 font-medium mt-2 max-w-xl text-gray-400/g, 'text-xs sm:text-gray-500 font-medium mt-2 max-w-xl text-gray-400 dark:text-gray-400');

// Header Button "Cetak PDF"
content = content.replace(/bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-100 hover:border-gray-200/g, 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600');

// Filters Background
content = content.replace(/bg-white\/80 backdrop-blur-xl rounded-\[2rem\] sm:rounded-\[3rem\] p-4 sm:p-10 shadow-2xl shadow-gray-200\/50 border border-white/g, 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-10 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-700');

// Filters Items
content = content.replace(/bg-gray-50 text-gray-500 hover:bg-white/g, 'bg-gray-50 text-gray-500 hover:bg-white dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700');
content = content.replace(/text-indigo-500/g, 'text-indigo-500 dark:text-indigo-400'); // Labels e.g Filter Kategori Aset

// Search Input
content = content.replace(/bg-gray-50 border-none rounded-\[1\.5rem\] px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-bold placeholder:text-gray-300 shadow-inner/g, 'bg-gray-50 dark:bg-gray-700/50 dark:text-white border-none rounded-[1.5rem] px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-bold placeholder:text-gray-300 dark:placeholder:text-gray-500 shadow-inner dark:shadow-none');

// Scanner Modal Background & Text
content = content.replace(/bg-indigo-50 /g, 'bg-indigo-50 dark:bg-indigo-900/40 ');
content = content.replace(/text-gray-900 leading-none/g, 'text-gray-900 dark:text-white leading-none');

// Print Settings Modal & Modals Generic
content = content.replace(/bg-white text-gray-500/g, 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300'); 
content = content.replace(/bg-gray-50 rounded-xl text-gray-400 hover:text-gray-600/g, 'bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white');

// AssetCard 
content = content.replace(/bg-white rounded-\[2rem\] sm:rounded-\[3rem\] p-5 sm:p-10 shadow-xl shadow-gray-200\/50 border border-white hover:shadow-2xl hover:shadow-indigo-100/g, 'bg-white dark:bg-gray-800 rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-10 shadow-xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-700 hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20');

// AssetCard Detail View Button
content = content.replace(/bg-gray-50 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-white/g, 'bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-400 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700');

// Title in Card
content = content.replace(/text-gray-900 group-hover:text-transparent/g, 'text-gray-900 dark:text-white group-hover:text-transparent');

// Group/Codes blocks
content = content.replace(/bg-gray-50 rounded-\[2\.5rem\] p-6 border-2 border-transparent group-hover\/codes:bg-white group-hover\/codes:border-indigo-100\/50/g, 'bg-gray-50 dark:bg-gray-700/30 rounded-[2.5rem] p-6 border-2 border-transparent group-hover/codes:bg-white dark:group-hover/codes:bg-gray-700/80 group-hover/codes:border-indigo-100/50 dark:group-hover/codes:border-indigo-500/30');

content = content.replace(/bg-gray-50 rounded-\[2\.5rem\] p-6 border-2 border-transparent group-hover\/codes:bg-white group-hover\/codes:border-violet-100\/50/g, 'bg-gray-50 dark:bg-gray-700/30 rounded-[2.5rem] p-6 border-2 border-transparent group-hover/codes:bg-white dark:group-hover/codes:bg-gray-700/80 group-hover/codes:border-violet-100/50 dark:group-hover/codes:border-violet-500/30');

// Card Canvas Container Background
content = content.replace(/bg-white rounded-3xl shadow-xl shadow-gray-100 group-hover:scale-105 transition-transform duration-700 border border-gray-50/g, 'bg-white rounded-3xl shadow-xl shadow-gray-100 dark:shadow-none group-hover:scale-105 transition-transform duration-700 border border-gray-50 dark:border-transparent');
content = content.replace(/bg-white p-4 rounded-3xl shadow-xl shadow-gray-100 w-full flex items-center justify-center group-hover:scale-105 transition-transform duration-700 border border-gray-50/g, 'bg-white p-4 rounded-3xl shadow-xl shadow-gray-100 dark:shadow-none w-full flex items-center justify-center group-hover:scale-105 transition-transform duration-700 border border-gray-50 dark:border-transparent');

// Card Bottom Items
content = content.replace(/text-gray-700/g, 'text-gray-700 dark:text-gray-200');

// Premium detail modal
content = content.replace(/bg-\[#F8FAFC\]/g, 'bg-[#F8FAFC] dark:bg-gray-800');

// SpecCard / Stats cards inside detail modal
content = content.replace(/bg-white rounded-\[1\.8rem\] p-4 shadow-sm border border-gray-100\/50/g, 'bg-white dark:bg-gray-900/50 rounded-[1.8rem] p-4 shadow-sm border border-gray-100/50 dark:border-gray-700');
content = content.replace(/bg-white rounded-\[2\.5rem\] p-8 shadow-xl shadow-gray-100 border border-white/g, 'bg-white dark:bg-gray-900/50 rounded-[2.5rem] p-8 shadow-xl shadow-gray-100 dark:shadow-none border border-white dark:border-gray-700');

// Print modal items (the specific paper buttons)
content = content.replace(/border-gray-100 hover:border-gray-200 bg-white/g, 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 bg-white dark:bg-gray-800 text-gray-300');
content = content.replace(/text-gray-700"\>\{p.label/g, 'text-gray-700 dark:text-gray-300">{p.label'); // Fix label coloring if needed

fs.writeFileSync(filepath, content, 'utf8');
