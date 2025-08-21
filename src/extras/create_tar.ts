import { try_open_pack } from '../pck/parser.js';
import { process_pck_file } from '../process/pck.js';

import { createTar } from 'nanotar';
import { dump_cyclic_to_link } from './dump.js';

export async function dump_pck_file(root: HTMLElement, path: string, buffer: ArrayBuffer) {

  // @ts-ignore
  const pack = await process_pck_file(try_open_pack(path, buffer));

  const files: { name: string, data: any }[] = [];
  const ul = document.createElement("ul");
  const addEntry = (path: string, data: any) => {
    const { anchor, json } = dump_cyclic_to_link(path, data);
    files.push({ name: path + ".json", data: json });
    const view = document.createElement('a');
    view.innerText = '(Open in new Window)';
    view.href = anchor.href;
    view.target = '_blank';
    const li = document.createElement('li');
    li.textContent = path + '.json';
    li.append(anchor, view);
    ul.appendChild(li);
  }

  const proj = pack.project
  if (proj) {
    addEntry('project.binary', proj);
  }
  for (var v in pack.resources) {
    addEntry(v, pack.resources[v])
  }
  for (var v in pack.gdc) {
    addEntry(v, pack.gdc[v])
  }
  const blob = new Blob([createTar(files)]);
  const link = document.createElement('a');
  link.innerText = `${path}.tar`;
  link.download = `${path}.tar`;
  root.appendChild(link);
  root.appendChild(ul);
  link.href = URL.createObjectURL(blob);
}
