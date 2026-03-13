import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Search, Filter, Edit, Eye, Ban, X, Upload, Users, Activity, Target, Award, Download } from "lucide-react";
import { useData } from "@/src/context/DataContext";

export function Students() {
  const { students, addStudent, addStudents, streams } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [streamFilter, setStreamFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", stream: "CSE" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split('\n').filter(line => line.trim());
      // Assuming format: name,email,stream
      const newStudents = lines.slice(1).map(line => {
        const [name, email, stream] = line.split(',');
        return { 
          name: name?.trim(), 
          email: email?.trim(), 
          stream: stream?.trim() || streams[0]?.name || 'CSE' 
        };
      }).filter(s => s.name && s.email);
      
      if (newStudents.length > 0) {
        addStudents(newStudents);
        alert(`Successfully imported ${newStudents.length} students!`);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStream = streamFilter === "All" || student.stream === streamFilter;
    return matchesSearch && matchesStream;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent(formData);
    setIsModalOpen(false);
    setFormData({ name: "", email: "", stream: streams[0]?.name || "CSE" });
  };

  const handleExportStreamWise = () => {
    const headers = ['Stream,Total Students,Avg Assessment Score,Avg Coding Count,Avg Interview Score,Total Badges'];
    const validStreamStats = streams.map(stream => {
      const streamStudents = filteredStudents.filter(s => s.stream === stream.name);
      if (streamStudents.length === 0) return null;
      const count = streamStudents.length;
      const avgScore = Math.round(streamStudents.reduce((acc, s) => acc + s.score, 0) / count);
      const avgCoding = Math.round(streamStudents.reduce((acc, s) => acc + s.codingCount, 0) / count);
      const avgInterview = Math.round(streamStudents.reduce((acc, s) => acc + s.interviewScore, 0) / count);
      const totalBadges = streamStudents.reduce((acc, s) => acc + s.achievements, 0);
      return `"${stream.name}",${count},${avgScore},${avgCoding},${avgInterview},${totalBadges}`;
    }).filter(Boolean);

    const csv = headers.concat(validStreamStats as string[]).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_stream_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Student Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <div className="hidden md:flex bg-white border border-gray-300 rounded-lg overflow-hidden">
            <button onClick={handleExportStreamWise} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-1" title="Export Stream-wise Report">
              <Download className="w-4 h-4" /> <span>Stream Report</span>
            </button>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Add Student
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
            <Users className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{students.length}</div>
            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Learners</CardTitle>
            <Activity className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{Math.floor(students.length * 0.85)}</div>
            <p className="text-xs text-gray-500 mt-1">85% engagement rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Assessment</CardTitle>
            <Target className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.score, 0) / students.length) : 0}%
            </div>
            <p className="text-xs text-green-600 mt-1">+2.4% overall improvement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Badges</CardTitle>
            <Award className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {students.reduce((acc, s) => acc + s.achievements, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Across all streams</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <div className="hidden sm:block text-sm text-gray-500 whitespace-nowrap">
                Showing {filteredStudents.length} results
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={streamFilter}
                onChange={(e) => setStreamFilter(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
              >
                <option value="All">All Streams</option>
                {streams.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Name & Email</th>
                  <th className="px-6 py-3 font-medium">Stream</th>
                  <th className="px-6 py-3 font-medium text-center">Assessment</th>
                  <th className="px-6 py-3 font-medium text-center">Coding</th>
                  <th className="px-6 py-3 font-medium text-center">Interview</th>
                  <th className="px-6 py-3 font-medium text-center">Badges</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-xs text-gray-500">{student.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {student.stream}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${student.score >= 80 ? 'text-green-600' : student.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        {student.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">{student.codingCount}</td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">{student.interviewScore}</td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">{student.achievements}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors" title="View Profile">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Suspend">
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No students found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Add New Student</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                    value={formData.stream} 
                    onChange={e => setFormData({...formData, stream: e.target.value})}
                  >
                    {streams.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
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
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
