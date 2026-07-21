const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'src', 'models');
const migrationsDir = path.join(__dirname, 'src', 'migrations');

// Fix models
const models = [
  { name: 'homework.js', assoc: "Homework.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });\n      Homework.hasMany(models.HomeworkSubmission, { foreignKey: 'homeworkId', as: 'submissions' });" },
  { name: 'homeworksubmission.js', assoc: "HomeworkSubmission.belongsTo(models.Homework, { foreignKey: 'homeworkId', as: 'homework' });\n      HomeworkSubmission.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });" },
  { name: 'test.js', assoc: "Test.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });\n      Test.hasMany(models.TestQuestion, { foreignKey: 'testId', as: 'questions' });\n      Test.hasMany(models.TestAttempt, { foreignKey: 'testId', as: 'attempts' });" },
  { name: 'testquestion.js', assoc: "TestQuestion.belongsTo(models.Test, { foreignKey: 'testId', as: 'test' });" },
  { name: 'testattempt.js', assoc: "TestAttempt.belongsTo(models.Test, { foreignKey: 'testId', as: 'test' });\n      TestAttempt.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });" },
  { name: 'material.js', assoc: "Material.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });" },
];

models.forEach(m => {
  const filepath = path.join(modelsDir, m.name);
  if (fs.existsSync(filepath)) {
    let content = fs.readFileSync(filepath, 'utf8');
    
    // add associations
    content = content.replace(/\/\/ define association here/, m.assoc);
    
    // add id to model attributes
    content = content.replace(/(Model\.init\(\{)/, `$1\n    id: {\n      type: DataTypes.UUID,\n      defaultValue: DataTypes.UUIDV4,\n      primaryKey: true,\n      allowNull: false\n    },`);
    
    fs.writeFileSync(filepath, content);
  }
});

// Fix migrations
const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.includes('create-'));
migrationFiles.forEach(f => {
  const filepath = path.join(migrationsDir, f);
  let content = fs.readFileSync(filepath, 'utf8');
  if (content.includes('autoIncrement: true,')) {
    content = content.replace(/autoIncrement: true,\n\s+primaryKey: true,\n\s+type: Sequelize.INTEGER/g, 
      "primaryKey: true,\n        type: Sequelize.UUID,\n        defaultValue: Sequelize.UUIDV4");
    fs.writeFileSync(filepath, content);
  }
});
console.log('Fixed models and migrations');
