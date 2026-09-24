import React, { useState, useEffect } from 'react';

const CE_CARDS = [
  {
    id: 'construction',
    title: 'CE Certification for Construction Products',
    shortTitle: 'Construction Products (CPR)',
    href: '/construction-products/',
    description: 'Construction products must comply with the Construction Products Regulation (CPR) to be placed on the EU market. We help manufacturers achieve CE marking for construction materials, ensuring they meet all safety and performance requirements.',
    image: 'https://res.cloudinary.com/dwnnakrrh/image/upload/f_auto,q_auto:good,w_1600/v1782367580/eurocert/CONSTRUCTION.jpeg.jpg',
    items: ['Building materials and components', 'Structural elements', 'Insulation materials', 'Roofing and flooring products', 'Windows and doors']
  },
  {
    id: 'lifts',
    title: 'CE Certification for Lifts',
    shortTitle: 'Lifts Directive (2014/33/EU)',
    href: '/lifts/',
    description: 'Lifts and lifting equipment must comply with the Lifts Directive (2014/33/EU) to be sold in the EU. We provide comprehensive certification services for all types of lifts and lifting equipment.',
    image: 'https://res.cloudinary.com/dwnnakrrh/image/upload/f_auto,q_auto:good,w_1600/v1782367739/eurocert/LIFTS.jpeg.jpg',
    items: ['Passenger lifts', 'Goods lifts', 'Service lifts', 'Lifting platforms', 'Safety components for lifts']
  },
  {
    id: 'machinery',
    title: 'CE Marking for Machinery',
    shortTitle: 'Machinery Directive (2006/42/EC)',
    href: '/machinery/',
    description: 'The Machinery Directive (2006/42/EC) requires that machinery placed on the EU market must be CE marked. We assist manufacturers in achieving compliance for all types of machinery and equipment.',
    image: 'https://res.cloudinary.com/dwnnakrrh/image/upload/f_auto,q_auto:good,w_1600/v1782367740/eurocert/MACHINERY.jpeg.jpg',
    items: ['Industrial machinery', 'Agricultural machinery', 'Construction machinery', 'Food processing equipment', 'Packaging machinery']
  },
  {
    id: 'cement',
    title: 'CE Marking for Cement',
    shortTitle: 'Cement Products',
    href: '/cement/',
    description: 'Cement products must comply with harmonized European standards to receive CE marking. We provide certification services for various types of cement products.',
    image: 'https://res.cloudinary.com/dwnnakrrh/image/upload/f_auto,q_auto:good,w_1600/v1782367829/eurocert/R1.jpeg.jpg',
    items: ['Portland cement', 'Composite cement', 'Specialized cement products', 'Performance testing and assessment']
  },
  {
    id: 'ped',
    title: 'PED Certification (2014/68/EU)',
    shortTitle: 'Pressure Equipment Directive',
    href: '/ped/',
    description: 'The Pressure Equipment Directive (PED) applies to pressure equipment and assemblies with a maximum allowable pressure greater than 0.5 bar. We provide comprehensive PED certification services.',
    image: 'https://res.cloudinary.com/dwnnakrrh/image/upload/f_auto,q_auto:good,w_1600/v1782367819/eurocert/PED.jpeg.jpg',
    items: ['Pressure vessels', 'Steam generators', 'Piping systems', 'Safety accessories', 'Pressure accessories']
  },
  {
    id: 'rohs',
    title: 'RoHS Certification',
    shortTitle: 'Restriction of Hazardous Substances',
    href: '/rohs/',
    description: 'The RoHS Directive restricts the use of certain hazardous substances in electrical and electronic equipment. We help manufacturers ensure compliance with RoHS requirements.',
    image: 'https://res.cloudinary.com/dwnnakrrh/image/upload/f_auto,q_auto:good,w_1600/v1782367856/eurocert/ROHS.jpeg.jpg',
    items: ['RoHS compliance testing', 'Material analysis', 'Documentation support', 'Supply chain verification']
  },
  {
    id: 'lvd-emc',
    title: 'CE Marking LVD/EMC',
    shortTitle: 'Low Voltage & EMC Directive',
    href: '/lvd-emc/',
    description: 'The Low Voltage Directive (LVD) and Electromagnetic Compatibility (EMC) Directive are essential for electrical and electronic equipment sold in the EU. We provide comprehensive CE marking services for LVD and EMC compliance.',
    image: 'https://res.cloudinary.com/dwnnakrrh/image/upload/f_auto,q_auto:good,w_1600/v1782367742/eurocert/LVDEMC.jpeg.jpg',
    items: ['LVD compliance assessment', 'EMC testing and certification', 'Technical documentation preparation', 'CE marking support']
  },
  {
    id: 'electrical',
    title: 'Electrical & Electronic Products',
    shortTitle: 'LVD / EMC / RoHS',
    href: '/electrical-electronic-products/',
    description: 'Comprehensive CE compliance support for electrical and electronic products across LVD, EMC, and RoHS directives.',
    image: 'https://res.cloudinary.com/dwnnakrrh/image/upload/f_auto,q_auto:good,w_1600/v1782367833/eurocert/R7.jpeg.jpg',
    items: ['Product classification and directive mapping', 'LVD and EMC testing coordination', 'RoHS material compliance verification', 'Technical file and declaration of conformity support']
  },
  {
    id: 'reach',
    title: 'REACH Compliance',
    shortTitle: 'Chemical Substances Regulation',
    href: '/reach/',
    description: 'REACH (Registration, Evaluation, Authorisation and Restriction of Chemicals) is a European Union regulation addressing the production and use of chemical substances. We provide REACH compliance services to help manufacturers and importers meet regulatory requirements.',
    image: 'https://res.cloudinary.com/dwnnakrrh/image/upload/f_auto,q_auto:good,w_1600/v1782367846/eurocert/REACH.jpeg.jpg',
    items: ['REACH compliance assessment', 'Chemical substance registration support', 'Restricted substance verification', 'Supply chain compliance']
  },
  {
    id: 'atex',
    title: 'ATEX Certification',
    shortTitle: 'Explosive Atmospheres',
    href: '/atex/',
    description: 'ATEX (Atmospheres Explosibles) certification is required for equipment and protective systems intended for use in potentially explosive atmospheres. We provide comprehensive ATEX certification services.',
    image: 'https://res.cloudinary.com/dwnnakrrh/image/upload/f_auto,q_auto:good,w_1600/v1782367958/eurocert/c10.png.png',
    items: ['ATEX equipment certification', 'Explosive atmosphere risk assessment', 'Protective systems certification', 'Zone classification support']
  },
  {
    id: 'pi-mark',
    title: 'PI Mark - Transportable Pressure Equipment',
    shortTitle: 'TPED Directive',
    href: '/pi-mark/',
    description: 'The PI (Periodic Inspection) Mark is required for transportable pressure equipment in accordance with the Transportable Pressure Equipment Directive (TPED). We provide PI Mark certification services.',
    image: 'https://res.cloudinary.com/dwnnakrrh/image/upload/f_auto,q_auto:good,w_1600/v1782367825/eurocert/PI-MARK.jpeg.jpg',
    items: ['PI Mark certification', 'Transportable pressure equipment inspection', 'TPED compliance verification', 'Periodic inspection services']
  },
  {
    id: 'railway',
    title: 'Railway Interoperability Certification',
    shortTitle: 'Railway Systems & Components',
    href: '/railway/',
    description: 'Railway Interoperability certification ensures that railway systems, subsystems, and components meet European standards for safe and efficient cross-border railway operations. We provide comprehensive railway interoperability certification services.',
    image: 'https://res.cloudinary.com/dwnnakrrh/image/upload/f_auto,q_auto:good,w_1600/v1782367839/eurocert/RAILWAY.jpeg.jpg',
    items: ['Railway interoperability certification', 'TSI compliance', 'Railway component certification', 'EN 15085 welding certification']
  },
  {
    id: 'marine',
    title: 'Marine Equipment Directive Certification',
    shortTitle: 'MED Wheel Mark',
    href: '/marine-equipment/',
    description: 'The Marine Equipment Directive (MED) ensures that marine equipment meets safety and environmental protection standards for use on EU ships. We provide MED certification services.',
    image: 'https://res.cloudinary.com/dwnnakrrh/image/upload/f_auto,q_auto:good,w_1600/v1782367744/eurocert/MARINE.jpeg.jpg',
    items: ['Marine Equipment Directive certification', 'MED wheel mark certification', 'Marine equipment type approval', 'Ship safety equipment certification']
  },
  {
    id: 'medical',
    title: 'Medical Devices (EU MDR / UK MDR)',
    shortTitle: 'Medical Devices',
    href: '/medical-devices/',
    description: 'Regulatory support for medical devices including MDR classification, technical documentation, clinical evaluation, and post-market compliance.',
    image: 'https://res.cloudinary.com/dwnnakrrh/image/upload/f_auto,q_auto:good,w_1600/v1782367751/eurocert/MEDICAL-DEVICES.jpeg.jpg',
    items: ['Device classification and conformity route', 'Technical documentation and CER support', 'ISO 14971 risk management integration', 'EU representative and UK responsible person support']
  }
];

