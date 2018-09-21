'use strict';

const meow = require('meow');
const execa = require('execa');
const fs = require('fs-extra');
const cpy = require('cpy');
const chokidar = require('chokidar')
const del = require('del');
const buildPkgJson = require('ngm-cli/tasks/npm/build-pkg-json.task');
const src = 'src';
const tmp = '.tmp';
const dist = 'dist';

let flags = {};

async function buildAll() {
  if (flags.watch) {
    console.log(`WATCH MODE ENABLED \n`);
  }

  fs.copySync(src, tmp);

  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist);
  }

  buildPkgJson.buildPkgJson({ src: tmp, dist: dist });
  cpy(['*.md', 'LICENSE'], dist);

  del(tmp);
  await execa.shell(`npm run link`, { preferLocal: true });

  const requiredModules = ['collapse', 'chronos', 'utils', 'positioning', 'component-loader', 'dropdown', 'locale', 'alert', 'buttons', 'carousel', 'mini-ngrx', 'modal', 'pagination', 'popover', 'progressbar', 'rating', 'sortable', 'tabs', 'timepicker', 'tooltip', 'typeahead', 'datepicker'];
  await buildModules(requiredModules);

  console.log('Building accordion module');
  await execa.shell(`npm run build.accordion`, { preferLocal: true });
}

const cli = meow(`
	Options
	  --watch Rebuild on source change
`, {
  flags: {
    watch: {
      type: 'boolean'
    }
  }
});
flags = cli.flags;

if (flags.watch) {
  chokidar.watch(src, {ignored: /(^|[\/\\])\../}).on('change', (event) => {
    console.log(event);
    buildAll();
  });

  return;
}

buildAll();

async function buildModules(modules) {
  for (let module of modules) {
    console.log('Building', module, 'module');
    await execa(`ng-packagr -p src/${module}`, { shell: true });
  }
}