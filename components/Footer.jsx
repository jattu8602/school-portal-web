import { FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6'; // FaXTwitter is the actual X (Twitter) icon
import Link from 'next/link';


export default function Footer() {
  return (
   <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
  <p className="text-sm text-muted-foreground">
    &copy; {new Date().getFullYear()} PresentSir. All rights reserved.
  </p>
  <div className="flex space-x-6 mt-4 md:mt-0">
    <Link href="https://www.instagram.com/presentsir.in/" target="_blank" className="text-muted-foreground hover:text-primary">
      <span className="sr-only">Instagram</span>
      <FaInstagram className="h-6 w-6" />
    </Link>
    <Link href="https://www.linkedin.com/in/present-sir-99624634a" target="_blank" className="text-muted-foreground hover:text-primary">
      <span className="sr-only">LinkedIn</span>
      <FaLinkedin className="h-6 w-6" />
    </Link>
    <Link href="https://x.com/presentsirteam" target="_blank" className="text-muted-foreground hover:text-primary">
      <span className="sr-only">X (Twitter)</span>
      <FaXTwitter className="h-6 w-6" />
    </Link>
  </div>
</div>

  );
}