export default function CeCertificationCards() {
  const [activeModalCard, setActiveModalCard] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModalCard(null);
    };
    if (activeModalCard) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModalCard]);

  return (
    <section className="py-20 lg:py-28 bg-[#030a16] relative overflow-hidden text-white">
      {/* Background Ambient Lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#d8ad4c]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="heading-font text-xs font-bold text-[#d8ad4c] uppercase tracking-[0.4em] block mb-3">
            Comprehensive Services
          </span>
          <h2 className="heading-font text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Our <span className="text-[#d8ad4c]">Certifications</span>
          </h2>
          <p className="text-white/70 text-base md:text-lg leading-relaxed">
            Choose from our wide range of CE certification services tailored to your industry needs
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CE_CARDS.map((card) => (
            <div 
              key={card.id}
              className="bg-[#061226]/90 border border-white/10 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-[#d8ad4c]/50 hover:shadow-[0_10px_30px_rgba(216,173,76,0.15)] group"
            >
              {/* Card Thumbnail */}
              <div className="relative h-48 overflow-hidden bg-[#030a16]">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  loading="lazy" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061226] via-transparent to-black/30"></div>
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md border border-[#d8ad4c]/40 rounded-full text-[10px] font-bold text-[#d8ad4c] tracking-wider uppercase">
                  {card.shortTitle}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="heading-font text-lg font-bold text-white mb-3 group-hover:text-[#d8ad4c] transition-colors leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-white/70 text-xs leading-relaxed mb-6 line-clamp-3">
                    {card.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveModalCard(card)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#d8ad4c]/10 hover:bg-[#d8ad4c] text-[#d8ad4c] hover:text-[#030a16] border border-[#d8ad4c]/30 text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Know More</span>
                    <i className="fas fa-arrow-right text-[10px] transition-transform group-hover/btn:translate-x-1"></i>
                  </button>
                  <a
                    href={card.href}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal Popup Overlay */}
      {activeModalCard && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          {/* Backdrop Overlay Click Handler */}
          <div 
            className="absolute inset-0" 
            onClick={() => setActiveModalCard(null)}
          ></div>

          {/* Modal Content Box */}
          <div className="relative w-full max-w-2xl bg-[#09152a] border border-[#d8ad4c]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalCard(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white flex items-center justify-center text-lg transition-colors"
              aria-label="Close modal popup"
            >
              &times;
            </button>

            {/* Modal Category Badge */}
            <span className="inline-block text-[11px] font-extrabold text-[#d8ad4c] tracking-[0.25em] uppercase mb-2">
              {activeModalCard.shortTitle}
            </span>

            {/* Modal Title */}
            <h3 className="heading-font text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
              {activeModalCard.title}
            </h3>

            {/* Modal Description */}
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              {activeModalCard.description}
            </p>

            {/* Modal Items Checklist */}
            {activeModalCard.items && activeModalCard.items.length > 0 && (
              <div className="space-y-3 mb-8 bg-black/30 p-5 rounded-2xl border border-white/5">
                {activeModalCard.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-white/90 font-medium">
                    <div className="w-5 h-5 rounded-md bg-[#d8ad4c]/20 border border-[#d8ad4c]/50 flex items-center justify-center text-[#d8ad4c] text-xs font-bold flex-shrink-0">
                      âœ“
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-white/10">
              <a
                href={activeModalCard.href}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-[#d8ad4c] text-[#d8ad4c] hover:bg-[#d8ad4c] hover:text-[#030a16] text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>&rarr; OPEN DETAILS PAGE</span>
              </a>

              <a
                href="/contact/#contact-form"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#d8ad4c] text-[#030a16] font-bold text-xs uppercase tracking-wider hover:bg-[#e5bc5f] shadow-[0_0_20px_rgba(216,173,76,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <i className="fas fa-envelope text-xs"></i>
                <span>CONTACT US</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
