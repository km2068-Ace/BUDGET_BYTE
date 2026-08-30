import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import {
  BarChart3,
  ChefHat,
  Gauge,
  MapPin,
  ShieldAlert,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavTab } from '../types';

interface MagicBentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const cardData: {
  title: string;
  description: string;
  label: string;
  icon: any;
  color: string;
  accent: string;
  tabId: NavTab;
}[] = [
  {
    title: 'Overview',
    description: 'Live campus signal & AI demand pulses',
    label: 'Live',
    icon: Sparkles,
    color: '#1a102c',
    accent: 'violet',
    tabId: 'biteloop',
  },
  {
    title: 'Campus Live',
    description: 'In-person movement, queue load, and zone activity',
    label: 'AI',
    icon: MapPin,
    color: '#140d1f',
    accent: 'purple',
    tabId: 'digital-twin',
  },
  {
    title: 'Rescue Radar',
    description: 'Imperfect surplus turned into timely discounts',
    label: 'Drops',
    icon: ShieldAlert,
    color: '#130d1e',
    accent: 'rose',
    tabId: 'rescue-radar',
  },
  {
    title: 'Smart Meal',
    description: 'Meal plan optimization for budget and nutrition',
    label: 'Plan',
    icon: UtensilsCrossed,
    color: '#0c121c',
    accent: 'teal',
    tabId: 'smart-meal',
  },
  {
    title: 'Kitchen',
    description: 'Production pacing, prep timing, and staffing sync',
    label: 'Ops',
    icon: ChefHat,
    color: '#0d1220',
    accent: 'cyan',
    tabId: 'kitchen-command',
  },
  {
    title: 'Impact',
    description: 'Waste reduction, ROI gains, and carbon savings',
    label: 'Eco',
    icon: BarChart3,
    color: '#0e1620',
    accent: 'green',
    tabId: 'sustainability',
  },
];

export const MagicBento: React.FC<MagicBentoProps> = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = 300,
  particleCount = 12,
  enableTilt = true,
  glowColor = '168, 85, 247',
  clickEffect = true,
  enableMagnetism = true,
}) => {
  const { setActiveTab } = useApp();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });
  const shouldDisable = disableAnimations;

  useEffect(() => {
    if (!shouldDisable && typeof window !== 'undefined' && window.innerWidth <= 768) {
      setSpotlight((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [shouldDisable]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (shouldDisable || !enableSpotlight) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const relativeX = (x / rect.width) * 100;
    const relativeY = (y / rect.height) * 100;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    event.currentTarget.style.setProperty('--glow-x', `${relativeX}%`);
    event.currentTarget.style.setProperty('--glow-y', `${relativeY}%`);
    event.currentTarget.style.setProperty('--glow-intensity', '1');
    event.currentTarget.style.setProperty('--glow-radius', `${spotlightRadius}px`);

    if (enableTilt) {
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 10;
      gsap.to(event.currentTarget, {
        rotateX,
        rotateY,
        duration: 0.14,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    }

    if (enableMagnetism) {
      const magnetX = (x - centerX) * 0.06;
      const magnetY = (y - centerY) * 0.06;
      gsap.to(event.currentTarget, {
        x: magnetX,
        y: magnetY,
        duration: 0.28,
        ease: 'power2.out',
      });
    }

    setSpotlight({
      x: x + rect.left,
      y: y + rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    setHoveredIndex(null);
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));

    if (enableTilt) {
      gsap.to(event.currentTarget, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.32,
        ease: 'power2.out',
      });
    }

    if (enableMagnetism) {
      gsap.to(event.currentTarget, {
        x: 0,
        y: 0,
        duration: 0.32,
        ease: 'power2.out',
      });
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>, tabId: NavTab) => {
    setActiveTab(tabId);
    if (!clickEffect || shouldDisable) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const maxDistance = Math.max(
      Math.hypot(x, y),
      Math.hypot(x - rect.width, y),
      Math.hypot(x, y - rect.height),
      Math.hypot(x - rect.width, y - rect.height),
    );

    const ripple = document.createElement('span');
    ripple.className = 'magic-bento-ripple';
    ripple.style.width = `${maxDistance * 2}px`;
    ripple.style.height = `${maxDistance * 2}px`;
    ripple.style.left = `${x - maxDistance}px`;
    ripple.style.top = `${y - maxDistance}px`;
    ripple.style.background = `radial-gradient(circle, rgba(${glowColor}, 0.48) 0%, rgba(${glowColor}, 0.18) 28%, transparent 72%)`;

    event.currentTarget.appendChild(ripple);

    gsap.fromTo(
      ripple,
      { scale: 0, opacity: 1 },
      {
        scale: 1,
        opacity: 0,
        duration: 0.75,
        ease: 'power2.out',
        onComplete: () => ripple.remove(),
      },
    );
  };

  return (
    <section className="magic-bento-section relative mb-8">
      {enableSpotlight && !shouldDisable && (
        <div
          className="pointer-events-none absolute inset-0 z-0 hidden md:block"
          aria-hidden="true"
          style={{
            opacity: spotlight.opacity,
            transition: 'opacity 0.2s ease',
          }}
        >
          <div
            className="magic-bento-glow"
            style={{
              left: `${spotlight.x}px`,
              top: `${spotlight.y}px`,
              background: `radial-gradient(circle, rgba(${glowColor}, 0.22) 0%, rgba(${glowColor}, 0.12) 18%, rgba(${glowColor}, 0.04) 32%, transparent 68%)`,
            }}
          />
        </div>
      )}

      <div className="magic-bento-grid relative z-10">
        {cardData.map((card, index) => {
          const Icon = card.icon;
          const isActive = hoveredIndex === index;

          return (
            <div
              key={card.title}
              className={`magic-bento-card cursor-pointer ${enableBorderGlow ? 'magic-bento-card--border-glow' : ''} ${textAutoHide ? 'magic-bento-card--text-auto-hide' : ''}`}
              style={{
                backgroundColor: card.color,
                borderColor: 'rgba(148, 163, 184, 0.2)',
                ['--glow-x' as string]: '50%',
                ['--glow-y' as string]: '50%',
                ['--glow-intensity' as string]: '0',
                ['--glow-radius' as string]: `${spotlightRadius}px`,
                ['--glow-color' as string]: glowColor,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseMove={(event) => handleMouseMove(event, index)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => handleClick(e, card.tabId)}
            >
              <div className="magic-bento-card__header">
                <span className="magic-bento-card__icon">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="magic-bento-card__label">{card.label}</span>
              </div>

              <div className="magic-bento-card__content">
                <h3 className={`magic-bento-card__title ${textAutoHide ? 'text-clamp-1' : ''}`}>
                  {card.title}
                </h3>
                <p className={`magic-bento-card__description ${textAutoHide ? 'text-clamp-2' : ''}`}>
                  {card.description}
                </p>
              </div>

              {enableStars && isActive && (
                <div className="magic-bento-particles" aria-hidden="true">
                  {Array.from({ length: particleCount }).map((_, particleIndex) => (
                    <span
                      key={`${card.title}-${particleIndex}`}
                      className="magic-bento-particle"
                      style={{
                        left: `${(particleIndex / particleCount) * 100}%`,
                        top: `${((particleIndex * 17) % 100)}%`,
                        animationDelay: `${particleIndex * 0.06}s`,
                        background: `rgba(${glowColor}, 1)`,
                        boxShadow: `0 0 10px rgba(${glowColor}, 0.75)`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MagicBento;
