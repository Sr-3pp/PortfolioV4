<template lang="pug">
canvas(ref="canvasRef")
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import type { Star } from '~/types/stars'

defineOptions({ name: 'StarsCanvas' });

const canvasRef = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let animationId = 0
let stars: Star[] = []
let dpr = 1

const neonColors = ['#00ffff', '#ff00ff', '#00ff99', '#ffdd00', '#ff0066', '#66f', '#0ff']

const rand = (min: number, max: number) => Math.random() * (max - min) + min

const createStars = (width: number, height: number) => {
	const area = width * height
	const count = Math.max(80, Math.floor(area / 20000))
	const result: Star[] = []
	for (let index = 0; index < count; index += 1) {
		const colorIndex = Math.floor(Math.random() * neonColors.length)
		result.push({
			x: Math.random() * width,
			y: Math.random() * height,
			size: rand(0.6, 3.5),
			baseAlpha: rand(0.4, 1),
			color: neonColors[colorIndex] ?? neonColors[0]!,
			twinkleSpeed: rand(0.0006, 0.0025),
		})
	}
	return result
}

const resizeCanvas = () => {
	const canvas = canvasRef.value
	if (!canvas || !ctx) return

	const width = window.innerWidth
	const height = window.innerHeight
	dpr = Math.max(1, window.devicePixelRatio || 1)

	canvas.style.width = `${width}px`
	canvas.style.height = `${height}px`

	canvas.width = Math.floor(width * dpr)
	canvas.height = Math.floor(height * dpr)
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

	stars = createStars(width, height)
}

const render = (time: number) => {
	const canvas = canvasRef.value
	if (!canvas || !ctx) return
	const width = canvas.width / dpr
	const height = canvas.height / dpr

	ctx.clearRect(0, 0, width, height)

	for (const star of stars) {
		const twinkle = time * star.twinkleSpeed
		const alpha = star.baseAlpha * (0.7 + 0.3 * Math.sin(twinkle + star.x + star.y))

		ctx.save()
		ctx.globalCompositeOperation = 'lighter'
		ctx.fillStyle = star.color
		ctx.globalAlpha = alpha

		ctx.shadowBlur = star.size * 8
		ctx.shadowColor = star.color
		ctx.beginPath()
		ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
		ctx.fill()

		ctx.shadowBlur = 0
		ctx.globalAlpha = Math.min(1, alpha * 1.5)
		ctx.fillStyle = '#fff'
		ctx.beginPath()
		ctx.arc(star.x, star.y, Math.max(0.3, star.size * 0.35), 0, Math.PI * 2)
		ctx.fill()
		ctx.restore()
	}

	animationId = requestAnimationFrame(render)
}

const stopAnimation = () => {
	if (animationId) cancelAnimationFrame(animationId)
	animationId = 0
}

const startAnimation = () => {
	if (!animationId) animationId = requestAnimationFrame(render)
}

const handleVisibilityChange = () => {
	if (document.hidden) {
		stopAnimation()
	} else {
		startAnimation()
	}
}

onMounted(() => {
	const canvas = canvasRef.value
	if (!canvas) return
	ctx = canvas.getContext('2d')
	if (!ctx) return

	resizeCanvas()
	window.addEventListener('resize', resizeCanvas)
	document.addEventListener('visibilitychange', handleVisibilityChange)
	startAnimation()
})

onUnmounted(() => {
	stopAnimation()
	window.removeEventListener('resize', resizeCanvas)
	document.removeEventListener('visibilitychange', handleVisibilityChange)
})

</script>

<style scoped>
canvas {
	position: fixed;
	inset: 0;
	width: 100%;
	height: 100%;
	display: block;
	pointer-events: none;
	z-index: 22;
	background: transparent;
  filter: blur(5px);
}
</style>
