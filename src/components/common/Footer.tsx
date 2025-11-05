import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const links = [
    { name: "프라이버시 정책", englishName: "Privacy Policy", path: "#" },
    { name: "서비스 약관", englishName: "Terms of Service", path: "#" },
    { name: "연락처", englishName: "Contact", path: "#" },
  ];

  return (
    <footer className="w-full bg-gray-100 text-gray-600 border-t border-gray-200 mt-12 py-8">
      <div className="mx-auto max-w-5xl px-4 flex flex-col items-center space-y-4">
        <p className="text-sm font-medium">
          © {currentYear} 소금브레드 All Rights Reserved.
        </p>

        <div className="flex flex-wrap justify-center space-x-4 sm:space-x-8 text-sm">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="hover:text-indigo-600 transition duration-150 whitespace-nowrap"
            >
              {link.name} ({link.englishName})
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
