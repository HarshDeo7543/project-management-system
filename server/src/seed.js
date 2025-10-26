const { sequelize, User, Project, Task } = require('./models');

async function seed() {
  try {
    await sequelize.sync({ alter: true });
    const adminEmail = 'admin@example.com';
    let admin = await User.findOne({ where: { email: adminEmail } });
    if (!admin) {
      admin = await User.create({ name: 'Admin', email: adminEmail, password: 'password', role: 'Admin' });
      console.log('Created admin:', admin.email);
    }

    // create sample project
    const project = await Project.create({ name: 'Sample Project', description: 'A sample project for demo' });
    const dev = await User.create({ name: 'Dev One', email: 'dev1@example.com', password: 'password', role: 'Developer' });
    const pm = await User.create({ name: 'PM One', email: 'pm@example.com', password: 'password', role: 'ProjectManager' });

    await project.addTeamMembers([dev, pm]);

    await Task.create({ title: 'Initial task', description: 'Do the initial setup', status: 'To Do', assignedToId: dev.id, projectId: project.id });

    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
