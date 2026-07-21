const fs = require('fs');
const path = require('path');

function getRoutes(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getRoutes(path.join(dir, file), fileList);
    } else if (file.endsWith('.js')) {
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      const routeRegex = /router\.(get|post|put|delete|patch)\((['"`])(.*?)\2/g;
      let match;
      while ((match = routeRegex.exec(content)) !== null) {
        fileList.push({
          method: match[1].toUpperCase(),
          route: match[3],
          file: file
        });
      }
    }
  }
  return fileList;
}

const routes = getRoutes('./src/routes');
fs.writeFileSync('routeDocs.json', JSON.stringify(routes, null, 2));
console.log('Routes extracted');
