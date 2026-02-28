import { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({ finalValue, label }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    // Parse the final value to extract the number
    const numValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
    const suffix = finalValue.replace(/[0-9]/g, '');

    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    let animationFrameId;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuad = 1 - Math.pow(1 - progress, 2);
      const currentValue = Math.floor(easeOutQuad * numValue);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [hasStarted, finalValue]);

  // Parse the suffix from final value
  const suffix = finalValue.replace(/[0-9]/g, '');

  return (
    <div ref={counterRef} className="text-center">
      <div className="text-3xl font-bold text-blue-400 mb-2">
        {displayValue}
        {suffix}
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}
