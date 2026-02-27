import { useEffect, useRef } from "react";

interface SenjaTestimonialsProps {
  widgetId?: string;
}

export function SenjaTestimonials({ widgetId = "29501671-0b5a-4cc9-b8b6-c3ff346a0f77" }: SenjaTestimonialsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://widget.senja.io/widget/${widgetId}/platform.js`;
    script.type = "text/javascript";
    script.async = true;
    containerRef.current?.appendChild(script);

    return () => {
      script.remove();
    };
  }, [widgetId]);

  return (
    <div ref={containerRef}>
      <div
        className="senja-embed"
        data-id={widgetId}
        data-mode="shadow"
        data-lazyload="false"
        style={{ display: "block", width: "100%" }}
      />
    </div>
  );
}
