import React from 'react';

function HeroBanner() {
  return (
    // Black hero wrapper container
    <div className="w-full bg-black pb-12 pt-4 px-4 sm:px-10 xl:px-20">
      <div className="max-w-[2520px] mx-auto relative rounded-3xl overflow-hidden h-[450px] sm:h-[550px] shadow-2xl">
        
        {/* Direct Image Link */}
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80" 
          alt="Featured Stay" 
          className="w-full h-full object-cover object-center"
        />
        
        {/* "Not sure where to go?" Floating Overlay Badge */}
        <div className="absolute bottom-10 inset-x-0 flex flex-col items-center justify-center text-center gap-3">
          <p className="text-white text-xl sm:text-2xl font-bold drop-shadow-md">
            Not sure where to go? Perfect.
          </p>
          <button 
            type="button"
            className="bg-white text-purple-900 font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer border-none text-sm sm:text-base"
          >
            I'm flexible
          </button>
        </div>

      </div>
    </div>
  );
}

export default HeroBanner;