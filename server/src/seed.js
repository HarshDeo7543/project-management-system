const { sequelize, User, Project, Task, Team } = require('./models');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // Use force to drop and recreate tables for clean seed
    const adminEmail = 'admin@example.com';
    let admin = await User.findOne({ where: { email: adminEmail } });
    if (!admin) {
      admin = await User.create({ name: 'Admin', email: adminEmail, password: 'password', role: 'Admin' });
      console.log('Created admin:', admin.email);
    }

    // Create sample team
    const team = await Team.create({ name: 'Sample Team' });

    // Create sample project and associate with team
    const project = await Project.create({ name: 'Sample Project', description: 'A sample project for demo', teamId: team.id });

    // Create users
    const dev = await User.create({ name: 'Dev One', email: 'dev1@example.com', password: 'password', role: 'Developer' });
    const pm = await User.create({ name: 'PM One', email: 'pm@example.com', password: 'password', role: 'ProjectManager' });

    // Add users to the team
    await team.addMembers([dev, pm]);

    // Create sample task
    await Task.create({ title: 'Initial task', description: 'Do the initial setup', status: 'To Do', assignedToId: dev.id, projectId: project.id });

    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
