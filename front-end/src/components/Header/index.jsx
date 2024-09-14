import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCoins,
  faEnvelope,
  faMobile,
  faAddressBook,
  faHouse,
  faFileCode,
  faNewspaper,
  faUserTie,
  faChevronDown,
  faChevronUp,
  faBook,
  faClipboard,
  faFileAlt,
  faFlask,
  faProjectDiagram,
  faUpload
} from "@fortawesome/free-solid-svg-icons";

const qr_momo = "/placeholder.svg?height=350&width=350";

// Mock data for resources
const resourcesData = [
  {
    id: '1',
    name: 'Học kỳ 1 - 2023-2024',
    subjects: [
      {
        name: 'Lập trình Web',
        sections: [
          { name: 'Tài liệu tham khảo', icon: faBook },
          { name: 'Bài tập', icon: faClipboard },
          { name: 'Slides', icon: faFileAlt },
          { name: 'Bài tập thực hành', icon: faFlask },
          { name: 'Project', icon: faProjectDiagram },
          { name: 'Bài nộp', icon: faUpload }
        ]
      },
    ]
  },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedSemester, setExpandedSemester] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [menuState, setMenuState] = useState('full'); // 'full', 'icons', 'burger'
  const navRef = useRef(null);
  const navItemsRef = useRef(null);

  const navItems = [
    { icon: faHouse, text: "Trang chủ", href: "/" },
    { icon: faFileCode, text: "Tài nguyên", href: "/resources" },
    { icon: faNewspaper, text: "Bài viết", href: "/post" },
    { icon: faAddressBook, text: "Liên hệ", href: "#", hasSubmenu: true },
    { icon: faCoins, text: "Donate", href: "#", hasQR: true },
    { icon: faUserTie, text: "Quản lý", href: "/admin" },
  ];

  const contactInfo = [
    { icon: faMobile, label: "Số điện thoại:", value: "0383741660" },
    { icon: faEnvelope, label: "Email:", value: "iamhoangkhang@icloud.com" },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (navRef.current && navItemsRef.current) {
        const navWidth = navRef.current.offsetWidth;
        const itemsWidth = navItemsRef.current.scrollWidth;
        const containerWidth = navRef.current.parentElement.offsetWidth;

        if (containerWidth < 768) {
          setMenuState('burger');
        } else if (navWidth < itemsWidth) {
          setMenuState('icons');
        } else {
          setMenuState('full');
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(handleResize);
    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (navRef.current) {
        resizeObserver.unobserve(navRef.current);
      }
    };
  }, []);

  const toggleSemester = (semesterId) => {
    setExpandedSemester(expandedSemester === semesterId ? null : semesterId);
    setExpandedSubject(null);
  };

  const toggleSubject = (subjectName) => {
    setExpandedSubject(expandedSubject === subjectName ? null : subjectName);
  };

  const renderResourcesMenu = () => (
    <div className="bg-blue-800 p-3 rounded-lg shadow-lg w-full">
      {resourcesData.map((semester) => (
        <div key={semester.id} className="mb-2">
          <button
            onClick={() => toggleSemester(semester.id)}
            className="w-full text-left text-white hover:text-amber-400 transition-colors flex justify-between items-center"
          >
            <span>{semester.name}</span>
            <FontAwesomeIcon icon={expandedSemester === semester.id ? faChevronUp : faChevronDown} />
          </button>
          {expandedSemester === semester.id && (
            <div className="pl-4 mt-2">
              {semester.subjects.map((subject, subIndex) => (
                <div key={subIndex} className="mb-2">
                  <button
                    onClick={() => toggleSubject(subject.name)}
                    className="w-full text-left text-white hover:text-amber-400 transition-colors flex justify-between items-center"
                  >
                    <span>{subject.name}</span>
                    <FontAwesomeIcon icon={expandedSubject === subject.name ? faChevronUp : faChevronDown} />
                  </button>
                  {expandedSubject === subject.name && (
                    <ul className="pl-4 mt-1">
                      {subject.sections.map((section, secIndex) => (
                        <li key={secIndex} className="mb-1">
                          <a href="#" className="text-white hover:text-amber-400 transition-colors flex items-center">
                            <FontAwesomeIcon icon={section.icon} className="mr-2" />
                            <span>{section.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderContactInfo = () => (
    <div className="bg-blue-800 p-3 rounded-lg shadow-lg">
      {contactInfo.map((info, idx) => (
        <div key={idx} className="flex items-center mb-2 last:mb-0">
          <FontAwesomeIcon icon={info.icon} className="text-amber-400 mr-2" />
          <span className="text-white font-semibold mr-1">{info.label}</span>
          <a href="#" className="text-white hover:text-amber-400 transition-colors">
            {info.value}
          </a>
        </div>
      ))}
    </div>
  );

  const renderDonateQR = () => (
    <div className="bg-blue-800 p-3 rounded-lg shadow-lg">
      <img src={qr_momo} alt="QR Code" className="w-64 h-64" />
    </div>
  );

  const renderNavItems = () => (
    <ul ref={navItemsRef} className="flex flex-nowrap justify-end space-x-2 lg:space-x-4">
      {navItems.map((item, index) => (
        <li key={index} className="whitespace-nowrap">
          {item.hasSubmenu ? (
            <div className="relative">
              <button 
                onClick={() => setIsContactOpen(!isContactOpen)}
                className="text-white hover:text-amber-400 transition-colors flex items-center px-2 py-1"
              >
                <FontAwesomeIcon icon={item.icon} className="mr-2" />
                {menuState === 'full' && item.text}
              </button>
              {isContactOpen && (
                <div className="absolute top-full right-0 mt-2">
                  {renderContactInfo()}
                </div>
              )}
            </div>
          ) : item.hasQR ? (
            <div className="relative">
              <button 
                onClick={() => setIsDonateOpen(!isDonateOpen)}
                className="text-white hover:text-amber-400 transition-colors flex items-center px-2 py-1"
              >
                <FontAwesomeIcon icon={item.icon} className="mr-2" />
                {menuState === 'full' && item.text}
              </button>
              {isDonateOpen && (
                <div className="absolute top-full right-0 mt-2">
                  {renderDonateQR()}
                </div>
              )}
            </div>
          ) : (
            <a 
              href={item.href} 
              className="text-white hover:text-amber-400 transition-colors flex items-center px-2 py-1"
            >
              <FontAwesomeIcon icon={item.icon} className="mr-2" />
              {menuState === 'full' && item.text}
            </a>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 shadow-lg">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <a className="text-white font-extrabold text-lg md:text-xl flex items-baseline" href="/">
            <span>iam</span>
            <span className="text-amber-400 text-xl md:text-2xl ml-1">HoangKhang</span>
          </a>

          <nav ref={navRef} className={menuState !== 'burger' ? 'block' : 'hidden'}>
            {renderNavItems()}
          </nav>

          {menuState === 'burger' && (
            <div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-amber-400 transition-colors p-2"
              >
                <FontAwesomeIcon icon={faBars} size="lg" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && menuState === 'burger' && (
        <nav className="bg-blue-800 shadow-lg">
          <ul className="py-2">
            {navItems.map((item, index) => (
              <li key={index} className="px-4 py-2">
                {item.text === "Tài nguyên" ? (
                  <div>
                    <button
                      onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                      className="w-full text-left text-white hover:text-amber-400 transition-colors flex justify-between items-center"
                    >
                      <span>
                        <FontAwesomeIcon icon={item.icon} className="mr-2" />
                        {item.text}
                      </span>
                      <FontAwesomeIcon icon={isResourcesOpen ? faChevronUp : faChevronDown} />
                    </button>
                    {isResourcesOpen && renderResourcesMenu()}
                  </div>
                ) : item.hasSubmenu ? (
                  <div>
                    <button
                      onClick={() => setIsContactOpen(!isContactOpen)}
                      className="w-full text-left text-white hover:text-amber-400 transition-colors flex justify-between items-center"
                    >
                      <span>
                        <FontAwesomeIcon icon={item.icon} className="mr-2" />
                        {item.text}
                      </span>
                      <FontAwesomeIcon icon={isContactOpen ? faChevronUp : faChevronDown} />
                    </button>
                    {isContactOpen && renderContactInfo()}
                  </div>
                ) : item.hasQR ? (
                  <div>
                    <button
                      onClick={() => setIsDonateOpen(!isDonateOpen)}
                      className="w-full text-left text-white hover:text-amber-400 transition-colors flex justify-between items-center"
                    >
                      <span>
                        <FontAwesomeIcon icon={item.icon} className="mr-2" />
                        {item.text}
                      </span>
                      <FontAwesomeIcon icon={isDonateOpen ? faChevronUp : faChevronDown} />
                    </button>
                    {isDonateOpen && renderDonateQR()}
                  </div>
                ) : (
                  <a 
                    href={item.href}
                    className="text-white hover:text-amber-400 transition-colors flex items-center"
                  >
                    <FontAwesomeIcon icon={item.icon} className="mr-2" />
                    {item.text}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}