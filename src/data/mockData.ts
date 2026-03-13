export const students = [
  { id: "1", name: "Aarav Sharma", email: "aarav@example.com", stream: "CSE", score: 85, codingCount: 42, interviewScore: 78, achievements: 5, lastActive: "2026-03-12" },
  { id: "2", name: "Diya Patel", email: "diya@example.com", stream: "ECE", score: 92, codingCount: 56, interviewScore: 88, achievements: 8, lastActive: "2026-03-13" },
  { id: "3", name: "Rohan Gupta", email: "rohan@example.com", stream: "Mechanical", score: 65, codingCount: 12, interviewScore: 60, achievements: 2, lastActive: "2026-03-10" },
  { id: "4", name: "Ananya Singh", email: "ananya@example.com", stream: "CSE", score: 78, codingCount: 30, interviewScore: 82, achievements: 4, lastActive: "2026-03-11" },
  { id: "5", name: "Vikram Reddy", email: "vikram@example.com", stream: "Civil", score: 55, codingCount: 8, interviewScore: 50, achievements: 1, lastActive: "2026-03-08" },
  { id: "6", name: "Priya Desai", email: "priya@example.com", stream: "EEE", score: 88, codingCount: 45, interviewScore: 85, achievements: 6, lastActive: "2026-03-13" },
  { id: "7", name: "Arjun Nair", email: "arjun@example.com", stream: "Automobile", score: 72, codingCount: 22, interviewScore: 70, achievements: 3, lastActive: "2026-03-12" },
  { id: "8", name: "Kavya Menon", email: "kavya@example.com", stream: "CSE", score: 95, codingCount: 60, interviewScore: 92, achievements: 10, lastActive: "2026-03-13" },
];

export const streams = [
  { id: "1", name: "CSE", totalStudents: 450, activeStudents: 410, avgScore: 82, engagement: "High" },
  { id: "2", name: "Mechanical", totalStudents: 320, activeStudents: 280, avgScore: 68, engagement: "Medium" },
  { id: "3", name: "Civil", totalStudents: 210, activeStudents: 180, avgScore: 65, engagement: "Low" },
  { id: "4", name: "Automobile", totalStudents: 150, activeStudents: 130, avgScore: 70, engagement: "Medium" },
  { id: "5", name: "ECE", totalStudents: 380, activeStudents: 350, avgScore: 78, engagement: "High" },
  { id: "6", name: "EEE", totalStudents: 290, activeStudents: 260, avgScore: 75, engagement: "Medium" },
];

export const badges = [
  { id: "1", name: "First Assessment Completed", description: "Completed the very first assessment on the platform.", icon: "Trophy", condition: "Complete 1 assessment", points: 50 },
  { id: "2", name: "Coding Starter", description: "Solved the first coding problem.", icon: "Code", condition: "Solve 1 coding problem", points: 20 },
  { id: "3", name: "Problem Solver", description: "Solved 50 coding problems.", icon: "Brain", condition: "Solve 50 coding problems", points: 200 },
  { id: "4", name: "Mock Interview Champion", description: "Scored 90+ in a mock interview.", icon: "Mic", condition: "Score >= 90 in interview", points: 300 },
  { id: "5", name: "Top Performer", description: "Ranked in the top 10 of the leaderboard.", icon: "Star", condition: "Top 10 rank", points: 500 },
];

export const milestones = [
  { id: "1", name: "Complete First Assessment", description: "Take the initial diagnostic test.", targetAction: "Assessment", criteria: "Count = 1", points: 100 },
  { id: "2", name: "Solve 20 Coding Problems", description: "Practice coding regularly.", targetAction: "Coding", criteria: "Count >= 20", points: 250 },
  { id: "3", name: "Attend 3 Mock Interviews", description: "Prepare for real interviews.", targetAction: "Interview", criteria: "Count >= 3", points: 300 },
  { id: "4", name: "Score 80+ in Assessment", description: "Achieve excellence in tests.", targetAction: "Assessment", criteria: "Score >= 80", points: 400 },
  { id: "5", name: "Win an MCQ Battle", description: "Compete and win against peers.", targetAction: "Battle", criteria: "Wins >= 1", points: 150 },
];

export const activityData = [
  { name: "Mon", logins: 400, assessments: 240, coding: 300 },
  { name: "Tue", logins: 450, assessments: 280, coding: 350 },
  { name: "Wed", logins: 420, assessments: 260, coding: 320 },
  { name: "Thu", logins: 500, assessments: 310, coding: 400 },
  { name: "Fri", logins: 480, assessments: 290, coding: 380 },
  { name: "Sat", logins: 300, assessments: 150, coding: 200 },
  { name: "Sun", logins: 350, assessments: 180, coding: 250 },
];

export const streamDistribution = [
  { name: "CSE", value: 450 },
  { name: "Mechanical", value: 320 },
  { name: "Civil", value: 210 },
  { name: "Automobile", value: 150 },
  { name: "ECE", value: 380 },
  { name: "EEE", value: 290 },
];

export const scoreDistribution = [
  { name: "0-40", students: 120 },
  { name: "40-60", students: 450 },
  { name: "60-80", students: 850 },
  { name: "80-100", students: 380 },
];

export const skillGapData = [
  { subject: "Technical Knowledge", A: 80, B: 60, fullMark: 100 },
  { subject: "Logical Reasoning", A: 75, B: 65, fullMark: 100 },
  { subject: "Coding Ability", A: 85, B: 50, fullMark: 100 },
  { subject: "Communication", A: 70, B: 80, fullMark: 100 },
  { subject: "Problem Solving", A: 78, B: 55, fullMark: 100 },
];
