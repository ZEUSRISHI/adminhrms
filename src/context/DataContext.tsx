import React, { createContext, useContext, useState } from 'react';
import { students as initialStudents, streams as initialStreams } from '../data/mockData';

type Student = typeof initialStudents[0];
type Stream = typeof initialStreams[0];

interface DataContextType {
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'score' | 'codingCount' | 'interviewScore' | 'achievements' | 'lastActive'>) => void;
  addStudents: (students: Omit<Student, 'id' | 'score' | 'codingCount' | 'interviewScore' | 'achievements' | 'lastActive'>[]) => void;
  streams: Stream[];
  addStream: (stream: Omit<Stream, 'id' | 'totalStudents' | 'activeStudents' | 'avgScore' | 'engagement'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [streams, setStreams] = useState<Stream[]>(initialStreams);

  const addStudent = (studentData: Omit<Student, 'id' | 'score' | 'codingCount' | 'interviewScore' | 'achievements' | 'lastActive'>) => {
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      score: Math.floor(Math.random() * 40) + 60, // Random score 60-100
      codingCount: Math.floor(Math.random() * 50),
      interviewScore: Math.floor(Math.random() * 40) + 60,
      achievements: Math.floor(Math.random() * 5),
      lastActive: new Date().toISOString().split('T')[0],
      ...studentData,
    };
    setStudents([newStudent, ...students]);
  };

  const addStudents = (studentsData: Omit<Student, 'id' | 'score' | 'codingCount' | 'interviewScore' | 'achievements' | 'lastActive'>[]) => {
    const newStudents: Student[] = studentsData.map(data => ({
      id: Math.random().toString(36).substr(2, 9),
      score: Math.floor(Math.random() * 40) + 60,
      codingCount: Math.floor(Math.random() * 50),
      interviewScore: Math.floor(Math.random() * 40) + 60,
      achievements: Math.floor(Math.random() * 5),
      lastActive: new Date().toISOString().split('T')[0],
      ...data,
    }));
    setStudents([...newStudents, ...students]);
  };

  const addStream = (streamData: Omit<Stream, 'id' | 'totalStudents' | 'activeStudents' | 'avgScore' | 'engagement'>) => {
    const newStream: Stream = {
      id: Math.random().toString(36).substr(2, 9),
      totalStudents: 0,
      activeStudents: 0,
      avgScore: 0,
      engagement: "Medium",
      ...streamData,
    };
    setStreams([...streams, newStream]);
  };

  return (
    <DataContext.Provider value={{ students, addStudent, addStudents, streams, addStream }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
