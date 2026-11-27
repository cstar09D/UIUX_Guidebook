import {gzipSync,gunzipSync} from 'node:zlib';
export function encodeCheckpoint(text) {return 'gzip:'+gzipSync(Buffer.from(text)).toString('base64');}
export function decodeCheckpoint(value) {return value.startsWith('gzip:') ? gunzipSync(Buffer.from(value.slice(5),'base64')).toString('utf8') : value;}
