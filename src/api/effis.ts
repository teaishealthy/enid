import { type FileData } from 'eludris-api-types/effis';

export default async function uploadFile(
    effis: string,
    file: File,
): Promise<FileData> {
    const data = new FormData();
    data.append('file', file);

    const response = await fetch(`${effis}`, {
        method: 'POST',
        body: data,
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
}
