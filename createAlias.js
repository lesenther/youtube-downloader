//
const fs = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

const ALIAS_DIR = join(__dirname, 'aliases');

function createAlias(alias = 'yt', dir = ALIAS_DIR) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  switch (process.platform) {
    case 'win32':
      // Create the alias
      fs.writeFileSync(join(dir, `${alias}.cmd`), `node ${__dirname} %*`);

      // Add to path
      execSync(`setx /M path "%path%;${ALIAS_DIR}"`);
      break;

    case 'darwin': // OS X
    case 'linux': // Linux
    case 'aix': // UNIX
    case 'freebsd':
    case 'sunos':
    case 'openbsd':
      let profilePath;

      switch(process.env.SHELL) {
        case '/bin/bash':
          profilePath = join('~', '.bash_profile');
          break;
        default:
          profilePath = join('~', '.profile');
      }

      fs.appendFileSync(profilePath, `\nalias yt='node ${__dirname} $@'`);
      break;

    default:
      return Promise.reject(new Error(`The platform ${process.platform} is not supported.`))
  }


}

createAlias();