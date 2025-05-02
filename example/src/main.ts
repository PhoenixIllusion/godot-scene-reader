import { try_open_bin_resource } from 'godot-scene-reader/parse/binary/resource.js';
import './style.css'
import { dump_cyclic_to_link } from 'godot-scene-reader/extras/dump.js';
import { parse_text_resource } from 'godot-scene-reader/parse/index.js';
import { dump_pck_file } from 'godot-scene-reader/extras/create_tar.js';

const input = document.getElementById('file-input') as HTMLInputElement;
const out = document.getElementById('app') as HTMLDivElement;
input.onchange = parseFile;

function parseFile(this: GlobalEventHandlers, ev: Event) {
  const $this = this as HTMLInputElement;
  const file = $this.files?.item(0);
  if(file) {
    out.innerHTML = '';
    switch(file.name.split('.').pop()) {
      case 'scn':
      case 'res':
        dumpBinaryFile(file);
        break;
      case 'tscn':
      case 'tres':
        dumpTextFile(file);
        break;
      case 'pck':
        dumpPackFile(file);
    }
  }
}

function dump_out(anchor: HTMLAnchorElement, json: string) {
  const container = document.createElement('pre');
  container.innerText = json;
  out.append(anchor, container);
}

async function dumpBinaryFile(file: File ) {
  const data = await try_open_bin_resource(file.name, await file.arrayBuffer(), false, false)
  const { anchor, json } = dump_cyclic_to_link(file.name, data);
  dump_out(anchor, json);
}
async function dumpTextFile(file: File ) {
  const data = await parse_text_resource(await file.text())
  const { anchor, json } = dump_cyclic_to_link(file.name, data);
  dump_out(anchor, json);
}

async function dumpPackFile(file: File ) {
  dump_pck_file(out, file.name, await file.arrayBuffer())
}
