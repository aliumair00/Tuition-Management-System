const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Class = require('./src/models/Class');
const Subject = require('./src/models/Subject');
const Result = require('./src/models/Result');
const Attendance = require('./src/models/Attendance');
const Exam = require('./src/models/Exam');
const bcrypt = require('bcryptjs');

dotenv.config({ path: './.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME
});

const seedData = async () => {
    try {
        console.log('🌱 Starting comprehensive data seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Class.deleteMany({});
        await Subject.deleteMany({});
        await Result.deleteMany({});
        await Attendance.deleteMany({});
        console.log('🗑️  Existing data cleared...');

        // Create Admin
        const adminExists = await User.findOne({ email: 'admin@school.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin User',
                email: 'admin@school.com',
                password: await bcrypt.hash('password123', 10),
                role: 'Admin',
                active: true,
                phone: '1234567890',
                address: '123 Admin Street'
            });
            console.log('👨‍💼 Admin created...');
        }

        // Create Classes
        const class10A = await Class.create({
            name: '10-A',
            grade: '10',
            section: 'A',
            academicYear: '2024-2025',
            classTeacher: null,
            subjects: []
        });

        const class10B = await Class.create({
            name: '10-B',
            grade: '10',
            section: 'B',
            academicYear: '2024-2025',
            classTeacher: null,
            subjects: []
        });

        const class9A = await Class.create({
            name: '9-A',
            grade: '9',
            section: 'A',
            academicYear: '2024-2025',
            classTeacher: null,
            subjects: []
        });

        console.log('🏫 Classes created...');

        // Create Subjects
        const math = await Subject.create({
            name: 'Mathematics',
            code: 'MATH101',
            description: 'Basic Mathematics'
        });

        const science = await Subject.create({
            name: 'Science',
            code: 'SCI101',
            description: 'General Science'
        });

        const english = await Subject.create({
            name: 'English',
            code: 'ENG101',
            description: 'English Language'
        });

        console.log('📚 Subjects created...');

        // Create Teacher
        const teacherExists = await User.findOne({ email: 'teacher@example.com' });
        let teacher;
        if (!teacherExists) {
            teacher = await User.create({
                name: 'John Teacher',
                email: 'teacher@example.com',
                password: await bcrypt.hash('password123', 10),
                role: 'Teacher',
                active: true,
                phone: '0987654321',
                address: '123 Teacher Street',
                subjects: [math._id, science._id],
                classes: [class10A._id, class10B._id]
            });
            console.log('👨‍🏫 Teacher created...');
        } else {
            teacher = teacherExists;
        }

        // Update class teachers and subjects
        class10A.teacherIds = [teacher._id];
        class10B.teacherIds = [teacher._id];
        class10A.subjectIds = [math._id, science._id, english._id];
        class10B.subjectIds = [math._id, science._id, english._id];
        class9A.subjectIds = [math._id, science._id, english._id];
        await class10A.save();
        await class10B.save();
        await class9A.save();

        // Create Parent
        const parentExists = await User.findOne({ email: 'parent@example.com' });
        let parent;
        if (!parentExists) {
            parent = await User.create({
                name: 'Mary Parent',
                email: 'parent@example.com',
                password: await bcrypt.hash('password123', 10),
                role: 'Parent',
                active: true,
                phone: '0987654321',
                address: '456 Parent Street'
            });
            console.log('👩‍👧‍👦 Parent created...');
        } else {
            parent = parentExists;
        }

        // Create Students
        const student1Exists = await User.findOne({ email: 'student@example.com' });
        let student1;
        if (!student1Exists) {
            student1 = await User.create({
                name: 'Alice Student',
                email: 'student@example.com',
                password: await bcrypt.hash('password123', 10),
                role: 'Student',
                active: true,
                phone: '1112223333',
                address: '789 Student Street',
                classId: class10A._id,
                parentId: parent._id,
                rollNumber: '1001',
                dateOfBirth: new Date('2008-01-15')
            });
            console.log('👩‍🎓 Student 1 created...');
        } else {
            student1 = student1Exists;
        }

        const student2Exists = await User.findOne({ email: 'student2@example.com' });
        let student2;
        if (!student2Exists) {
            student2 = await User.create({
                name: 'Bob Student',
                email: 'student2@example.com',
                password: await bcrypt.hash('password123', 10),
                role: 'Student',
                active: true,
                phone: '4445556666',
                address: '321 Student Avenue',
                classId: class10B._id,
                parentId: parent._id,
                rollNumber: '1002',
                dateOfBirth: new Date('2008-03-20')
            });
            console.log('👨‍🎓 Student 2 created...');
        } else {
            student2 = student2Exists;
        }

        // Create Results - we need an exam first, so let's create a simple exam
        const exam1 = await Exam.create({
            title: 'Midterm Exam',
            classId: class10A._id,
            subjectId: math._id,
            date: new Date('2024-10-15'),
            duration: 120,
            createdBy: teacher._id
        });

        const exam2 = await Exam.create({
            title: 'Midterm Exam',
            classId: class10A._id,
            subjectId: science._id,
            date: new Date('2024-10-16'),
            duration: 120,
            createdBy: teacher._id
        });

        const exam3 = await Exam.create({
            title: 'Final Exam',
            classId: class10B._id,
            subjectId: english._id,
            date: new Date('2024-12-01'),
            duration: 120,
            createdBy: teacher._id
        });

        // Create Results
        const result1 = await Result.create({
            studentId: student1._id,
            examId: exam1._id,
            marks: 85,
            grade: 'A'
        });

        const result2 = await Result.create({
            studentId: student1._id,
            examId: exam2._id,
            marks: 92,
            grade: 'A+'
        });

        const result3 = await Result.create({
            studentId: student2._id,
            examId: exam3._id,
            marks: 78,
            grade: 'B+'
        });

        console.log('📊 Results created...');

        // Create Attendance Records
        const attendance1 = await Attendance.create({
            classId: class10A._id,
            date: new Date('2024-12-01'),
            takenBy: teacher._id,
            records: [{
                studentId: student1._id,
                status: 'Present',
                note: 'On time'
            }]
        });

        const attendance2 = await Attendance.create({
            classId: class10A._id,
            date: new Date('2024-12-02'),
            takenBy: teacher._id,
            records: [{
                studentId: student1._id,
                status: 'Absent',
                note: 'Sick leave'
            }]
        });

        console.log('📅 Attendance records created...');

        console.log('✅ Comprehensive data seeding completed successfully!');
        console.log('\n📋 Summary:');
        console.log('- Admin: admin@school.com (password: password123)');
        console.log('- Teacher: teacher@example.com (password: password123)');
        console.log('- Parent: parent@example.com (password: password123)');
        console.log('- Students: student@example.com, student2@example.com (password: password123)');
        console.log('- Classes: 10-A, 10-B, 9-A');
        console.log('- Subjects: Mathematics, Science, English');
        console.log('- Exams: 3 exams created');
        console.log('- Results: 3 results created');
        console.log('- Attendance: 2 records created');

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Database connection closed.');
    }
};

seedData();