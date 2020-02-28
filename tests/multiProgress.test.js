const assert = require('assert');
const progress = require('../modules/multiProgress');

describe('test multiprogress', _ => {

  it('should do single download', done => {
    const bar = progress.add(1000);
    let percent = 0;
    const int = setInterval(_ => {
      percent += 0.1;
      bar(percent);

      if (percent >= 1) {
        clearInterval(int);
        progress.clear();
        done();
      }
    }, 100);
  });

  it('should do dual downloads', done => {
    const bar = progress.add(1000);
    const bar2 = progress.add(1000);
    let percent = 0;
    const int = setInterval(_ => {
      percent += 0.1;
      bar(percent);
      bar2(percent);

      if (percent >= 1) {
        progress.clear();
        clearInterval(int);
        done();
      }
    }, 100);
  });

  it('should do triple downloads', done => {
    const bar = progress.add(1000);
    const bar2 = progress.add(1000);
    const bar3 = progress.add(2000);
    let percent = 0;
    const int = setInterval(_ => {
      percent += 0.1;
      bar(percent);
      bar2(percent);
      bar3(percent);

      if (percent >= 1) {
        progress.clear();
        clearInterval(int);
        done();
      }
    }, 100);
  });

});