import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve, relative, sep, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const portable = join(root, 'workspace', 'portable');
const expectedGroups = ['library', 'documents', 'narrative', 'voice', 'world', 'wiki', 'timeline', 'knowledge', 'taxonomy', 'editorial', 'ideas', 'metrics', 'publication', 'assets'];
const records = new Map();
const problems = [];
let jsonFiles = 0;
let jsonlRecords = 0;

async function walk(dir) {
  const results = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const target = join(dir, item.name);
    if (item.isDirectory()) results.push(...await walk(target));
    else if (item.isFile()) results.push(target);
  }
  return results;
}

function add(record, path) {
  if (typeof record?.id !== 'string') return;
  if (records.has(record.id)) problems.push(`Duplicate ID ${record.id}: ${records.get(record.id).path} and ${path}`);
  else records.set(record.id, { record, path });
}

const files = await walk(portable);
for (const path of files) {
  if (extname(path) === '.json') {
    jsonFiles++;
    try { add(JSON.parse(await readFile(path, 'utf8')), relative(portable, path)); }
    catch (error) { problems.push(`Invalid JSON ${path}: ${error.message}`); }
  } else if (extname(path) === '.jsonl') {
    const lines = (await readFile(path, 'utf8')).split(/\r?\n/).filter(Boolean);
    for (const [index, line] of lines.entries()) {
      try { add(JSON.parse(line), `${relative(portable, path)}:${index + 1}`); jsonlRecords++; }
      catch (error) { problems.push(`Invalid JSONL ${path}:${index + 1}: ${error.message}`); }
    }
  }
}

for (const group of expectedGroups) {
  try { if (!(await stat(join(portable, group))).isDirectory()) problems.push(`Group not directory: ${group}`); }
  catch { problems.push(`Missing group directory: ${group}`); }
}

function checkRef(owner, field, target) {
  if (target !== undefined && !records.has(target)) problems.push(`${owner}: ${field} points to missing ${target}`);
}

const documents = new Map();
for (const [id, { record }] of records) {
  for (const key of ['storyId', 'volumeId', 'documentId', 'entityId', 'eventId', 'holderId', 'subjectId', 'arcId', 'targetId']) checkRef(id, key, record[key]);
  for (const key of ['volumeIds', 'participantIds']) for (const target of record[key] ?? []) checkRef(id, key, target);
  if (record.sourceRef?.documentId) checkRef(id, 'sourceRef.documentId', record.sourceRef.documentId);
  if (record.kind !== 'document') continue;
  const bodyPath = record.bodyPath;
  if (typeof bodyPath !== 'string') { problems.push(`${id}: missing bodyPath`); continue; }
  const absolute = resolve(portable, bodyPath);
  if (absolute === portable || !absolute.startsWith(portable + sep)) { problems.push(`${id}: unsafe body path`); continue; }
  try {
    const body = await readFile(absolute);
    const sha256 = createHash('sha256').update(body).digest('hex');
    if (record.bodySha256 && sha256 !== record.bodySha256) problems.push(`${id}: bodySha256 mismatch`);
    const paragraphs = body.toString('utf8').split(/\n\s*\n/).map(s => s.trim()).filter(s => s && !/^#{1,6}\s/.test(s));
    documents.set(id, { sha256, paragraphs });
  } catch (error) { problems.push(`${id}: unreadable body: ${error.message}`); }
}

for (const [id, { record }] of records) {
  const source = record.sourceRef;
  if (source?.documentId && source?.paragraphId) {
    const list = documents.get(source.documentId)?.paragraphs;
    const index = /^p(\d{3})$/.exec(source.paragraphId);
    if (!index || !list || !list[Number(index[1]) - 1]) problems.push(`${id}: invalid paragraph anchor ${source.paragraphId}`);
  }
  if (record.kind === 'chapter') {
    const volume = records.get(record.volumeId)?.record;
    if (volume?.storyId !== record.storyId) problems.push(`${id}: volume from different story`);
    const sourceDoc = records.get(record.documentId)?.record;
    if (sourceDoc?.kind !== 'document') problems.push(`${id}: documentId does not point to a Document`);
  }
  if (record.arcId && record.targetId) {
    if (records.get(record.arcId)?.record?.kind !== 'arc') problems.push(`${id}: invalid ArcLink source`);
    if (records.get(record.targetId)?.record?.kind !== record.targetKind) problems.push(`${id}: target kind differs from ${record.targetKind}`);
  }
}

const manifest = JSON.parse(await readFile(join(portable, 'manifest.json'), 'utf8'));
const workspace = JSON.parse(await readFile(join(root, 'workspace', 'altair-workspace.json'), 'utf8'));
if (manifest.workspaceId !== workspace.workspaceId) problems.push('workspaceId mismatch');
if (manifest.format !== 'altair-portable-fixture') problems.push('Unknown portable format');
for (const group of expectedGroups) if (!Object.values(manifest.groups).includes(group)) problems.push(`Manifest missing group ${group}`);

const scenario = JSON.parse(await readFile(join(root, 'workspace', 'scenarios', 'ui-states.json'), 'utf8'));
for (const item of scenario.examples) {
  if (item.scopeId !== workspace.workspaceId) checkRef(item.id, 'scopeId', item.scopeId);
}

if (problems.length) {
  for (const error of problems) console.error('FAIL:', error);
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ status: 'PASS', groups: expectedGroups.length, records: records.size, jsonFiles, jsonlRecords, documents: documents.size, sourceSha256: Object.fromEntries([...documents].map(([id, value]) => [id, value.sha256])) }, null, 2));
}
