import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Plus, Settings2, Users, Target, Activity, X, Sparkles, AlertTriangle, ArrowLeft, BarChart2, PieChart as PieChartIcon, Download } from "lucide-react";
import { useData } from "@/src/context/DataContext";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

export function Streams() {
  const { streams, addStream, students } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStream(formData);
    setIsModalOpen(false);
    setFormData({ name: "" });
  };

  const handleExportIndividualStudent = (student: any) => {
    const headers = ['Student Name,Email ID,Stream Name,Assessment Score,Coding Count,Interview Score,Badges,Last Active'];
    const row = `"${student.name}","${student.email}","${student.stream}",${student.score},${student.codingCount},${student.interviewScore},${student.achievements},"${student.lastActive}"`;
    const csv = headers.concat([row]).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_report_${student.name.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportStreamReport = (streamName: string, streamStudents: any[]) => {
    const headers = ['Student Name,Email ID,Stream Name,Assessment Score,Coding Count,Interview Score,Badges,Last Active'];
    const rows = streamStudents.map(student => `"${student.name}","${student.email}","${student.stream}",${student.score},${student.codingCount},${student.interviewScore},${student.achievements},"${student.lastActive}"`);
    const csv = headers.concat(rows).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${streamName.replace(/\s+/g, '_')}_total_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate real metrics for streams based on students
  const getStreamMetrics = (streamName: string) => {
    const streamStudents = students.filter(s => s.stream === streamName);
    const total = streamStudents.length;
    const active = Math.floor(total * 0.85); // Mock active
    const avgScore = total > 0 
      ? Math.round(streamStudents.reduce((acc, s) => acc + s.score, 0) / total)
      : 0;
    
    return { total, active, avgScore };
  };

  if (selectedStreamId) {
    const stream = streams.find(s => s.id === selectedStreamId);
    if (!stream) return null;

    const streamStudents = students.filter(s => s.stream === stream.name);
    const metrics = getStreamMetrics(stream.name);
    
    const fastTrack = streamStudents.filter(s => s.score >= 80).length;
    const standardTrack = streamStudents.filter(s => s.score >= 60 && s.score < 80).length;
    const intensiveTrack = streamStudents.filter(s => s.score < 60).length;

    const distributionData = [
      { name: 'Fast Track', value: fastTrack, color: '#f59e0b' },
      { name: 'Standard', value: standardTrack, color: '#3b82f6' },
      { name: 'Intensive', value: intensiveTrack, color: '#ef4444' }
    ];

    const topStudents = [...streamStudents].sort((a, b) => b.score - a.score).slice(0, 5);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedStreamId(null)}
              className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-full transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">{stream.name} Analytics</h1>
              <p className="text-sm text-gray-500">Detailed performance metrics for this stream</p>
            </div>
          </div>
          <button 
            onClick={() => handleExportStreamReport(stream.name, streamStudents)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Stream Report</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metrics.total > 0 ? metrics.total : stream.totalStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metrics.total > 0 ? metrics.active : stream.activeStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metrics.total > 0 ? metrics.avgScore : stream.avgScore}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-indigo-500" />
                Student Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex flex-col">
              {streamStudents.length > 0 ? (
                <>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={distributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                    {distributionData.map(d => (
                      <div key={d.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-gray-600 font-medium">{d.name} ({d.value})</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">No student data available</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {topStudents.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topStudents} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} />
                    <Tooltip 
                      cursor={{ fill: '#f3f4f6' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="score" name="Score (%)" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">No student data available</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Student List Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Stream Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 font-medium">Student Name</th>
                    <th className="px-6 py-3 font-medium">Email ID</th>
                    <th className="px-6 py-3 font-medium">Stream Name</th>
                    <th className="px-6 py-3 font-medium text-center">Score</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {streamStudents.map((student) => (
                    <tr key={student.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-gray-500">{student.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {student.stream}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-gray-700">{student.score}%</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleExportIndividualStudent(student)}
                          className="flex items-center justify-end gap-1 text-indigo-600 hover:text-indigo-800 transition-colors ml-auto"
                          title="Export Individual Report"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-xs font-medium">Export</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {streamStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">
                        No students found in this stream.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Stream Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Stream
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.map((stream) => {
          const metrics = getStreamMetrics(stream.name);
          const displayTotal = metrics.total > 0 ? metrics.total : stream.totalStudents;
          const displayActive = metrics.total > 0 ? metrics.active : stream.activeStudents;
          const displayAvg = metrics.total > 0 ? metrics.avgScore : stream.avgScore;

          return (
            <Card key={stream.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100">
                <CardTitle className="text-lg font-bold text-gray-900">{stream.name}</CardTitle>
                <button className="text-gray-400 hover:text-indigo-600 transition-colors p-1">
                  <Settings2 className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium">Total Students</span>
                  </div>
                  <span className="font-bold text-gray-900">{displayTotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium">Active Students</span>
                  </div>
                  <span className="font-bold text-gray-900">{displayActive}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Target className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium">Avg Assessment</span>
                  </div>
                  <span className={`font-bold ${displayAvg >= 75 ? 'text-green-600' : 'text-amber-600'}`}>
                    {displayAvg}%
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Engagement Level</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    stream.engagement === 'High' ? 'bg-green-100 text-green-800' :
                    stream.engagement === 'Medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {stream.engagement}
                  </span>
                </div>
                
                {/* Futuristic Features */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-medium text-indigo-900">AI Curriculum Sync</span>
                    </div>
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                      Generate
                    </button>
                  </div>
                  {displayAvg < 70 && (
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-red-900">Attrition Risk Alert</span>
                      </div>
                      <span className="text-xs font-bold text-red-600">High</span>
                    </div>
                  )}
                </div>
                <div className="pt-4 mt-2 border-t border-gray-100">
                  <button 
                    onClick={() => setSelectedStreamId(stream.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <BarChart2 className="w-4 h-4" />
                    View Stream Analytics
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Add New Stream</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stream Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g., Aerospace Engineering"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
