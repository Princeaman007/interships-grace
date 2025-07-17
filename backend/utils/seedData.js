const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Internship = require('../models/Internship');
const Application = require('../models/Application');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Sample users data
const users = [
  {
    name: 'Admin Nexaid',
    email: 'admin@nexaid.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Google France',
    email: 'hr@google.com',
    password: 'password123',
    role: 'company',
    companyName: 'Google France',
    industry: 'Technology',
    website: 'https://google.fr',
    location: 'Paris, France',
    companySize: '200+',
    description: 'Global technology leader and innovation company.'
  },
  {
    name: 'Microsoft France',
    email: 'internships@microsoft.com',
    password: 'password123',
    role: 'company',
    companyName: 'Microsoft France',
    industry: 'Technology',
    website: 'https://microsoft.fr',
    location: 'Paris, France',
    companySize: '200+',
    description: 'Global technology company specializing in software and cloud services.'
  },
  {
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    password: 'password123',
    role: 'student',
    university: 'University of Paris-Sorbonne',
    studyLevel: 'Master',
    studyField: 'Computer Science',
    graduationYear: 2024,
    location: 'Paris, France'
  },
  {
    name: 'Pierre Martin',
    email: 'pierre.martin@email.com',
    password: 'password123',
    role: 'student',
    university: 'ESCP Business School',
    studyLevel: 'Master',
    studyField: 'Marketing',
    graduationYear: 2024,
    location: 'Lyon, France'
  }
];

// Sample internships data
const internships = [
  {
    title: 'Full Stack Developer Internship',
    company: 'Google France',
    location: 'Paris, France',
    description: 'Join our development team to create innovative web applications. You will work on high-impact user-facing projects.',
    requirements: 'Computer Science student, knowledge of JavaScript, React, Node.js',
    responsibilities: 'Web application development, code reviews, collaboration with UX/UI team',
    benefits: '€1200/month stipend, meal vouchers, access to internal training',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    applicationDeadline: new Date('2024-05-15'),
    salary: '€1200/month',
    category: 'Development',
    jobType: ['Full-time', 'On-site'],
    experience: 'Beginner',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    isUrgent: true,
    isFeatured: true,
    status: 'active'
  },
  {
    title: 'Digital Marketing Internship',
    company: 'Microsoft France',
    location: 'Paris, France',
    description: 'Participate in developing digital marketing strategies for our cloud products. A unique opportunity to learn in a cutting-edge tech environment.',
    requirements: 'Marketing/Business student, passion for digital, fluent English',
    responsibilities: 'Marketing content creation, social media management, performance analysis',
    benefits: '€1000/month stipend, partial remote work, personalized mentoring',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-09-30'),
    applicationDeadline: new Date('2024-06-01'),
    salary: '€1000/month',
    category: 'Marketing',
    jobType: ['Full-time', 'Hybrid'],
    experience: 'Beginner',
    skills: ['Digital Marketing', 'SEO', 'Google Analytics', 'Social Media'],
    isUrgent: false,
    isFeatured: true,
    status: 'active'
  },
  {
    title: 'UX/UI Designer Internship',
    company: 'Google France',
    location: 'Paris, France',
    description: 'Design exceptional user experiences for our consumer products. Work alongside senior designers on innovative projects.',
    requirements: 'Design student, creative portfolio, proficiency in design tools (Figma, Sketch)',
    responsibilities: 'Wireframe creation, prototyping, user testing, collaboration with developers',
    benefits: '€1100/month stipend, cutting-edge equipment, continuous training',
    startDate: new Date('2024-06-15'),
    endDate: new Date('2024-09-15'),
    applicationDeadline: new Date('2024-05-30'),
    salary: '€1100/month',
    category: 'Design',
    jobType: ['Full-time', 'On-site'],
    experience: '1 year',
    skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping'],
    isUrgent: false,
    isFeatured: false,
    status: 'active'
  },
  {
    title: 'Data Analyst Internship',
    company: 'Microsoft France',
    location: 'Paris, France',
    description: 'Analyze data to help strategic decision-making. Discover the world of data science in a leading company.',
    requirements: 'Mathematics/Statistics student, Python/R knowledge, curiosity for data',
    responsibilities: 'Data analysis, dashboard creation, results presentation',
    benefits: '€1050/month stipend, access to Microsoft tools, impactful project',
    startDate: new Date('2024-07-15'),
    endDate: new Date('2024-10-15'),
    applicationDeadline: new Date('2024-06-15'),
    salary: '€1050/month',
    category: 'Finance',
    jobType: ['Full-time', 'Hybrid'],
    experience: 'Beginner',
    skills: ['Python', 'R', 'SQL', 'Power BI', 'Excel'],
    isUrgent: false,
    isFeatured: false,
    status: 'active'
  },
  {
    title: 'Community Manager Internship',
    company: 'Google France',
    location: 'Paris, France',
    description: 'Manage Google\'s presence on French social media. Create engaging content and interact with our community.',
    requirements: 'Communication student, creativity, excellent written French',
    responsibilities: 'Social media management, content creation, community management',
    benefits: '€950/month stipend, flexible hours, exclusive events',
    startDate: new Date('2024-08-01'),
    endDate: new Date('2024-11-30'),
    applicationDeadline: new Date('2024-07-01'),
    salary: '€950/month',
    category: 'Marketing',
    jobType: ['Full-time', 'Remote'],
    experience: 'Beginner',
    skills: ['Social Media', 'Content Creation', 'Community Management', 'Adobe'],
    isUrgent: true,
    isFeatured: false,
    status: 'active'
  }
];

// Import data
const importData = async () => {
  try {
    // Delete existing data
    await User.deleteMany();
    await Internship.deleteMany();
    await Application.deleteMany();
    
    // Create users
    const createdUsers = await User.create(users);
    console.log('✅ Users created');
    
    // Get companies for internships
    const companies = createdUsers.filter(user => user.role === 'company');
    
    // Associate internships with companies
    const internshipsWithCompany = internships.map((internship, index) => ({
      ...internship,
      companyId: companies[index % companies.length]._id,
      postedBy: companies[index % companies.length]._id
    }));
    
    // Create internships
    await Internship.create(internshipsWithCompany);
    console.log('✅ Internships created');
    
    console.log('🎉 Data imported successfully!');
    console.log('\n📧 Test accounts:');
    console.log('Admin: admin@nexaid.com / password123');
    console.log('Company 1: hr@google.com / password123');
    console.log('Company 2: internships@microsoft.com / password123');
    console.log('Student 1: marie.dubois@email.com / password123');
    console.log('Student 2: pierre.martin@email.com / password123');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

// Delete data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Internship.deleteMany();
    await Application.deleteMany();
    
    console.log('🗑️ Data destroyed');
    process.exit();
  } catch (error) {
    console.error('❌ Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}