<template>
  <span class="relative inline-block">
    <span class="relative z-10 inline-block"><slot /></span>
    <svg
      class="pointer-events-none absolute left-1/2 top-full h-4 w-[118%] -translate-x-1/2 -translate-y-[0.55rem] rotate-[-2deg] overflow-visible"
      viewBox="0 0 120 18"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter
          id="hand-underline-rough"
          x="-20%"
          y="-80%"
          width="140%"
          height="260%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="1"
            seed="17"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter
          id="hand-underline-chalk"
          x="-20%"
          y="-80%"
          width="140%"
          height="260%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.18"
            numOctaves="2"
            seed="23"
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 0.28 0"
            result="softGrain"
          />
          <feDisplacementMap
            in="softGrain"
            in2="grain"
            scale="0.9"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feComposite in="SourceGraphic" in2="softGrain" operator="in" />
        </filter>
      </defs>
      <path
        d="M4 12 C24 15, 67 6, 116 10"
        fill="none"
        stroke="#efc18f"
        stroke-width="7.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.34"
        filter="url(#hand-underline-chalk)"
      />
      <path
        d="M3 12 C23 15, 67 7, 115 10"
        fill="none"
        stroke="#c86a2b"
        stroke-width="2.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.86"
        filter="url(#hand-underline-rough)"
      />
      <path
        d="M31 13 C52 14, 81 8, 109 11"
        fill="none"
        stroke="#e39a58"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.48"
        filter="url(#hand-underline-rough)"
      />
    </svg>
  </span>
</template>
