/** Inline keycap-grid icon. */
export function KeythmLogo({
  className,
  size = 22,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 32 32"
      width={size}
    >
      {/* Outer shadow */}
      <rect
        fill="black"
        fillOpacity="0.08"
        height="28"
        rx="5"
        width="30"
        x="1"
        y="3"
      />
      {/* Housing plate */}
      <rect
        fill="#E5E5E5"
        height="28"
        rx="5"
        width="30"
        x="1"
        y="1"
      />
      {/* Accent keycap */}
      <rect
        fill="#3B82F6"
        height="10.5"
        rx="2.5"
        width="12"
        x="3"
        y="3"
      />
      {/* Light keycaps */}
      <rect
        fill="#F5F5F5"
        height="10.5"
        rx="2.5"
        width="12"
        x="17"
        y="3"
      />
      <rect
        fill="#F5F5F5"
        height="10.5"
        rx="2.5"
        width="12"
        x="3"
        y="15.5"
      />
      {/* Dark keycap */}
      <rect
        fill="#A3A3A3"
        height="10.5"
        rx="2.5"
        width="12"
        x="17"
        y="15.5"
      />
      {/* Specular highlights */}
      <rect
        fill="white"
        fillOpacity="0.28"
        height="3"
        rx="1.5"
        width="9"
        x="4.5"
        y="3.5"
      />
      <rect
        fill="white"
        fillOpacity="0.2"
        height="3"
        rx="1.5"
        width="9"
        x="18.5"
        y="3.5"
      />
      <rect
        fill="white"
        fillOpacity="0.2"
        height="3"
        rx="1.5"
        width="9"
        x="4.5"
        y="16"
      />
      <rect
        fill="white"
        fillOpacity="0.12"
        height="3"
        rx="1.5"
        width="9"
        x="18.5"
        y="16"
      />
    </svg>
  );
}
