import React, { useState, useEffect } from 'react';

const MENU_ITEMS = [
  {
    title: 'CE Marking',
    href: '/ce-certification/',
    children: [
      { title: 'Overview', href: '/ce-certification/' },
      { title: 'Machinery Directive', href: '/machinery/' },
      { title: 'Construction Products', href: '/construction-products/' },
      { title: 'Lifts Directive', href: '/lifts/' },
      { title: 'Pressure Equipment (PED)', href: '/ped/' },
      { title: 'ATEX Directive', href: '/atex/' },
      { title: 'LVD & EMC Directives', href: '/lvd-emc/' },
      { title: 'Marine Equipment', href: '/marine-equipment/' },
      { title: 'Railway Standards', href: '/railway/' },
      { title: 'Welder Qualifications', href: '/welder-qualifications/' },
      { title: 'Cement Certification', href: '/cement/' },
      { title: 'Electrical & Electronics', href: '/electrical-electronic-products/' }
    ]
  },
  {
    title: 'Food & Agri',
    href: '/food-certification/',
    children: [
      { title: 'Overview', href: '/food-certification/' },
      { title: 'ISO 22000 Food Safety', href: '/food-certification/iso-22000/' },
      { title: 'FSSC 22000', href: '/food-certification/fssc-22000/' },
      { title: 'HACCP', href: '/food-certification/haccp/' },
      { title: 'GLOBALG.A.P.', href: '/food-certification/globalgap/' },
      { title: 'GLOBALG.A.P. GRASP', href: '/food-certification/globalgap-grasp/' },
      { title: 'GLOBALG.A.P. CoC', href: '/food-certification/globalgap-coc/' },
      { title: 'GLOBALG.A.P. SPRING', href: '/food-certification/globalgap-spring/' },
      { title: 'BRCGS Food Safety', href: '/food-certification/brc/' },
      { title: 'BRCGS Packaging & Materials', href: '/food-certification/brc/' },
      { title: 'IFS Food', href: '/food-certification/ifs/' },
      { title: 'Non-GMO Products', href: '/food-certification/non-gmo-products/' }
    ]
  },
  {
    title: 'Social Audits',
    href: '/social-audits/',
    children: [
      { title: 'Overview', href: '/social-audits/' },
      { title: 'SEDEX / SMETA Audit', href: '/social-audits/sedex/' },
      { title: 'SA8000 Social Accountability', href: '/social-audits/sa-8000/' },
      { title: 'WRAP Audit', href: '/social-audits/wrap/' },
      { title: 'SLCP Social & Labor', href: '/social-audits/slcp/' },
      { title: 'C-TPAT Supply Chain', href: '/social-audits/ctpat/' },
      { title: 'Code of Conduct Audits', href: '/social-audits/code-of-conduct/' },
      { title: 'ISO 26000 Social Responsibility', href: '/social-audits/iso-26000/' },
      { title: 'ISO 28000 Supply Chain Security', href: '/social-audits/iso-28000/' }
    ]
  },
  {
    title: 'Management Systems',
    href: '/management-systems/',
    children: [
      { title: 'Overview', href: '/management-systems/' },
      { title: 'ISO 9001 Quality', href: '/management-system/iso-9001/' },
      { title: 'ISO 14001 Environment', href: '/management-system/iso-14001/' },
      { title: 'ISO 45001 Occupational Safety', href: '/management-system/iso-45001/' },
      { title: 'ISO 27001 Info Security', href: '/management-system/iso-27001/' },
      { title: 'ISO 50001 Energy Management', href: '/management-system/iso-50001/' },
      { title: 'ISO 22000 Food Safety', href: '/food-certification/iso-22000/' },
      { title: 'ISO 37001 Anti-Bribery', href: '/management-system/iso-37001/' },
      { title: 'ISO 13485 Medical Devices', href: '/medical-devices/' }
    ]
  },
  {
    title: 'Sustainability',
    href: '/sustainability/',
    children: [
      { title: 'Overview', href: '/sustainability/' },
      { title: 'Aluminium Stewardship (ASI)', href: '/sustainability/asi/' },
      { title: 'CBAM Verification', href: '/sustainability/cbam-verification/' },
      { title: 'Carbon Footprint (ISO 14064)', href: '/sustainability/carbon-footprint/' },
      { title: 'Life Cycle Assessment (LCA)', href: '/sustainability/lca/' },
      { title: 'Environmental Product Declaration (EPD)', href: '/sustainability/epd/' },
      { title: 'Health Product Declaration (HPD)', href: '/sustainability/hpd/' },
      { title: 'BRSR Reporting', href: '/sustainability/brsr/' }
    ]
  },
  {
    title: 'Training',
    href: '/training/',
    children: [
      { title: 'Overview', href: '/training/' },
      { title: 'FoSTaC Food Safety Training', href: '/training/fostac/' }
    ]
  },
  { title: 'Accreditations', href: '/accreditations/' },
  { title: 'Certified Clients', href: '/certified-clients/' },
  { title: 'Contact Us', href: '/contact/' }
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const triggerBtn = document.getElementById('open-mobile-menu-btn');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', handleOpen);
    }
    return () => {
      if (triggerBtn) {
        triggerBtn.removeEventListener('click', handleOpen);
      }
    };
  }, []);

  const toggleDropdown = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex bg-black/95 backdrop-blur-2xl text-white">
      <div className="w-full h-full p-6 overflow-y-auto relative flex flex-col justify-between">
        
        <div>
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <a href="/" onClick={() => setIsOpen(false)} className="inline-block">
              <img 
                src="https://res.cloudinary.com/dwnnakrrh/image/upload/f_auto,q_auto:good,w_1600/v1782367859/eurocert/Untitled_design_19_.png.png" 
                alt="EUROCERT Logo" 
                className="h-10 w-auto" 
              />
            </a>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-2xl text-white/90 hover:text-white transition-colors"
              aria-label="Close mobile navigation"
            >
              &times;
            </button>
          </div>

          {/* Nav List with Expandable Service Dropdowns */}
          <nav className="space-y-1 text-sm font-semibold uppercase tracking-wider heading-font">
            {MENU_ITEMS.map((item, idx) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedIndex === idx;

              return (
                <div key={item.title} className="border-b border-white/10 py-1">
                  <div className="flex items-center justify-between py-2">
                    <a 
                      href={item.href} 
                      onClick={() => setIsOpen(false)} 
                      className="hover:text-eurogold-400 transition-colors flex-1"
                    >
                      {item.title}
                    </a>

                    {hasChildren && (
                      <button
                        type="button"
                        onClick={() => toggleDropdown(idx)}
                        className="p-2 text-white/70 hover:text-eurogold-400 transition-transform duration-300"
                        aria-label={`Toggle ${item.title} submenu`}
                      >
                        <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${isExpanded ? 'rotate-180 text-eurogold-400' : ''}`}></i>
                      </button>
                    )}
                  </div>

                  {/* Submenu Dropdown List */}
                  {hasChildren && isExpanded && (
                    <div className="pl-4 pb-3 pt-1 space-y-2.5 normal-case font-sans text-xs text-white/80 border-l-2 border-eurogold-400/40 ml-2 my-1 animate-fadeIn">
                      {item.children.map((child) => (
                        <a
                          key={child.title}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className="block py-1 hover:text-eurogold-400 transition-colors flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-eurogold-400/60"></span>
                          {child.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer Contact Info */}
        <div className="pt-6 mt-6 border-t border-white/10 text-xs text-white/60 space-y-2">
          <div><i className="fas fa-phone mr-2 text-eurogold-400"></i>+91 9316012883</div>
          <div><i className="fas fa-envelope mr-2 text-eurogold-400"></i>info@eurocert.in</div>
        </div>

      </div>
    </div>
  );
}
