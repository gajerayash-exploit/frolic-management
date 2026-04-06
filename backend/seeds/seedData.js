/**
 * Seed Data Script for Frolic Management System
 * 
 * Run with: npm run seed
 * 
 * Creates comprehensive test data including:
 * - 8 Users (admin, students, institute/department/event coordinators)
 * - 3 Institutes
 * - 8 Departments (spread across institutes)
 * - 7 Events (spread across departments)
 * 
 * Login Credentials:
 * - Admin:                admin@frolic.com / admin123
 * - Student:              student@frolic.com / student123
 * - Institute Coord:      inst.coord@frolic.com / coord123
 * - Department Coords:    dept.coord1@frolic.com, dept.coord2@frolic.com, dept.coord3@frolic.com / coord123
 * - Event Coords:         evt.coord1@frolic.com, evt.coord2@frolic.com / coord123
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
import User from '../models/User.js';
import Institute from '../models/Institute.js';
import Department from '../models/Department.js';
import Event from '../models/Event.js';

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Institute.deleteMany({});
        await Department.deleteMany({});
        await Event.deleteMany({});

        // ─── USERS ──────────────────────────────────────────────
        console.log('👤 Creating users...');

        const admin = await User.create({
            UserName: 'Admin User',
            UserPassword: 'admin123',
            EmailAddress: 'admin@frolic.com',
            PhoneNumber: '9999999999',
            IsAdmin: true,
            Role: 'admin'
        });
        console.log(`   ✓ Admin: admin@frolic.com / admin123`);

        const student = await User.create({
            UserName: 'Rahul Sharma',
            UserPassword: 'student123',
            EmailAddress: 'student@frolic.com',
            PhoneNumber: '7777777777',
            IsAdmin: false,
            Role: 'student'
        });
        console.log(`   ✓ Student: student@frolic.com / student123`);

        // Institute Coordinator
        const instCoord = await User.create({
            UserName: 'Dr. Suresh Patel',
            UserPassword: 'coord123',
            EmailAddress: 'inst.coord@frolic.com',
            PhoneNumber: '8888888888',
            IsAdmin: false,
            Role: 'institute_coordinator'
        });
        console.log(`   ✓ Institute Coordinator: inst.coord@frolic.com / coord123`);

        // Department Coordinators (3 users)
        const deptCoord1 = await User.create({
            UserName: 'Prof. Anita Desai',
            UserPassword: 'coord123',
            EmailAddress: 'dept.coord1@frolic.com',
            PhoneNumber: '8811001100',
            IsAdmin: false,
            Role: 'department_coordinator'
        });

        const deptCoord2 = await User.create({
            UserName: 'Prof. Rajesh Kumar',
            UserPassword: 'coord123',
            EmailAddress: 'dept.coord2@frolic.com',
            PhoneNumber: '8822002200',
            IsAdmin: false,
            Role: 'department_coordinator'
        });

        const deptCoord3 = await User.create({
            UserName: 'Prof. Meena Iyer',
            UserPassword: 'coord123',
            EmailAddress: 'dept.coord3@frolic.com',
            PhoneNumber: '8833003300',
            IsAdmin: false,
            Role: 'department_coordinator'
        });
        console.log(`   ✓ Department Coordinators: Prof. Anita Desai, Prof. Rajesh Kumar, Prof. Meena Iyer`);

        // Event Coordinators (2 users)
        const evtCoord1 = await User.create({
            UserName: 'Priya Nair',
            UserPassword: 'coord123',
            EmailAddress: 'evt.coord1@frolic.com',
            PhoneNumber: '8844004400',
            IsAdmin: false,
            Role: 'event_coordinator'
        });

        const evtCoord2 = await User.create({
            UserName: 'Vikram Singh',
            UserPassword: 'coord123',
            EmailAddress: 'evt.coord2@frolic.com',
            PhoneNumber: '8855005500',
            IsAdmin: false,
            Role: 'event_coordinator'
        });
        console.log(`   ✓ Event Coordinators: Priya Nair, Vikram Singh`);

        // ─── INSTITUTES ─────────────────────────────────────────
        console.log('🏛️  Creating institutes...');

        const institute1 = await Institute.create({
            InstituteName: 'Techno University',
            InstituteDescription: 'A premier institution for technology and innovation',
            InstituteCoordinatorID: instCoord._id
        });

        const institute2 = await Institute.create({
            InstituteName: 'National Institute of Design',
            InstituteDescription: 'Leading institute for creative arts, design thinking, and multimedia'
        });

        const institute3 = await Institute.create({
            InstituteName: 'Global Business School',
            InstituteDescription: 'Top-ranked business school offering management and entrepreneurship programmes'
        });
        console.log(`   ✓ Institutes: Techno University, National Institute of Design, Global Business School`);

        // ─── DEPARTMENTS ────────────────────────────────────────
        console.log('📚 Creating departments...');

        // -- Techno University departments --
        const csDept = await Department.create({
            DepartmentName: 'Computer Science & Engineering',
            InstituteID: institute1._id,
            DepartmentCoordinatorID: deptCoord1._id
        });

        const eceDept = await Department.create({
            DepartmentName: 'Electronics & Communication',
            InstituteID: institute1._id,
            DepartmentCoordinatorID: deptCoord2._id
        });

        const mechDept = await Department.create({
            DepartmentName: 'Mechanical Engineering',
            InstituteID: institute1._id,
            DepartmentCoordinatorID: deptCoord3._id
        });

        const civilDept = await Department.create({
            DepartmentName: 'Civil Engineering',
            InstituteID: institute1._id
        });

        // -- National Institute of Design departments --
        const gfxDept = await Department.create({
            DepartmentName: 'Graphic Design',
            InstituteID: institute2._id
        });

        const animDept = await Department.create({
            DepartmentName: 'Animation & Multimedia',
            InstituteID: institute2._id
        });

        // -- Global Business School departments --
        const mbaDept = await Department.create({
            DepartmentName: 'MBA - Marketing',
            InstituteID: institute3._id
        });

        const finDept = await Department.create({
            DepartmentName: 'MBA - Finance',
            InstituteID: institute3._id
        });

        console.log(`   ✓ 8 Departments created across 3 institutes`);

        // ─── EVENTS ─────────────────────────────────────────────
        console.log('🎉 Creating events...');

        await Event.create({
            EventName: 'Code Sprint',
            Tagline: 'Race to the finish line with your code!',
            Description: 'A 24-hour hackathon where teams compete to build innovative solutions. Showcase your coding skills and creativity!',
            GroupMinParticipants: 2,
            GroupMaxParticipants: 4,
            Fees: 200,
            Prizes: '1st: ₹10,000 | 2nd: ₹5,000 | 3rd: ₹2,500',
            DepartmentID: csDept._id,
            EventCoordinatorID: evtCoord1._id,
            Location: 'Computer Lab Block A',
            MaxGroupsAllowed: 30,
            EventDate: '2026-04-15',
            EventTime: '09:00'
        });

        await Event.create({
            EventName: 'RoboWars',
            Tagline: 'Build. Battle. Conquer.',
            Description: 'Design and build robots that will battle it out in the arena. May the best bot win!',
            GroupMinParticipants: 3,
            GroupMaxParticipants: 5,
            Fees: 500,
            Prizes: '1st: ₹25,000 | 2nd: ₹15,000 | 3rd: ₹7,500',
            DepartmentID: eceDept._id,
            EventCoordinatorID: evtCoord2._id,
            Location: 'Main Auditorium',
            MaxGroupsAllowed: 20,
            EventDate: '2026-04-16',
            EventTime: '10:00'
        });

        await Event.create({
            EventName: 'Web Design Challenge',
            Tagline: 'Pixels Perfect, Code Clean',
            Description: 'Create stunning, responsive websites that push the boundaries of modern web design.',
            GroupMinParticipants: 1,
            GroupMaxParticipants: 2,
            Fees: 100,
            Prizes: '1st: ₹8,000 | 2nd: ₹4,000 | 3rd: ₹2,000',
            DepartmentID: csDept._id,
            EventCoordinatorID: evtCoord1._id,
            Location: 'Seminar Hall 2',
            MaxGroupsAllowed: 50,
            EventDate: '2026-04-17',
            EventTime: '14:00'
        });

        await Event.create({
            EventName: 'Bridge Building',
            Tagline: 'Engineer your way to victory',
            Description: 'Design and construct a model bridge using limited materials. The bridge that bears the most load wins!',
            GroupMinParticipants: 2,
            GroupMaxParticipants: 3,
            Fees: 150,
            Prizes: '1st: ₹6,000 | 2nd: ₹3,000',
            DepartmentID: mechDept._id,
            EventCoordinatorID: evtCoord2._id,
            Location: 'Workshop Hall',
            MaxGroupsAllowed: 25,
            EventDate: '2026-04-18',
            EventTime: '11:00'
        });

        await Event.create({
            EventName: 'Logo Design Showdown',
            Tagline: 'Brand it your way',
            Description: 'Create a compelling logo for a fictional brand in just 3 hours. Creativity and originality are key!',
            GroupMinParticipants: 1,
            GroupMaxParticipants: 1,
            Fees: 50,
            Prizes: '1st: ₹5,000 | 2nd: ₹2,500',
            DepartmentID: gfxDept._id,
            EventCoordinatorID: evtCoord1._id,
            Location: 'Design Studio 1',
            MaxGroupsAllowed: 40,
            EventDate: '2026-04-19',
            EventTime: '10:00'
        });

        await Event.create({
            EventName: 'Business Plan Pitch',
            Tagline: 'Pitch. Persuade. Prevail.',
            Description: 'Present your innovative business idea to a panel of industry judges. Best pitch wins seed funding!',
            GroupMinParticipants: 2,
            GroupMaxParticipants: 4,
            Fees: 300,
            Prizes: '1st: ₹20,000 | 2nd: ₹10,000 | 3rd: ₹5,000',
            DepartmentID: mbaDept._id,
            EventCoordinatorID: evtCoord2._id,
            Location: 'Conference Room A',
            MaxGroupsAllowed: 15,
            EventDate: '2026-04-20',
            EventTime: '09:30'
        });

        await Event.create({
            EventName: 'Circuit Debugging',
            Tagline: 'Find the fault, fix the flow',
            Description: 'Participants are given faulty circuits and must identify and fix all bugs within a time limit.',
            GroupMinParticipants: 1,
            GroupMaxParticipants: 2,
            Fees: 100,
            Prizes: '1st: ₹7,000 | 2nd: ₹3,500 | 3rd: ₹1,500',
            DepartmentID: eceDept._id,
            EventCoordinatorID: evtCoord1._id,
            Location: 'Electronics Lab 3',
            MaxGroupsAllowed: 35,
            EventDate: '2026-04-16',
            EventTime: '14:30'
        });

        console.log(`   ✓ 7 Events created across multiple departments`);

        // ─── SUMMARY ────────────────────────────────────────────
        console.log('\n✅ Seed data created successfully!');
        console.log('\n📊 Data Summary:');
        console.log('   • 8 Users (1 admin, 1 student, 1 inst coord, 3 dept coords, 2 event coords)');
        console.log('   • 3 Institutes');
        console.log('   • 8 Departments');
        console.log('   • 7 Events');

        console.log('\n📋 Login Credentials:');
        console.log('   ┌──────────────────────────┬──────────────────────────┬───────────┐');
        console.log('   │ Role                     │ Email                    │ Password  │');
        console.log('   ├──────────────────────────┼──────────────────────────┼───────────┤');
        console.log('   │ Admin                    │ admin@frolic.com         │ admin123  │');
        console.log('   │ Student                  │ student@frolic.com       │ student123│');
        console.log('   │ Institute Coordinator    │ inst.coord@frolic.com    │ coord123  │');
        console.log('   │ Dept Coordinator 1       │ dept.coord1@frolic.com   │ coord123  │');
        console.log('   │ Dept Coordinator 2       │ dept.coord2@frolic.com   │ coord123  │');
        console.log('   │ Dept Coordinator 3       │ dept.coord3@frolic.com   │ coord123  │');
        console.log('   │ Event Coordinator 1      │ evt.coord1@frolic.com    │ coord123  │');
        console.log('   │ Event Coordinator 2      │ evt.coord2@frolic.com    │ coord123  │');
        console.log('   └──────────────────────────┴──────────────────────────┴───────────┘');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
