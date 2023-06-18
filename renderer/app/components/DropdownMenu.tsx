import { useState } from "react";
import DownArrow from "@/app/components/icons/DownArrow";
import Link from "next/link";

type DropdownMenuProps = {
  title: string;
  items: {
    label: string;
    link: string;
  }[];
  className?: string;
};

export default function DropdownMenu({
  title,
  items,
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col justify-center items-center space-x-1 focus:outline-none hover:cursor-pointer">
        {title}
        <DownArrow />
      </div>
      {isOpen && (
        <div className="absolute z-10 py-2 w-40 bg-white rounded-md shadow-lg left-1/2 transform -translate-x-1/2">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
