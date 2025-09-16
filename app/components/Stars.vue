<template lang="pug">
canvas(ref="canvasRef")
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

type Star = {
	x: number
	y: number
	size: number
	baseAlpha: number
	color: string
	twinkleSpeed: number
}

let ctx: CanvasRenderingContext2D | null = null
let animationId = 0
let stars: Star[] = []
let dpr = 1

const neonColors = ['#00ffff', '#ff00ff', '#00ff99', '#ffdd00', '#ff0066', '#66f', '#0ff']

function rand(min: number, max: number) {
	return Math.random() * (max - min) + min
}

function createStars(width: number, height: number) {
	const area = width * height
	const count = Math.max(80, Math.floor(area / 20000)) // density-based count
	const arr: Star[] = []
	for (let i = 0; i < count; i++) {
		arr.push({
			x: Math.random() * width,
			y: Math.random() * height,
			size: rand(0.6, 3.5),
			baseAlpha: rand(0.4, 1),
			color: neonColors[Math.floor(Math.random() * neonColors.length)] as string || neonColors[0] as string,
			// slower twinkling for a relaxed neon glow
			twinkleSpeed: rand(0.0006, 0.0025),
		})
	}
	return arr
}

function resizeCanvas() {
	const canvas = canvasRef.value
	if (!canvas || !ctx) return

	const width = window.innerWidth
	const height = window.innerHeight
	dpr = Math.max(1, window.devicePixelRatio || 1)

	canvas.style.width = width + 'px'
	canvas.style.height = height + 'px'

	canvas.width = Math.floor(width * dpr)
	canvas.height = Math.floor(height * dpr)
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // scale back to CSS pixels

	stars = createStars(width, height)
}

let lastTime = 0
function render(time: number) {
	const canvas = canvasRef.value
	if (!canvas || !ctx) return
	const width = canvas.width / dpr
	const height = canvas.height / dpr

	// clear with transparent black to preserve layering
	ctx.clearRect(0, 0, width, height)

	// subtle background vignette (optional) - commented out; can enable if wanted
	// drawBackground(ctx, width, height)

	for (const s of stars) {
		// twinkle
		const t = time * s.twinkleSpeed
		const alpha = s.baseAlpha * (0.7 + 0.3 * Math.sin(t + s.x + s.y))

		ctx.save()
		ctx.globalCompositeOperation = 'lighter'
		ctx.fillStyle = s.color
		ctx.globalAlpha = alpha

		// glow
		ctx.shadowBlur = s.size * 8
		ctx.shadowColor = s.color

		// draw a small radial glow using arc
		ctx.beginPath()
		ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
		ctx.fill()

		// small bright core
		ctx.shadowBlur = 0
		ctx.globalAlpha = Math.min(1, alpha * 1.5)
		ctx.fillStyle = '#fff'
		ctx.beginPath()
		ctx.arc(s.x, s.y, Math.max(0.3, s.size * 0.35), 0, Math.PI * 2)
		ctx.fill()

		ctx.restore()
	}

	animationId = requestAnimationFrame(render)
}

onMounted(() => {
	const canvas = canvasRef.value
	if (!canvas) return
	ctx = canvas.getContext('2d')
	if (!ctx) return

	resizeCanvas()

	window.addEventListener('resize', resizeCanvas)

	// pause animation when tab is hidden to save CPU
	function onVisibilityChange() {
		if (document.hidden) {
			if (animationId) cancelAnimationFrame(animationId)
			animationId = 0
		} else if (!animationId) {
			animationId = requestAnimationFrame(render)
		}
	}
	document.addEventListener('visibilitychange', onVisibilityChange)

	// start
	animationId = requestAnimationFrame(render)

	onUnmounted(() => {
		if (animationId) cancelAnimationFrame(animationId)
		window.removeEventListener('resize', resizeCanvas)
		document.removeEventListener('visibilitychange', onVisibilityChange)
	})
})

</script>

<style scoped>
canvas {
	position: fixed;
	inset: 0; /* top:0 right:0 bottom:0 left:0 */
	width: 100%;
	height: 100%;
	display: block;
	pointer-events: none; /* allow interactions through canvas */
	z-index: 22;
	background: transparent;
  filter: blur(5px);
}
</style>