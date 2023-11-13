import cliProgress from 'cli-progress';
/**
 * Downloads the apk from apkpure (Using the XAPK format which is just a zip file with the apk inside)
 * @param package_name com.example.app
 * @returns Buffer of the apk
 */
export const downloadFile = async (package_name, type = 'APK') => {
    const downloadUrl = `https://d.apkpure.com/b/${type}/${package_name}?version=latest`;
    const responseApk = await fetch(downloadUrl, {
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'accept-language': 'en-GB,en;q=0.8',
            'cache-control': 'no-cache',
            'pragma': 'no-cache',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-site',
            'sec-fetch-user': '?1',
            'sec-gpc': '1',
            'upgrade-insecure-requests': '1',
        },
        redirect: 'follow',
        referrer: 'https://m.apkpure.com/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
    });
    if (!responseApk.ok) {
        throw new Error(`Failed to download apk: ${responseApk.statusText}`);
    }
    const toMegabytes = (bytes) => {
        return Number((bytes / (1000 * 1000)).toFixed(2));
    };
    const progressBar = new cliProgress.Bar({
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        format: "{bar} | {percentage}% || {value}/{total} MB",
        clearOnComplete: true,
    });
    // Thanks to https://javascript.info/fetch-progress for this snippet
    const reader = responseApk.body.getReader();
    // start the progress bar
    progressBar.start(toMegabytes(responseApk.headers.get('content-length')), 0);
    let chunks = [];
    let processedLength = 0;
    while (true) {
        const { done, value } = await reader.read();
        if (done || !value) {
            progressBar.stop();
            break;
        }
        chunks.push(value);
        processedLength += value.length;
        const currentProgress = processedLength;
        progressBar.update(toMegabytes(currentProgress));
    }
    const blob = new Blob(chunks);
    const buffer = await blob.arrayBuffer();
    return Buffer.from(buffer);
};
/**
 * Returns the package name from a google play store url
 * @param url https://play.google.com/store/apps/details?id=com.example.app
 * @returns package name com.example.app
 */
export function getPackageNameFromGooglePlayStoreUrl(url) {
    if (!url.includes('play.google.com'))
        return null;
    let u = new URL(url);
    let params = new URLSearchParams(u.search);
    let package_name = params.get('id') || null;
    return package_name;
}
