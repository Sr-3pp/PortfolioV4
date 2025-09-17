<script setup lang="ts">
const props = defineProps({
  labels: {
    type: Array,
    default: (): string[] => [],
  }
});

const defaultLabel = typeof props.labels?.[0] === 'string' ? (props.labels[0] as string) : '';
const length = Math.max(defaultLabel.length, 0);
const characters = [" ", "🍕", "🐞", "🍪", "💻", "💀", "🥸", "💩", "🍀", ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/".split('')];

type Slot = {
  current: string;
  next: string;
  transitionSpeed: number;
  currentTransform: string;
  nextTransform: string;
  timeout: ReturnType<typeof setTimeout> | null;
};
const slots: Ref<Slot[]> = ref(Array.from({ length }, (_, index) => {
  const char = Array.from(defaultLabel)[index] ?? ' ';
  return {
    current: char,
    next: char,
    transitionSpeed: 0,
    currentTransform: 'translateY(0%)',
    nextTransform: 'translateY(-100%)',
    timeout: null
  };
}));

const labelIdx = ref(0);
const interval = ref<ReturnType<typeof setInterval> | null>(null);
const intervalSpeed = 4000;
const timeouts = new Set<ReturnType<typeof setTimeout>>();
const isSpinning = ref(false);

const delay = (ms: number) => new Promise<void>(resolve => {
  const timeout = setTimeout(() => {
    timeouts.delete(timeout);
    resolve();
  }, ms);

  timeouts.add(timeout);
});
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const randomCharacter = () => characters[Math.floor(Math.random() * characters.length)] as string;

const clearSpinInterval = () => {
  if (interval.value) {
    clearInterval(interval.value);
    interval.value = null;
  }
};

const startSpinInterval = () => {
  clearSpinInterval();
  interval.value = setInterval(() => {
    spin();
  }, intervalSpeed);
};

const spin = async () => {
  if (isSpinning.value || slots.value.length === 0) {
    return;
  }

  isSpinning.value = true;

  try {
    const activeLabel = props.labels[labelIdx.value] as string | undefined;
    const targetChars = Array.from({ length }, (_, charIndex) => Array.from(activeLabel ?? '')[charIndex] ?? ' ');

    const spinSlot = async (slot: Slot, index: number) => {
      const totalCycles = 14 + index * 2;

      if (index > 0) {
        await delay(index * 120);
      }

      for (let cycle = 0; cycle < totalCycles; cycle += 1) {
        const progress = cycle / totalCycles;
        const duration = Math.round(80 + easeOutCubic(progress) * 260);
        await loop(slot, duration);
      }

      const target = targetChars[index] ?? ' ';
      await loop(slot, 520 + index * 140, target);
    };

    await Promise.all(slots.value.map(spinSlot));

    if (props.labels.length > 0) {
      labelIdx.value = labelIdx.value === props.labels.length - 1 ? 0 : labelIdx.value + 1;
    } else {
      labelIdx.value = 0;
    }
  } finally {
    isSpinning.value = false;
  }
};

onMounted(() => {
  spin();
  startSpinInterval();
});

onBeforeUnmount(() => {
  clearSpinInterval();
  timeouts.forEach(timeout => clearTimeout(timeout));
  timeouts.clear();
});

const loop = (slot: Slot, duration = 500, char?: null | string): Promise<void> => {
  const safeDuration = Math.max(duration, 60);

  if (slot.timeout) {
    clearTimeout(slot.timeout);
    timeouts.delete(slot.timeout);
    slot.timeout = null;
  }

  slot.transitionSpeed = safeDuration;
  slot.next = (char ?? randomCharacter()) as string;
  slot.nextTransform = 'translateY(0%)';
  slot.currentTransform = 'translateY(100%)';

  return new Promise<void>(resolve => {
    const timeout = setTimeout(() => {
      slot.transitionSpeed = 0;
      slot.current = slot.next;
      slot.currentTransform = 'translateY(0%)';
      slot.nextTransform = 'translateY(-100%)';
      slot.timeout = null;
      timeouts.delete(timeout);
      resolve();
    }, safeDuration);

    timeouts.add(timeout);
    slot.timeout = timeout;
  });
};

const handleMouseEnter = () => {
  clearSpinInterval();
};

const handleMouseLeave = () => {
  startSpinInterval();
};

const templateBindings = {
  handleMouseEnter,
  handleMouseLeave,
};

void templateBindings;

</script>

<template lang="pug">
ul.slot-machine(@mouseover="handleMouseEnter" @mouseleave="handleMouseLeave")
    li.slot-machine-item(v-for="(slot, i) in slots" :key="i")
      span(:style="{ transform: slot.nextTransform, transition: `transform ${slot.transitionSpeed}ms cubic-bezier(0.18, 0.89, 0.32, 1.1)` }")  {{ slot.next }}
      span(:style="{ transform: slot.currentTransform, transition: `transform ${slot.transitionSpeed}ms cubic-bezier(0.18, 0.89, 0.32, 1.1)` }")  {{ slot.current }}
</template>

<style scoped>
.slot-machine {
  display: flex;
  align-items: center;
  justify-content: center;
}

.slot-machine-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "REM";
  font-weight: bold;
  font-size: 2rem;
  height: 50px;
  width: 40px;
  overflow: hidden;
  padding: 4px;
  background: linear-gradient(var(--color-gray-700) 10%, transparent 30%, transparent 70%, var(--color-gray-700) 100%);
  color: var(--text-gray-200);
  border: solid 1px var(--ui-primary);
  position: relative;
}

.slot-machine-item:first-child {
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
}
.slot-machine-item:last-child {
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
}

.slot-machine-item span {
  height: 100%;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transform: translateY(0%);
  transition: transform 0ms ease-in-out;
  will-change: transform;
  backface-visibility: hidden;
  transform-origin: center;
  position: absolute;
  inset: 0;
  justify-content: center;
  pointer-events: none;
}

.slot-machine-item span:first-child {
  z-index: 2;
}

.slot-machine-item span:last-child {
  z-index: 1;
}

.slot-machine.reloading .slot-machine-item span,
.slot-machine.spinning .slot-machine-item span {
  transition: none;
}
</style>
