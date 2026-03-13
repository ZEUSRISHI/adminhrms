import { useState, useMemo } from "react";
import { useData } from "@/src/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line
} from "recharts";
import { 
  Users, TrendingUp, AlertCircle, CheckCircle2, 
  Clock, Lightbulb, Filter, ArrowUpRight, ArrowDownRight
} from "lucide-react";

const COLORS = {
  beginner: "#f59e0b", // Amber
  developing: "#3b82f6", // Blue
  industryReady: "#10b981", // Emerald
};

export function CategoryAnalytics() {
  const { students, streams } = useData();
  const [selectedStream, setSelectedStream] = useState<string>("All");
  const [dateRange, setDateRange] = useState<string>("This Month");

  // Filter students based on stream
  const filteredStudents = useMemo(() => {
    return selectedStream === "All" 
      ? students 
      : students.filter(s => s.stream === selectedStream);
  }, [students, selectedStream]);

  // Categorization Logic
  const categorized = useMemo(() => {
    const beginner = filteredStudents.filter(s => s.score < 50);
    const developing = filteredStudents.filter(s => s.score >= 50 && s.score < 80);
    const industryReady = filteredStudents.filter(s => s.score >= 80);
    
    const avgScore = filteredStudents.length > 0 
      ? Math.round(filteredStudents.reduce((acc, s) => acc + s.score, 0) / filteredStudents.length)
      : 0;

    return { beginner, developing, industryReady, avgScore, total: filteredStudents.length };
  }, [filteredStudents]);

  // Pie Chart Data
  const pieData = [
    { name: "Beginner", value: categorized.beginner.length, color: COLORS.beginner },
    { name: "Developing", value: categorized.developing.length, color: COLORS.developing },
    { name: "Industry Ready", value: categorized.industryReady.length, color: COLORS.industryReady },
  ];

  // Bar Chart Data (By Stream)
  const streamData = useMemo(() => {
    return streams.map(stream => {
      const streamStudents = students.filter(s => s.stream === stream.name);
      return {
        name: stream.name,
        Beginner: streamStudents.filter(s => s.score < 50).length,
        Developing: streamStudents.filter(s => s.score >= 50 && s.score < 80).length,
        "Industry Ready": streamStudents.filter(s => s.score >= 80).length,
      };
    });
  }, [students, streams]);

  // Performance Comparison Data
  const performanceData = useMemo(() => {
    const getAvg = (arr: any[], key: string) => arr.length ? Math.round(arr.reduce((acc, s) => acc + s[key], 0) / arr.length) : 0;
    
    return [
      {
        category: "Beginner",
        "Assessment Score": getAvg(categorized.beginner, "score"),
        "Coding Practice": getAvg(categorized.beginner, "codingCount"),
        "Interview Score": getAvg(categorized.beginner, "interviewScore"),
      },
      {
        category: "Developing",
        "Assessment Score": getAvg(categorized.developing, "score"),
        "Coding Practice": getAvg(categorized.developing, "codingCount"),
        "Interview Score": getAvg(categorized.developing, "interviewScore"),
      },
      {
        category: "Industry Ready",
        "Assessment Score": getAvg(categorized.industryReady, "score"),
        "Coding Practice": getAvg(categorized.industryReady, "codingCount"),
        "Interview Score": getAvg(categorized.industryReady, "interviewScore"),
      }
    ];
  }, [categorized]);

  // Progression Trend (Mocked historical data for demonstration)
  const progressionData = [
    { month: "Jan", "Beginner → Developing": 12, "Developing → Industry Ready": 5 },
    { month: "Feb", "Beginner → Developing": 18, "Developing → Industry Ready": 8 },
    { month: "Mar", "Beginner → Developing": 24, "Developing → Industry Ready": 15 },
    { month: "Apr", "Beginner → Developing": 35, "Developing → Industry Ready": 22 },
    { month: "May", "Beginner → Developing": 42, "Developing → Industry Ready": 30 },
    { month: "Jun", "Beginner → Developing": 55, "Developing → Industry Ready": 45 },
  ];

  // Smart Tables Data
  const closeToNext = filteredStudents.filter(s => 
    (s.score >= 45 && s.score <= 49) || (s.score >= 75 && s.score <= 79)
  ).map(s => ({
    ...s,
    currentCat: s.score < 50 ? "Beginner" : "Developing",
    nextCat: s.score < 50 ? "Developing" : "Industry Ready",
    color: s.score < 50 ? "text-blue-600 bg-blue-50" : "text-emerald-600 bg-emerald-50"
  })).sort((a, b) => b.score - a.score);

  const lowPerformance = filteredStudents.filter(s => s.score < 40).map(s => ({
    ...s,
    inactiveDays: Math.floor(Math.random() * 15) + 10 // Mocking inactivity days >= 10
  })).sort((a, b) => a.score - b.score);

  // Insights Generation
  const insights = useMemo(() => {
    let topIndustryStream = { name: "-", count: 0 };
    let topBeginnerStream = { name: "-", count: 0 };

    streamData.forEach(d => {
      if (d["Industry Ready"] > topIndustryStream.count) topIndustryStream = { name: d.name, count: d["Industry Ready"] };
      if (d.Beginner > topBeginnerStream.count) topBeginnerStream = { name: d.name, count: d.Beginner };
    });

    return [
      { title: "Highest Industry Ready", value: topIndustryStream.name, desc: `${topIndustryStream.count} students ready for placement` },
      { title: "Most Beginners", value: topBeginnerStream.name, desc: `${topBeginnerStream.count} students need foundational support` },
      { title: "Category Growth", value: "+24%", desc: "Increase in Industry Ready this month" },
      { title: "Top Improver", value: "CSE Stream", desc: "Moved 15 students to Developing" },
    ];
  }, [streamData]);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Category Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Deep insights into student readiness and progression.</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              className="text-sm border-none focus:ring-0 bg-transparent text-gray-700 font-medium cursor-pointer"
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
            >
              <option value="All">All Streams</option>
              {streams.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <select 
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 shadow-sm bg-white text-gray-700 font-medium cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>Last 3 Months</option>
          </select>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{categorized.total}</h3>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg"><Users className="w-4 h-4 text-gray-600" /></div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" /> <span>12% vs last week</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Beginner</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{categorized.beginner.length}</h3>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg"><Clock className="w-4 h-4 text-amber-600" /></div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-medium text-emerald-600">
              <ArrowDownRight className="w-3 h-3" /> <span>-5% vs last week</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Developing</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{categorized.developing.length}</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg"><TrendingUp className="w-4 h-4 text-blue-600" /></div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" /> <span>8% vs last week</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Industry Ready</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{categorized.industryReady.length}</h3>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" /> <span>15% vs last week</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Readiness</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{categorized.avgScore}%</h3>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg"><Lightbulb className="w-4 h-4 text-indigo-600" /></div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-medium text-emerald-600">
              <ArrowUpRight className="w-3 h-3" /> <span>3.2% vs last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{insight.title}</p>
            <h4 className="text-lg font-bold text-gray-900 mt-1">{insight.value}</h4>
            <p className="text-xs text-gray-500 mt-1">{insight.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category by Stream Analytics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Category by Stream</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={streamData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Beginner" stackId="a" fill={COLORS.beginner} radius={[0, 0, 4, 4]} />
                <Bar dataKey="Developing" stackId="a" fill={COLORS.developing} />
                <Bar dataKey="Industry Ready" stackId="a" fill={COLORS.industryReady} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Progression Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Progression Trend (6 Months)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="Beginner → Developing" stroke={COLORS.developing} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Developing → Industry Ready" stroke={COLORS.industryReady} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Assessment Score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Coding Practice" fill="#ec4899" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Interview Score" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students Close to Next Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Close to Next Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium">Stream</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium">Next Level</th>
                  </tr>
                </thead>
                <tbody>
                  {closeToNext.slice(0, 6).map((student, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                      <td className="px-4 py-3 text-gray-500">{student.stream}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-gray-900">{student.score}</span>
                        <span className="text-xs text-gray-400 ml-1">/ 100</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${student.color}`}>
                          → {student.nextCat}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {closeToNext.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No students currently on the borderline.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Low Performance Alert */}
        <Card className="border-red-200">
          <CardHeader className="bg-red-50/50 border-b border-red-100 rounded-t-xl">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              Low Performance Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium">Stream</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium">Inactivity</th>
                  </tr>
                </thead>
                <tbody>
                  {lowPerformance.slice(0, 6).map((student, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-red-50/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                      <td className="px-4 py-3 text-gray-500">{student.stream}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-red-600">{student.score}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-amber-600 font-medium text-xs">
                          <Clock className="w-3 h-3" /> {student.inactiveDays} days
                        </span>
                      </td>
                    </tr>
                  ))}
                  {lowPerformance.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No students currently at high risk.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
