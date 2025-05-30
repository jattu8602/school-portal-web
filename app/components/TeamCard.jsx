import Image from 'next/image'
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react'

export default function TeamCard({ member }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-teal-400 relative">
        <Image
          src={member.photo}
          alt={member.name}
          width={128}
          height={128}
          className="w-full h-full object-cover"
          priority={false}
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          onError={(e) => {
            e.target.onerror = null
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              member.name
            )}&background=0D8ABC&color=fff&size=128`
          }}
        />
      </div>

      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
      <p className="text-gray-500 text-sm mb-4">{member.tag}</p>

      <div className="flex space-x-2">
        {member.links.github && (
          <a
            href={member.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            aria-label={`${member.name}'s GitHub profile`}
          >
            <Github size={16} />
          </a>
        )}

        {member.links.twitter && (
          <a
            href={member.links.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            aria-label={`${member.name}'s Twitter profile`}
          >
            <Twitter size={16} />
          </a>
        )}

        {member.links.linkedin && (
          <a
            href={member.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            aria-label={`${member.name}'s LinkedIn profile`}
          >
            <Linkedin size={16} />
          </a>
        )}

        {member.links.instagram && (
          <a
            href={member.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            aria-label={`${member.name}'s Instagram profile`}
          >
            <Instagram size={16} />
          </a>
        )}
      </div>
    </div>
  )
}
