const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Class = require('./models/Class');
const Subject = require('./models/Subject');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Create comprehensive test data
const createTestData = async () => {
    try {
        console.log('Creating comprehensive test data...');

        // Create subjects
        const mathSubject = await Subject.findOne({ code: 'MATH101' }) || await Subject.create({
            name: 'Mathematics',
            code: 'MATH101',
            description: 'Basic Mathematics'
        });

        const scienceSubject = await Subject.findOne({ code: 'SCI101' }) || await Subject.create({
            name: 'Science',
            code: 'SCI101',
            description: 'Basic Science'
        });

        const englishSubject = await Subject.findOne({ code: 'ENG101' }) || await Subject.create({
            name: 'English',
            code: 'ENG101',
            description: 'Basic English'
        });

        console.log('Subjects created...');

        // Create classes
        const class1 = await Class.findOne({ name: 'Class 1A' }) || await Class.create({
            name: 'Class 1A',
            grade: 'Grade 1',
            section: 'A',
            teacherIds: [], // Will be updated when teacher is created
            subjectIds: [mathSubject._id, scienceSubject._id, englishSubject._id]
        });

        const class2 = await Class.findOne({ name: 'Class 2B' }) || await Class.create({
            name: 'Class 2B',
            grade: 'Grade 2',
            section: 'B',
            teacherIds: [],
            subjectIds: [mathSubject._id, scienceSubject._id, englishSubject._id]
        });

        console.log('Classes created...');

        // Create Teacher
        const teacherExists = await User.findOne({ email: 'teacher@example.com' });
        let teacher;
        if (!teacherExists) {
            teacher = await User.create({
                name: 'John Teacher',
                email: 'teacher@example.com',
                password: 'password123',
                role: 'Teacher',
                active: true,
                phone: '1234567890',
                address: '123 Teacher Lane',
                specialization: [mathSubject._id, scienceSubject._id]
            });
            console.log('Teacher created...');
        } else {
            teacher = teacherExists;
            console.log('Teacher already exists...');
        }

        // Assign teacher to class
        class1.teacherIds.push(teacher._id);
        await class1.save();

        // Create Parent
        const parentExists = await User.findOne({ email: 'parent@example.com' });
        let parent;
        if (!parentExists) {
            parent = await User.create({
                name: 'Mary Parent',
                email: 'parent@example.com',
                password: 'password123',
                role: 'Parent',
                active: true,
                phone: '0987654321',
                address: '456 Parent Street'
            });
            console.log('Parent created...');
        } else {
            parent = parentExists;
            console.log('Parent already exists...');
        }

        // Create Students
        const student1Exists = await User.findOne({ email: 'student@example.com' });
        let student1;
        if (!student1Exists) {
            student1 = await User.create({
                name: 'Alice Student',
                email: 'student@example.com',
                password: 'password123',
                role: 'Student',
                active: true,
                phone: '5551234567',
                address: '789 Student Ave',
                parentId: parent._id,
                classId: class1._id,
                dateOfBirth: new Date('2010-01-01'),
                enrollmentDate: new Date('2023-09-01')
            });
            console.log('Student 1 created...');
        } else {
            student1 = student1Exists;
            console.log('Student 1 already exists...');
        }

        // Create second student for the same parent
        const student2Exists = await User.findOne({ email: 'student2@example.com' });
        let student2;
        if (!student2Exists) {
            student2 = await User.create({
                name: 'Bob Student',
                email: 'student2@example.com',
                password: 'password123',
                role: 'Student',
                active: true,
                phone: '5551234568',
                address: '789 Student Ave',
                parentId: parent._id,
                classId: class2._id,
                dateOfBirth: new Date('2011-01-01'),
                enrollmentDate: new Date('2023-09-01')
            });
            console.log('Student 2 created...');
        } else {
            student2 = student2Exists;
            console.log('Student 2 already exists...');
        }

        console.log('✅ Comprehensive test data created successfully!');
        console.log('Test Users:');
        console.log('- Admin: admin@school.com / password123');
        console.log('- Teacher: teacher@example.com / password123');
        console.log('- Parent: parent@example.com / password123');
        console.log('- Student 1: student@example.com / password123');
        console.log('- Student 2: student2@example.com / password123');
        
        process.exit();
    } catch (err) {
        console.error('Error creating test data:', err);
        process.exit(1);
    }
};

// Delete all test data
const deleteTestData = async () => {
    try {
        console.log('Deleting comprehensive test data...');
        
        await User.deleteMany({ email: { $in: [
            'teacher@example.com',
            'parent@example.com',
            'student@example.com',
            'student2@example.com'
        ]}});
        
        await Class.deleteMany({ name: { $in: ['Class 1A', 'Class 2B'] }});
        await Subject.deleteMany({ code: { $in: ['MATH101', 'SCI101', 'ENG101'] }});
        
        console.log('✅ Test data deleted successfully!');
        process.exit();
    } catch (err) {
        console.error('Error deleting test data:', err);
        process.exit(1);
    }
};

// Run the appropriate function based on command line argument
if (process.argv[2] === '-i') {
    createTestData();
} else if (process.argv[2] === '-d') {
    deleteTestData();
} else {
    console.log('Usage:');
    console.log('  node seeder-comprehensive.js -i    (create comprehensive test data)');
    console.log('  node seeder-comprehensive.js -d    (delete comprehensive test data)');
    process.exit();
}