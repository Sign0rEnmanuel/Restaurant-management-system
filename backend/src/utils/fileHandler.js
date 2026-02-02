import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const readJSON = (filename) => {
    try {
        const filePath = path.join(__dirname, '../database', filename);
        const data = fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log(`Error reading file ${filename}: ${error}`);
        return false;
    }
};

export const writeJSON = (filename, data) => {
    try {
        const filePath = path.join(__dirname, '../database', filename);
        fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.log(`Error writing file ${filename}: ${error}`);
        return false;
    }
};