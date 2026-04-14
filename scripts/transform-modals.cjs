const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '..', 'resources', 'js', 'Pages');

// Konfigurasi untuk setiap halaman: title, subtitle, accentColor
const PAGE_CONFIG = {
    'KibB/Index.tsx': {
        formTitle: "isEditing ? 'Edit Peralatan & Mesin' : 'Tambah Peralatan & Mesin'",
        subtitle: "Kartu Inventaris Barang — KIB B",
        accent: "orange",
        leftSection: "Informasi Utama",
        rightSection: "Spesifikasi KIB B",
        kibType: "B",
    },
    'KibC/Index.tsx': {
        formTitle: "isEditing ? 'Edit Gedung & Bangunan' : 'Tambah Gedung & Bangunan'",
        subtitle: "Kartu Inventaris Barang — KIB C",
        accent: "violet",
        leftSection: "Informasi Utama",
        rightSection: "Spesifikasi KIB C",
        kibType: "C",
    },
    'KibD/Index.tsx': {
        formTitle: "isEditing ? 'Edit Jalan, Irigasi & Jaringan' : 'Tambah Jalan, Irigasi & Jaringan'",
        subtitle: "Kartu Inventaris Barang — KIB D",
        accent: "teal",
        leftSection: "Informasi Utama",
        rightSection: "Spesifikasi KIB D",
        kibType: "D",
    },
    'KibE/Index.tsx': {
        formTitle: "isEditing ? 'Edit Aset Tetap Lainnya' : 'Tambah Aset Tetap Lainnya'",
        subtitle: "Kartu Inventaris Barang — KIB E",
        accent: "purple",
        leftSection: "Informasi Utama",
        rightSection: "Spesifikasi KIB E",
        kibType: "E",
    },
};

// Regex: cocokkan blok modal form (dari komentar pembuka sampai </Modal>)
// Pola yang sama di semua halaman KIB:
// <!-- Premium Colorful Modal - Add / Edit -->
// <Modal show={isModalOpen} ...>
//   <div ...>
//     ... header gradient ...
//     <form ...>
//       <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-5">
//         <div className="space-y-4 md:col-span-6">  (LEFT)
//           <h4 ...> h4-left </h4>
//           ... (field) ...
//         </div>
//         <div className="space-y-4 md:col-span-6">  (RIGHT)
//           <h4 ...> h4-right </h4>
//           ... (field) ...
//         </div>
//       </div>
//       ... buttons ...
//     </form>
//   </div>
// </Modal>

// Karena regex multiline kompleks, kita pakai string replacement berbasis marker

function transformFile(relPath, config) {
    const filePath = path.join(PAGES_DIR, relPath);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠ NOT FOUND: ${relPath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // 1. Hapus blok "Artistic Header" dari dalam modal - replace dengan FormModal wrapper
    //    Cari pola: <Modal show={isModalOpen} onClose={closeModal} maxWidth="6xl">
    //    - sampai -: </Modal> pertama setelah itu
    //    Ini terlalu kompleks untuk safe regex, jadi kita lakukan transformasi spesifik:

    // Replace: grid md:col-span-6 -> grid md:grid-cols-2
    content = content.replace(
        /className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-5"/g,
        'className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"'
    );

    // Replace md:col-span-6 -> (remove)
    content = content.replace(/\bmd:col-span-6\b/g, '');

    // Replace h4 section headers - left column (accent colors vary)
    content = content.replace(
        /<h4 className="flex items-center gap-2 text-\[10px\] font-black text-[a-z]+-500 uppercase tracking-\[0\.2em\] mb-4">\s*<div className="w-6 h-px bg-[a-z]+-100"><\/div>\s*([^<]+)\s*<\/h4>/g,
        (match, sectionName) => {
            const name = sectionName.trim();
            // Determine color based on section name
            const isKIBSection = name.toLowerCase().includes('kib') || name.toLowerCase().includes('spesifikasi');
            const colorClass = isKIBSection ? 'text-indigo-500 border-indigo-100' : 'text-gray-500 border-gray-100';
            return `<p className="text-xs font-semibold ${colorClass} uppercase tracking-wider border-b pb-2 mb-3">${name}</p>`;
        }
    );

    // Replace button block (footer inside form):
    // <div className="flex items-center gap-4 mt-12">
    //   <SecondaryButton ... BATAL ...
    //   <PrimaryButton ...
    // </div>
    // Ini akan dihandle oleh FormModal footer otomatis, jadi kita hapus blok ini
    // Regex: dari `<div className="flex items-center gap-4 mt-` sampai first </div> closing
    
    // Replace modal-level class wrapper:
    content = content.replace(
        /<div className="bg-white\/95 backdrop-blur-xl max-h-\[90vh\] overflow-y-auto custom-scrollbar rounded-\[2\.5rem\]">/g,
        '<div>'
    );

    // Replace artistic header div (2 patterns: one for form modal, one for detail)
    // Form modal artistic header
    content = content.replace(
        /<div className={`px-8 pt-10 pb-12 relative flex flex-col items-center text-center overflow-hidden [^`]+`}>\s*<div className="absolute[^>]+><\/div>\s*<div className="absolute[^>]+><\/div>\s*<div className="w-20[^>]+>[\s\S]*?<\/div>\s*<h3[^>]+>[\s\S]*?<\/h3>\s*<p[^>]+>[\s\S]*?<\/p>\s*<\/div>/g,
        ''
    );

    // Replace form wrapper inside modal
    content = content.replace(
        /className="px-8 pb-8 -mt-6 bg-white rounded-t-\[2\.5rem\] relative z-20 pt-8"/g,
        'className=""'
    );

    // Replace detail header div
    content = content.replace(
        /<div className="px-8 pt-10 pb-12 relative flex flex-col items-center text-center overflow-hidden bg-gradient-to-br[^"]+">[\s\S]*?<\/div>\s*\n\s*<div className="p-8 -mt-6 bg-white rounded-t-\[2\.5rem\] relative z-20">/g,
        ''
    );

    // Replace large footer close in detail
    content = content.replace(
        /<div className="mt-10">\s*<SecondaryButton[^>]+>[^<]*TUTUP JENDELA DETAIL[^<]*<\/SecondaryButton>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/Modal>/g,
        '</Modal>'
    );

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Transformed: ${relPath}`);
}

// Process KIB pages only
for (const [relPath, config] of Object.entries(PAGE_CONFIG)) {
    transformFile(relPath, config);
}

console.log('\nDone.');
