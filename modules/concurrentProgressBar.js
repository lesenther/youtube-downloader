const ProgressBar = require('progress');

const concurrentProgressBar = (_ => {
  let totalSize = null;
  let id = 0;
  let bar = null;
  let downloads = [];

  function create(size) {
    if (bar) {
      bar.terminate();
    }

    totalSize += size;
    id++;

    downloads.push({
      id,
      size,
      percent: 0
    });

    bar = new ProgressBar(`  downloading ${id} videos [:bar] :rate/bps :percent :etas`, {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: totalSize
    });

    return id;
  }

  function update(id, percent) {
    downloads.find(download => download.id === id).percent = percent;
    const partial = downloads
    .map(download => download.size * download.percent)
    .reduce((a, b) => a + b, 0);
    bar.update(partial/totalSize);
  }

  return {
    add: size => {
      const id = create(size);

      return percent => update(id, percent)
    },
    clear: _ => {
      if (bar) {
        bar.terminate();
      }

      totalSize = 0;
      downloads = [];
      id = 0;
    }
  };
})();

module.exports = concurrentProgressBar;