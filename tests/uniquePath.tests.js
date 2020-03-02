const assert = require('assert');
const uniquePath = require('../modules/uniquePath');

const { join } = require('path')

let newPath, result;

describe('test uniquepath', _ => {

  it('should not generate a uniquepath', done => {
    newPath = join(__dirname, 'bro.txt');
    result = uniquePath(newPath);

    assert.equal(newPath, result);
    done();
  });

  it('should generate a uniquepath', done => {
    newPath = __filename;
    result = uniquePath(newPath);

    assert.notEqual(newPath, result);
    done();
  });

});