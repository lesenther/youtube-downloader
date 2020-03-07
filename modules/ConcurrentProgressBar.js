const ProgressBar = require('progress');

class ConcurrentProgressBar {

  constructor(size = false) {
    this.bar = false;
    this.downloads = [];
    this.id = 0;
    this.totalSize = 0;

    if (size && size > 0) {
      this.add(size);
    }
  }

  add(size) {
    const id = ++this.id;
    this.totalSize += size;

    this.downloads.push({
      id,
      size,
      percent: 0
    });

    this.bar = new ProgressBar(`downloading ${id} video${id>1?'s':''} [:bar] :rate/bps :percent :etas`, {
      complete: '█',
      incomplete: '░',
      total: this.totalSize
    });

    this.update(id);

    return id;
  }

  update(id, percent = 0) {
    // Update the proper record
    const record = this.downloads.find(object => object.id == id);

    if (!record) {
      throw new Error(`Record not found:  ${id}`);
    }

    record.percent = percent;

    // Recalculate weighed total
    const partial = this.downloads
    .map(download => download.size * download.percent)
    .reduce((a, b) => a + b, 0);

    // Update the progress bar
    this.bar.update(partial/this.totalSize);

    return record;
  }

  clear() {
    this.bar = false;
    this.downloads = [];
    this.id = 0;
    this.totalSize = 0;
  }
}

module.exports = ConcurrentProgressBar;