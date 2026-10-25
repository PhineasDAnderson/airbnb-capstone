import React, { useState, useRef, useEffect } from 'react';
import './Footer.css';

// showGetaways: the "Inspiration for future getaways" tabs show on most pages,
// but the listing details page turns them off
function Footer({ showGetaways = true }) {
  const [activeTab, setActiveTab] = useState('Popular');

  // Separate dropdown visibility states
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  // Selected state tracking (dollars, because the prices on the site are in dollars)
  const [selectedLang, setSelectedLang] = useState('English (US)');
  const [selectedCurrency, setSelectedCurrency] = useState('$ USD');

  const langRef = useRef(null);
  const currencyRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setIsCurrencyOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    'Popular', 'Arts & culture', 'Beach', 'Mountains',
    'Outdoors', 'Things to do', 'Airbnb-friendly apartments'
  ];

  const destinationData = {
    Popular: [
      { name: "St. Petersburg", type: "House rentals" },
      { name: "Raleigh", type: "Vacation rentals" },
      { name: "San Diego", type: "Cottage rentals" },
      { name: "Detroit", type: "Condo rentals" },
      { name: "Albuquerque", type: "Vacation rentals" },
      { name: "Portland", type: "Cabin rentals" },
      { name: "Minneapolis", type: "Condo rentals" },
      { name: "Broken Bow", type: "Vacation rentals" },
      { name: "Galveston", type: "Villa rentals" },
      { name: "San Juan", type: "Monthly rentals" },
      { name: "Osaka", type: "Apartment rentals" }
    ]
  };

  const languages = ['English (US)', 'English (ZA)', 'English (UK)', 'Français', 'Deutsch', 'Español'];
  const currencies = ['$ USD', 'R ZAR', '€ EUR', '£ GBP', 'A$ AUD'];

  return (
    <footer className="airbnb-clone-footer">
      {/* Getaways tabs (hidden on the listing details page) */}
      {showGetaways && (
        <>
          <div className="getaways-section-container">
            <h2>Inspiration for future getaways</h2>

            <div className="getaways-tabs-bar">
              {categories.map((tab) => (
                <button
                  key={tab}
                  className={`getaway-tab-btn ${activeTab === tab ? 'active-tab' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'Popular' && (
              <div className="getaways-grid-matrix">
                {destinationData.Popular.map((item, idx) => (
                  <div key={idx} className="getaway-grid-item">
                    <div className="destination-title">{item.name}</div>
                    <div className="destination-subtitle">{item.type}</div>
                  </div>
                ))}

                <div className="getaway-grid-item show-more-node">
                  <div className="destination-title show-more-wrapper">
                    <span>Show more</span>
                    <span className="chevron-icon">˅</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr className="section-divider-line" />
        </>
      )}

      {/* Main Link Columns */}
      <div className="footer-columns-container">
        <div className="footer-column">
          <h3>Support</h3>
          <ul>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#safety">Get help with a safety issue</a></li>
            <li><a href="#aircover">AirCover</a></li>
            <li><a href="#discrimination">Anti-discrimination</a></li>
            <li><a href="#disability">Disability support</a></li>
            <li><a href="#cancellation">Cancellation options</a></li>
            <li><a href="#neighborhood">Report neighborhood concern</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Hosting</h3>
          <ul>
            <li><a href="#host">Airbnb your home</a></li>
            <li><a href="#experience">Airbnb your experience</a></li>
            <li><a href="#service">Airbnb your service</a></li>
            <li><a href="#host-aircover">AirCover for Hosts</a></li>
            <li><a href="#resources">Hosting resources</a></li>
            <li><a href="#forum">Community forum</a></li>
            <li><a href="#responsibly">Hosting responsibly</a></li>
            <li><a href="#class">Join a free hosting class</a></li>
            <li><a href="#cohost">Find a co-host</a></li>
            <li><a href="#refer">Refer a host</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Airbnb</h3>
          <ul>
            <li><a href="#release">2026 Summer Release</a></li>
            <li><a href="#newsroom">Newsroom</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#investors">Investors</a></li>
            <li><a href="#stays">Airbnb.org emergency stays</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="footer-bottom-bar">
        <div className="footer-legal-left">
          <span>© 2026 Airbnb, Inc.</span>
          <span className="footer-dot">·</span>
          <a href="#privacy">Privacy</a>
          <span className="footer-dot">·</span>
          <a href="#terms">Terms</a>
          <span className="footer-dot">·</span>
          <a href="#sitemap">Sitemap</a>
        </div>

        <div className="footer-interactive-right">
          {/* Language Dropdown */}
          <div className="footer-dropdown-wrapper" ref={langRef}>
            <button
              type="button"
              className="footer-mini-btn"
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsCurrencyOpen(false);
              }}
            >
              <span>🌐</span>
              <span>{selectedLang}</span>
              <span className={`mini-chevron ${isLangOpen ? 'open' : ''}`}>˅</span>
            </button>

            {isLangOpen && (
              <div className="mini-select-menu">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className={`mini-menu-item ${selectedLang === lang ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedLang(lang);
                      setIsLangOpen(false);
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Dropdown */}
          <div className="footer-dropdown-wrapper" ref={currencyRef}>
            <button
              type="button"
              className="footer-mini-btn"
              onClick={() => {
                setIsCurrencyOpen(!isCurrencyOpen);
                setIsLangOpen(false);
              }}
            >
              <span>{selectedCurrency}</span>
              <span className={`mini-chevron ${isCurrencyOpen ? 'open' : ''}`}>˅</span>
            </button>

            {isCurrencyOpen && (
              <div className="mini-select-menu">
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    className={`mini-menu-item ${selectedCurrency === curr ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCurrency(curr);
                      setIsCurrencyOpen(false);
                    }}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Social Media Links */}
          <div className="footer-social-links">
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg className="social-svg" viewBox="0 0 32 32" width="18" height="18" fill="currentColor">
                <path d="M30 16a14 14 0 1 0-16.19 13.83v-9.78h-3.52V16h3.52v-3.09c0-3.47 2.06-5.39 5.23-5.39 1.52 0 3.1.27 3.1.27v3.42h-1.75c-1.72 0-2.26 1.07-2.26 2.17V16h3.85l-.62 4.05h-3.23v9.78A14 14 0 0 0 30 16z" />
              </svg>
            </a>

            {/* X / Twitter */}
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <svg className="social-svg" viewBox="0 0 32 32" width="18" height="18" fill="currentColor">
                <path d="M22.82 3h4.63l-10.1 11.55L29.24 29h-9.32l-7.3-9.54L4.23 29H.39l10.82-12.37L.02 3h9.55l6.6 8.73L22.82 3zm-1.62 23.22h2.56L8.14 5.66H5.4l15.8 20.56z" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg className="social-svg" viewBox="0 0 32 32" width="18" height="18" fill="currentColor">
                <path d="M16 2.88c4.27 0 4.78.02 6.46.09 1.56.07 2.4.33 2.97.55.75.29 1.29.64 1.85 1.2.56.56.91 1.1 1.2 1.85.22.56.48 1.41.55 2.97.07 1.68.09 2.19.09 6.46s-.02 4.78-.09 6.46c-.07 1.56-.33 2.4-.55 2.97-.29.75-.64 1.29-1.2 1.85-.56.56-1.1.91-1.85 1.2-.56.22-1.41.48-2.97.55-1.68.07-2.19.09-6.46.09s-4.78-.02-6.46-.09c-1.56-.07-2.4-.33-2.97-.55-.75-.29-1.29-.64-1.85-1.2-.56-.56-.91-1.1-1.2-1.85-.22-.56-.48-1.41-.55-2.97C2.9 20.78 2.88 20.27 2.88 16s.02-4.78.09-6.46c.07-1.56.33-2.4.55-2.97.29-.75.64-1.29 1.2-1.85.56-.56 1.1-.91 1.85-1.2.56-.22 1.41-.48 2.97-.55 1.68-.07 2.19-.09 6.46-.09M16 0c-4.35 0-4.89.02-6.6.09-1.7.08-2.87.35-3.89.75a7.9 7.9 0 0 0-2.86 1.86A7.9 7.9 0 0 0 .79 5.56C.39 6.58.12 7.75.04 9.45 0 11.16 0 11.7 0 16.05s.02 4.89.09 6.6c.08 1.7.35 2.87.75 3.89.41 1.05.96 1.95 1.86 2.86a7.9 7.9 0 0 0 2.86 1.86c1.02.4 2.19.67 3.89.75 1.71.08 2.25.09 6.6.09s4.89-.02 6.6-.09c1.7-.08 2.87-.35 3.89-.75a7.9 7.9 0 0 0 2.86-1.86 7.9 7.9 0 0 0 1.86-2.86c.4-1.02.67-2.19.75-3.89.08-1.71.09-2.25.09-6.6s-.02-4.89-.09-6.6c-.08-1.7-.35-2.87-.75-3.89a7.9 7.9 0 0 0-1.86-2.86A7.9 7.9 0 0 0 26.49.84c-1.02-.4-2.19-.67-3.89-.75C20.89 0 20.35 0 16 0zm0 7.78a8.22 8.22 0 1 0 0 16.44 8.22 8.22 0 0 0 0-16.44zm0 13.56a5.34 5.34 0 1 1 0-10.68 5.34 5.34 0 0 1 0 10.68zm10.46-14.38a1.92 1.92 0 1 1-3.84 0 1.92 1.92 0 0 1 3.84 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
