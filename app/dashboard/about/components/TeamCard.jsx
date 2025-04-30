import { Github, Twitter, Linkedin, Instagram } from "lucide-react"

export default function TeamCard({ member }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-teal-400 relative">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0D8ABC&color=fff`;
          }}
        />
      </div>

      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{member.role}</p>

      <div className="flex space-x-2">
        {member.social.github && (
          <a
            href={member.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            <Github size={16} />
          </a>
        )}

        {member.social.twitter && (
          <a
            href={member.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            <Twitter size={16} />
          </a>
        )}

        {member.social.linkedin && (
          <a
            href={member.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            <Linkedin size={16} />
          </a>
        )}

        {member.social.instagram && (
          <a
            href={member.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            <Instagram size={16} />
          </a>
        )}
      </div>
    </div>
  )
}