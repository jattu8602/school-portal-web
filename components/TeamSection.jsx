'use client'
import { teamMembers } from "@/constants";
import TeamCard from "./TeamCard";

export default function TeamSection() {
  return (
    <div className="mt-12 bg-white p-6 rounded-lg shadow">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
        <p className="text-gray-600 mt-2">
          Meet the talented individuals behind Present Sir
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {teamMembers.map((member, index) => (
          <TeamCard key={index} member={member} />
        ))}
      </div>
    </div>
  );
}