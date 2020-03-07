const assert = require('assert');
const Progress = require('../modules/ConcurrentProgressBar');
const progress = new Progress();

describe('test multiprogress', _ => {

  it('should do single download', done => {
    const bar1 = progress.add(1000);

    let percent1 = 0;

    const int = setInterval(_ => {
      percent1 += 0.1;
      progress.update(bar1, percent1);

      if (percent1 >= 1) {
        clearInterval(int);
        progress.clear();
        done();
      }
    }, 100);
  });

  it('should do dual downloads', done => {
    const bar1 = progress.add(1000);
    const bar2 = progress.add(2000);

    let percent1 = 0, percent2 = 0;

    const int = setInterval(_ => {
      if (percent1 < 1) percent1 += 0.1;
      if (percent2 < 1) percent2 += 0.05;

      progress.update(bar1, percent1);
      progress.update(bar2, percent2);

      if (percent1 >= 1 && percent2 >= 1) {
        clearInterval(int);
        progress.clear();
        done();
      }
    }, 50);
  });

  it('should do triple downloads', done => {
    const bar1 = progress.add(1000);
    const bar2 = progress.add(2000);
    const bar3 = progress.add(4000);

    let percent1 = 0, percent2 = 0, percent3 = 0;

    const int = setInterval(_ => {
      if (percent1 < 1) percent1 += 0.1;
      if (percent2 < 1) percent2 += 0.05;
      if (percent3 < 1) percent3 += 0.01;

      progress.update(bar1, percent1);
      progress.update(bar2, percent2);
      progress.update(bar3, percent3);

      if (percent1 >= 1 && percent2 >= 1 && percent3 >= 1) {
        clearInterval(int);
        progress.clear();
        done();
      }
    }, 10);
  });

});