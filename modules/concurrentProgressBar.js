const ProgressBar = require('progress');

const concurrentProgressBar = (_ => {
  let totalSize = 0;
  let id = 0;
  let bar = false;
  let downloads = [];

  /**
   *
   * @param {*} size
   */
  function add(size) {
    totalSize += size;
    id++;

    downloads.push({
      id,
      size,
      percent: 0
    });

    bar = new ProgressBar(`  downloading ${id} video${id>1?'s':''} [:bar] :rate/bps :percent :etas`, {
      complete: '█',
      incomplete: '░',
      width: 40,
      total: totalSize
    });

    update(id);

    return id;
  }

  /**
   *
   * @param {*} id
   * @param {*} percent
   */
  function update(id, percent = 0) {
    // Update the proper record
    const record = downloads.find(object => object.id == id);

    if (!record) {
      throw new Error(`Record not found:  ${id}`);
    }

    record.percent = percent;

    // Recalculate weighed total
    const partial = downloads
    .map(download => download.size * download.percent)
    .reduce((a, b) => a + b, 0);

    // Update the progress bar
    bar.update(partial/totalSize);

    return record;
  }

  return {
    add: size => {
      const id = add(size);

      return percent => update(id, percent)
    },
    clear: _ => {
      bar = false;
      totalSize = 0;
      downloads = [];
      id = 0;
    }
  };
})();

module.exports = concurrentProgressBar;