const fs = require('fs');
const path = require('path');

const dir = 'C:/laragon/www/siPRAS/resources/js/Pages';
const filesToProcess = ['KibA', 'KibB', 'KibC', 'KibD', 'KibE'].map(k => path.join(dir, k, 'Index.tsx'));

filesToProcess.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Change Modal maxWidth
    content = content.replace(/<Modal show=\{isModalOpen\} onClose=\{closeModal\} maxWidth="4xl">/g, '<Modal show={isModalOpen} onClose={closeModal} maxWidth="6xl">');

    // Change Form grid
    content = content.replace(/<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">/g, '<div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-5">');

    // Add col-spans to the specific column containers
    content = content.replace(/(\{[\s\S]*?(?:Left|Right) Column[\s\S]*?\}\s*)<div className="space-y-4">/g, '$1<div className="space-y-4 md:col-span-6">');

    fs.writeFileSync(file, content);
    console.log('Processed columns & modal width for:', file);
});
