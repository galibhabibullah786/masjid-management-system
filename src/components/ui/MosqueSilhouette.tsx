interface MosqueSilhouetteProps {
  className?: string;
  opacity?: number;
  containerRef?: React.RefObject<HTMLElement>;
}

export default function MosqueSilhouette({ className = '', opacity = 0.2, containerRef }: MosqueSilhouetteProps) {
  return (
    <div 
      className={className} 
      style={{ 
        opacity,
        clipPath: containerRef ? 'inherit' : undefined 
      }}
    >
      <svg viewBox="0 0 500 700" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <g fill="white">
          {/* Main Dome */}
          <path d="M150 350 Q150 280 200 250 Q250 280 250 350 Z" />
          <circle cx="200" cy="240" r="8"/>
          <rect x="197" y="210" width="6" height="30"/>
          
          {/* Left Minaret */}
          <rect x="70" y="320" width="35" height="380" rx="2"/>
          <rect x="73" y="310" width="29" height="15"/>
          <ellipse cx="87.5" cy="305" rx="18" ry="25"/>
          <rect x="85" y="280" width="5" height="25"/>
          <circle cx="87.5" cy="278" r="4"/>
          
          {/* Right Minaret */}
          <rect x="295" y="320" width="35" height="380" rx="2"/>
          <rect x="298" y="310" width="29" height="15"/>
          <ellipse cx="312.5" cy="305" rx="18" ry="25"/>
          <rect x="310" y="280" width="5" height="25"/>
          <circle cx="312.5" cy="278" r="4"/>
          
          {/* Main Building Base */}
          <rect x="130" y="350" width="140" height="350" rx="3"/>
          
          {/* Side Smaller Domes */}
          <path d="M140 370 Q140 345 160 335 Q180 345 180 370 Z" />
          <path d="M220 370 Q220 345 240 335 Q260 345 260 370 Z" />
          
          {/* Arched Door */}
          <path d="M175 600 Q175 550 200 540 Q225 550 225 600 Z" fill="#6b4423" opacity="0.8"/>
          
          {/* Windows - Islamic Arches */}
          <path d="M145 450 Q145 430 155 425 Q165 430 165 450 L165 480 L145 480 Z" fill="#6b4423" opacity="0.7"/>
          <path d="M190 450 Q190 430 200 425 Q210 430 210 450 L210 480 L190 480 Z" fill="#6b4423" opacity="0.7"/>
          <path d="M235 450 Q235 430 245 425 Q255 430 255 450 L255 480 L235 480 Z" fill="#6b4423" opacity="0.7"/>
          
          {/* Decorative Elements */}
          <rect x="130" y="380" width="140" height="3" opacity="0.5"/>
          <rect x="130" y="520" width="140" height="3" opacity="0.5"/>
        </g>
      </svg>
    </div>
  );
}
