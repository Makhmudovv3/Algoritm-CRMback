const fs = require('fs');
const path = require('path');
const { sequelize } = require('./src/models');

(async () => {
  try {
    const models = sequelize.models;
    let modelDocs = [];
    
    for (const modelName of Object.keys(models)) {
      const model = models[modelName];
      let attrs = [];
      for (const attrName in model.rawAttributes) {
        attrs.push(attrName);
      }
      let assocs = [];
      for (const assocName in model.associations) {
        assocs.push(`${model.associations[assocName].associationType} ${model.associations[assocName].target.name} (as ${assocName})`);
      }
      modelDocs.push({
        name: modelName,
        attributes: attrs,
        associations: assocs
      });
    }
    fs.writeFileSync('modelDocs.json', JSON.stringify(modelDocs, null, 2));
    console.log('Model documentation extracted');
    process.exit();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
