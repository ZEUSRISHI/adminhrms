import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Plus, Edit, Trash2, Trophy, Code, Brain, Mic, Star } from "lucide-react";
import { badges } from "@/src/data/mockData";

const iconMap: Record<string, React.ReactNode> = {
  Trophy: <Trophy className="w-6 h-6 text-amber-500" />,
  Code: <Code className="w-6 h-6 text-blue-500" />,
  Brain: <Brain className="w-6 h-6 text-purple-500" />,
  Mic: <Mic className="w-6 h-6 text-pink-500" />,
  Star: <Star className="w-6 h-6 text-yellow-500" />,
};

export function Badges() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Badges & Awards</h1>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Create Badge
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Badges Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">12,450</div>
            <p className="text-xs text-green-600 mt-1">+850 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Most Popular Badge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-900">Coding Starter</div>
            <p className="text-xs text-gray-500 mt-1">Earned by 85% of students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Top Earner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-900">Kavya Menon</div>
            <p className="text-xs text-gray-500 mt-1">10 Badges</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Available Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="flex flex-col p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                    {iconMap[badge.icon]}
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{badge.name}</h3>
                <p className="text-sm text-gray-500 mb-4 flex-1">{badge.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {badge.condition}
                  </div>
                  <div className="text-sm font-bold text-indigo-600">
                    +{badge.points} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
