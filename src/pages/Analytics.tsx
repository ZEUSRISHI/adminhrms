import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine
} from "recharts";
import { TrendingUp, Users, Target, Award, Mic, ClipboardList, AlertTriangle, Download } from "lucide-react";
import { useData } from "@/src/context/DataContext";

const COLORS = ['#4f46e5', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6'];

export function Analytics() {
  const { streams, students } = useData();
  const [selectedStream, setSelectedStream] = useState("All Streams");

  const filteredStudents = selectedStream === "All Streams" 
    ? students 
    : students.filter(s => s.stream === selectedStream);

  const filteredStreams = selectedStream === "All Streams"
    ? streams
    : streams.filter(s => s.name === selectedStream);

  // Calculate overall averages
  const avgAssessment = filteredStudents.length ? Math.round(filteredStudents.reduce((acc, s) => acc + s.score, 0) / filteredStudents.length) : 0;
  const avgInterview = filteredStudents.length ? Math.round(filteredStudents.reduce((acc, s) => acc + s.interviewScore, 0) / filteredStudents.length) : 0;
  const gap = avgAssessment - avgInterview;
  const totalInterviewsCount = selectedStream === "All Streams" ? 1205 : Math.floor(filteredStudents.length * 2.5);

  // Stream Performance Data (Assessment vs Interview)
  const streamPerformanceData = filteredStreams.map(s => {
    const streamStudents = students.filter(st => st.stream === s.name);
    const total = streamStudents.length;
    const streamAvgScore = total > 0 
      ? Math.round(streamStudents.reduce((acc, st) => acc + st.score, 0) / total)
      : s.avgScore;
    const streamAvgInterview = total > 0 
      ? Math.round(streamStudents.reduce((acc, st) => acc + st.interviewScore, 0) / total)
      : 0;
    
    return {
      name: s.name,
      "Assessment Score": streamAvgScore,
      "Interview Score": streamAvgInterview,
      activeStudents: total > 0 ? Math.floor(total * 0.85) : s.activeStudents
    };
  });

  // Scatter Plot Data (Correlation)
  const scatterData = filteredStudents.map(s => ({
    name: s.name,
    stream: s.stream,
    score: s.score,
    interviewScore: s.interviewScore,
  }));

  // Mock Detailed Skills Data (Comparing written vs verbal/practical)
  const detailedSkillsData = [
    { skill: "Data Structures", assessment: 78, interview: 65 },
    { skill: "Algorithms", assessment: 72, interview: 60 },
    { skill: "System Design", assessment: 65, interview: 55 },
    { skill: "Communication", assessment: 85, interview: 70 },
    { skill: "Problem Solving", assessment: 80, interview: 75 },
    { skill: "Database Design", assessment: 75, interview: 68 },
  ];

  // Weakest Areas Data
  const weakestAreas = [
    { stream: "All Streams", area: "System Design", type: "Interview", avgScore: 55, impact: "High", recommendation: "Add more architecture case studies" },
    { stream: "CSE", area: "Dynamic Programming", type: "Assessment", avgScore: 58, impact: "High", recommendation: "Conduct specialized DP workshops" },
    { stream: "Mechanical", area: "Thermodynamics", type: "Interview", avgScore: 62, impact: "Medium", recommendation: "More peer-to-peer mock interviews" },
    { stream: "ECE", area: "Signal Processing", type: "Assessment", avgScore: 64, impact: "Medium", recommendation: "Include complex query exercises" },
  ].filter(w => selectedStream === "All Streams" || w.stream === selectedStream || w.stream === "All Streams");

  const handleExportGroup = () => {
    const headers = ['Stream,Assessment Score,Interview Score,Active Students'];
    const rows = streamPerformanceData.map(s => `${s.name},${s["Assessment Score"]},${s["Interview Score"]},${s.activeStudents}`);
    const csv = headers.concat(rows).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `group_report_${selectedStream.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportIndividual = () => {
    const headers = ['Student Name,Stream,Assessment Score,Interview Score'];
    const rows = scatterData.map(s => `${s.name},${s.stream},${s.score},${s.interviewScore}`);
    const csv = headers.concat(rows).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `individual_report_${selectedStream.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Assessment & Interview Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Deep dive into skill gaps between written assessments and practical mock interviews.</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="bg-white border border-gray-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
          >
            <option value="All Streams">All Streams</option>
            {streams.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
          <select className="bg-white border border-gray-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 hidden sm:block">
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Year to Date</option>
          </select>
          <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
            <button onClick={handleExportGroup} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border-r border-gray-300 flex items-center gap-1" title="Export Group Report">
              <Download className="w-4 h-4" /> <span className="hidden sm:inline">Group</span>
            </button>
            <button onClick={handleExportIndividual} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-1" title="Export Individual Report">
              <Download className="w-4 h-4" /> <span className="hidden sm:inline">Individual</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg Assessment Score</CardTitle>
            <ClipboardList className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{avgAssessment}%</div>
            <p className="text-xs text-gray-500 mt-1">Written/MCQ Tests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg Interview Score</CardTitle>
            <Mic className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{avgInterview}%</div>
            <p className="text-xs text-gray-500 mt-1">Verbal/Practical Tests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Performance Gap</CardTitle>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">-{gap}%</div>
            <p className="text-xs text-gray-500 mt-1">Interview vs Assessment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Interviews</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalInterviewsCount}</div>
            <p className="text-xs text-green-600 mt-1">+8% this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Assessment vs Interview Correlation */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Correlation: Assessment vs Interview</CardTitle>
            <p className="text-xs text-gray-500">Are students who score high in tests also performing well in interviews?</p>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis type="number" dataKey="score" name="Assessment Score" unit="%" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis type="number" dataKey="interviewScore" name="Interview Score" unit="%" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <ZAxis type="category" dataKey="stream" name="Stream" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <ReferenceLine x={avgAssessment} stroke="#9ca3af" strokeDasharray="3 3" label={{ position: 'top', value: 'Avg Assessment', fill: '#9ca3af', fontSize: 10 }} />
                <ReferenceLine y={avgInterview} stroke="#9ca3af" strokeDasharray="3 3" label={{ position: 'right', value: 'Avg Interview', fill: '#9ca3af', fontSize: 10 }} />
                {streams.map((stream, i) => (
                  <Scatter 
                    key={stream.name} 
                    name={stream.name} 
                    data={scatterData.filter(d => d.stream === stream.name)} 
                    fill={COLORS[i % COLORS.length]} 
                    fillOpacity={0.7}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Specific Skill Breakdown */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Skill Performance Breakdown</CardTitle>
            <p className="text-xs text-gray-500">Comparing specific skill scores in written tests vs verbal interviews.</p>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={detailedSkillsData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis type="category" dataKey="skill" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="assessment" name="Assessment Score" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="interview" name="Interview Score" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stream Performance Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Stream Comparison: Assessment vs Interview</CardTitle>
            <p className="text-sm text-gray-500">Identifying which streams struggle most with practical interviews.</p>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={streamPerformanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Assessment Score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Interview Score" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Critical Skill Gaps & Recommendations */}
        <Card className="border-amber-200">
          <CardHeader className="bg-amber-50/50 border-b border-amber-100 rounded-t-xl">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5" />
              Critical Skill Gaps & Recommendations
            </CardTitle>
            <p className="text-sm text-amber-700/80">Areas needing immediate attention based on recent evaluations.</p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 font-medium">Stream</th>
                    <th className="px-4 py-3 font-medium">Skill Area</th>
                    <th className="px-4 py-3 font-medium">Evaluation Type</th>
                    <th className="px-4 py-3 font-medium">Avg Score</th>
                    <th className="px-4 py-3 font-medium">Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {weakestAreas.map((area, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-amber-50/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-500">{area.stream}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{area.area}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${area.type === 'Interview' ? 'bg-pink-100 text-pink-700' : 'bg-indigo-100 text-indigo-700'}`}>
                          {area.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-red-600">{area.avgScore}%</td>
                      <td className="px-4 py-3 text-gray-600">{area.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
