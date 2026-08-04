<template>
  <span class="relative inline-block">
    <svg
      class="pointer-events-none absolute left-1/2 top-1/2 h-[142%] w-[132%] -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] overflow-visible"
      viewBox="0 0 120 48"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter
          id="hand-circle-rough"
          x="-20%"
          y="-40%"
          width="140%"
          height="180%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="1"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter
          id="hand-circle-chalk"
          x="-20%"
          y="-40%"
          width="140%"
          height="180%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.18"
            numOctaves="2"
            seed="11"
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
            scale="1.1"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feComposite in="SourceGraphic" in2="softGrain" operator="in" />
        </filter>
      </defs>
      <path
        d="M2 36 C7 12, 84 1, 108 12 C122 18, 121 35, 105 43 C85 50, 33 45, 20 34"
        fill="none"
        stroke="#efc18f"
        stroke-width="9.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.32"
        filter="url(#hand-circle-chalk)"
      />
      <path
        d="M3 38 C11 12, 85 3, 105 13 C117 19, 113 35, 95 41 C77 47, 31 42, 16 31"
        fill="none"
        stroke="#c86a2b"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.86"
        filter="url(#hand-circle-rough)"
      />
      <path
        d="M39 17 C52 8, 96 10, 110 20 C114 24, 112 29, 100 33"
        fill="none"
        stroke="#e39a58"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.48"
        filter="url(#hand-circle-rough)"
      />
    </svg>
    <span class="relative z-10 inline-block"><slot /></span>
  </span>
</template>
