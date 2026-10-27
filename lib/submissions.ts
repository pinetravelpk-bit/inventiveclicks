// Append-only JSONL storage for form submissions in DATA_DIR (server only).
import {appendFile,mkdir,readFile} from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR=process.env.DATA_DIR||path.join(process.cwd(),'.data');

export async function appendRecord(file:string,record:Record<string,unknown>){
  await mkdir(DATA_DIR,{recursive:true});
  await appendFile(path.join(DATA_DIR,file),JSON.stringify(record)+'\n');
}

export async function readRecords<T>(file:string):Promise<T[]>{
  try{return (await readFile(path.join(DATA_DIR,file),'utf8')).split('\n').filter(Boolean).map(l=>JSON.parse(l) as T).reverse()}catch{return []}
}
