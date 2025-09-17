<script setup lang="ts">
import { useMouse } from '@vueuse/core';

const { x, y } = useMouse();

const svgRef = ref<SVGSVGElement | null>(null);
const gradientRef = ref<SVGRadialGradientElement | null>(null);

let targetX = 18.5; // initial center
let targetY = 16.3;
let currentX = 18.5;
let currentY = 16.3;
const lerpFactor = 0.05; // resistance: lower = more resistance

function animateGradient() {
  const svg = svgRef.value;
  const grad = gradientRef.value;
  if (!svg || !grad) {
    requestAnimationFrame(animateGradient);
    return;
  }
  const rect = svg.getBoundingClientRect();
  // Use mouse position relative to SVG
  const relX = ((x.value - rect.left) / rect.width) * 37;
  const relY = ((y.value - rect.top) / rect.height) * 32.6;
  // Clamp to inner 50% (25% to 75%)
  const minX = 0.25 * 37;
  const maxX = 0.75 * 37;
  const minY = 0.25 * 32.6;
  const maxY = 0.75 * 32.6;
  targetX = Math.max(minX, Math.min(maxX, relX));
  targetY = Math.max(minY, Math.min(maxY, relY));
  currentX += (targetX - currentX) * lerpFactor;
  currentY += (targetY - currentY) * lerpFactor;
  grad.setAttribute('cx', currentX.toString());
  grad.setAttribute('cy', currentY.toString());
  requestAnimationFrame(animateGradient);
}

onMounted(() => {
  const svg = svgRef.value;
  if (svg) {
    gradientRef.value = svg.querySelector('#portalGradient');
    requestAnimationFrame(animateGradient);
  }
});
</script>

<template lang="pug">
.neon-triangle-container
  svg.w-full.neon-triangle.text-primary(viewBox="0 0 40.3 34.6" xmlns="http://www.w3.org/2000/svg" ref="svgRef")
      defs
          filter#neon-glow
              feDropShadow(dx="0" dy="0" stdDeviation="1.2" flood-color="#22d3ee" flood-opacity="0.45")
      defs
          radialGradient#portalGradient(gradientUnits="userSpaceOnUse" cx="18.5" cy="16.3" r="22")
              stop.portal-stop-1(offset="0%")
              stop.portal-stop-2(offset="35%")
              stop.portal-stop-3(offset="70%")
              stop.portal-stop-4(offset="100%")
          clipPath#triangleClip
              path(d="M4.1,34.1c-0.6,0-1.2-0.3-1.5-0.9c-0.3-0.5-0.3-1.2,0-1.7L18.7,3.6c0.3-0.5,0.9-0.9,1.5-0.9 s1.2,0.3,1.5,0.9l16.1,27.9c0.3,0.5,0.3,1.2,0,1.7c-0.3,0.5-0.9,0.9-1.5,0.9H4.1z")
      // Gradient background first (behind), then outline
      path.triangle-bg-clip(
          fill="url(#portalGradient)"
          d="M4.1,34.1c-0.6,0-1.2-0.3-1.5-0.9c-0.3-0.5-0.3-1.2,0-1.7L18.7,3.6c0.3-0.5,0.9-0.9,1.5-0.9 s1.2,0.3,1.5,0.9l16.1,27.9c0.3,0.5,0.3,1.2,0,1.7c-0.3,0.5-0.9,0.9-1.5,0.9H4.1z"
          clip-path="url(#triangleClip)"
      )
      path.neon-stroke(
          fill="none"
          stroke="#22d3ee"
          stroke-width="1.1"
          filter="url(#neon-glow)"
          d="M4.1,34.1c-0.6,0-1.2-0.3-1.5-0.9c-0.3-0.5-0.3-1.2,0-1.7L18.7,3.6c0.3-0.5,0.9-0.9,1.5-0.9 s1.2,0.3,1.5,0.9l16.1,27.9c0.3,0.5,0.3,1.2,0,1.7c-0.3,0.5-0.9,0.9-1.5,0.9H4.1z"
      )
      path.shadow-lg(fill="currentColor" d="M20.1,3.3c0.2,0,0.7,0.1,1,0.6l16.1,27.9c0.3,0.5,0.1,1,0,1.2c-0.1,0.2-0.4,0.6-1,0.6H4.1c-0.6,0-0.9-0.4-1-0.6 c-0.1-0.2-0.3-0.6,0-1.2L19.1,3.9C19.4,3.4,19.9,3.3,20.1,3.3 M20.1,2.2c-0.8,0-1.5,0.4-2,1.1L2.1,31.2c-0.9,1.5,0.2,3.4,2,3.4 h32.2c1.7,0,2.8-1.9,2-3.4L22.1,3.4C21.7,2.6,20.9,2.2,20.1,2.2L20.1,2.2z")
  slot 
  svg.frontal-bar.text-primary(viewBox="0 0 40.3 34.6" xmlns="http://www.w3.org/2000/svg")
    rect(x="4.2" y="33.6" width="31.9" height="1" fill="currentColor")
</template>

<style scoped>
.neon-triangle-container {
  position: relative;
  width: 100%;
  height: auto;
  display: inline-block;
}

.frontal-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 2;
  pointer-events: none; /* allow interactions through */
}

.neon-triangle .portal-stop-1 { stop-color: var(--ui-primary, #22d3ee); stop-opacity: 0.95; }
.neon-triangle .portal-stop-2 { stop-color: var(--ui-primary, #22d3ee); stop-opacity: 0.55; }
.neon-triangle .portal-stop-3 { stop-color: var(--ui-primary, #22d3ee); stop-opacity: 0.25; }
.neon-triangle .portal-stop-4 { stop-color: var(--ui-primary, #22d3ee); stop-opacity: 0; }

/* CSS-driven portal animation for the gradient fill */



.neon-triangle .triangle-bg-clip {
  --portal-hue: 0deg;
  --portal-blur: 1.2px;
  --portal-saturate: 1.1;
  transform-origin: 50% 50%;
  mix-blend-mode: screen;
  filter: blur(var(--portal-blur)) saturate(var(--portal-saturate)) hue-rotate(var(--portal-hue));
  animation: portal-pulse 3.5s cubic-bezier(0.77,0,0.175,1) infinite, portal-hue 8s linear infinite;
}

@keyframes portal-pulse {
  0% {
    transform: scale(0.98);
    opacity: 0.7;
    --portal-blur: 1.2px;
    --portal-saturate: 1.1;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.85;
    --portal-blur: 2.2px;
    --portal-saturate: 1.2;
  }
  100% {
    transform: scale(0.98);
    opacity: 0.7;
    --portal-blur: 1.2px;
    --portal-saturate: 1.1;
  }
}

@keyframes portal-hue {
  0% { --portal-hue: 0deg; }
  50% { --portal-hue: 180deg; }
  100% { --portal-hue: 360deg; }
}


@property --portal-hue {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@property --portal-blur {
  syntax: '<length>';
  inherits: false;
  initial-value: 1.2px;
}

@property --portal-saturate {
  syntax: '<number>';
  inherits: false;
  initial-value: 1.1;
}

</style>
