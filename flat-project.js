const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

// Default ignore patterns
const DEFAULT_IGNORES = [
    'flat-project.js',
    '.git',
    '.flatignore',
    'node_modules',
    '*.log',
    '.vscode',
    '.gitignore',
    '.firebase',
    '.flat'
];

function createFlatIgnoreIfNotExists(rootPath) {
    const ignorePath = path.join(rootPath, '.flatignore');
    if (!fs.existsSync(ignorePath)) {
        const ignoreContent = DEFAULT_IGNORES.join('\n');
        fs.writeFileSync(ignorePath, ignoreContent, 'utf8');
        console.log('.flatignore file created with default ignore patterns.');
    }
}

function readFlatIgnore(rootPath) {
    const ig = ignore();
    
    const ignorePath = path.join(rootPath, '.flatignore');
    if (fs.existsSync(ignorePath)) {
        const ignoreContent = fs.readFileSync(ignorePath, 'utf8');
        ig.add(ignoreContent);
    } else {
        ig.add(DEFAULT_IGNORES);
    }
    return ig;
}

function generateTree(startPath, ig, indent = '', fileList = []) {
    let tree = '';
    const files = fs.readdirSync(startPath);

    files.forEach((file, index) => {
        const filePath = path.join(startPath, file);
        const stats = fs.statSync(filePath);
        const relativePath = path.relative(process.cwd(), filePath);
        const isLast = index === files.length - 1;

        if (ig.ignores(relativePath)) {
            return;
        }

        if (stats.isDirectory()) {
            tree += `${indent}${isLast ? '└── ' : '├── '}${file}/\n`;
            tree += generateTree(filePath, ig, indent + (isLast ? '    ' : '│   '), fileList);
        } else {
            tree += `${indent}${isLast ? '└── ' : '├── '}${file}\n`;
            fileList.push(relativePath);
        }
    });

    return tree;
}

function copyToFlatStructure(fileList, targetDir) {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    fileList.forEach(file => {
        const sourceFile = path.join(process.cwd(), file);
        const targetFile = path.join(targetDir, path.basename(file));
        fs.copyFileSync(sourceFile, targetFile);
    });

    console.log(`Files copied to ${targetDir}`);
}

function updateGitignore(flatDir) {
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (fs.existsSync(gitignorePath)) {
        let gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
        const flatDirPattern = path.basename(flatDir);
        if (!gitignoreContent.split('\n').some(line => line.trim() === flatDirPattern)) {
            gitignoreContent += `\n${flatDirPattern}\n`;
            fs.writeFileSync(gitignorePath, gitignoreContent);
            console.log(`Added ${flatDirPattern} to .gitignore`);
        } else {
            console.log(`${flatDirPattern} already in .gitignore`);
        }
    } else {
        console.log('.gitignore not found. No changes made.');
    }
}

function generateFlatStructure(projectRoot) {
    const flatStructureDir = path.join(projectRoot, '.flat');
    const outputFile = path.join(flatStructureDir, 'flat.txt');

    createFlatIgnoreIfNotExists(projectRoot);

    const ig = readFlatIgnore(projectRoot);

    const fileList = [];
    const treeStructure = generateTree(projectRoot, ig, '', fileList);

    if (!fs.existsSync(flatStructureDir)) {
        fs.mkdirSync(flatStructureDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, treeStructure, 'utf8');
    console.log(`Project structure has been saved to ${outputFile}`);

    copyToFlatStructure(fileList, flatStructureDir);
    updateGitignore(flatStructureDir);
}

module.exports = generateFlatStructure;