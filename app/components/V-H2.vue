<template>
    <h2 ref="title" class="title-h2 serif">
        <span class="sr-only">{{ defaultSlotText }}</span>
        <div ref="titleContent" class="title-h2__content" aria-hidden="true">
            <slot />
        </div>
    </h2>
</template>

<script setup>
import { ref, onMounted, computed, useSlots } from 'vue'
import { gsap } from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ===== Props =====
const props = defineProps({
    rangeOfMovement: { type: Number, default: 20 }
})

// ===== Refs =====
const title = ref(null)
const titleContent = ref(null)

// ===== Slots =====
const slots = useSlots()
const defaultSlotText = computed(() => {
    const firstNode = slots.default?.()[0]
    return firstNode?.children || ''
})

// ===== Lifecycle =====
onMounted(() => {
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches

    if (!prefersReducedMotion) {
        gsap.fromTo(
            title.value,
            { yPercent: props.rangeOfMovement * -1 },
            {
                yPercent: props.rangeOfMovement,
                scrollTrigger: { scrub: true, trigger: title.value }
            }
        )
    }

    const scrollTrigger = {
        trigger: title.value,
        start: 'top bottom-=20%',
        once: true
    }

    if (prefersReducedMotion) {
        gsap.fromTo(
            titleContent.value,
            { filter: 'blur(10px)', opacity: 0 },
            { filter: 'blur(0px)', opacity: 1, scrollTrigger }
        )
    } else {
        gsap.fromTo(
            titleContent.value,
            { yPercent: -110 },
            {
                yPercent: 0,
                duration: 0.75,
                ease: 'power2.out(1.5)',
                scrollTrigger
            }
        )
    }
})
</script>

<style lang="scss">
.title-h2 {
    text-align: center;
    overflow: hidden;

    @media (prefers-reduced-motion: reduce) {
        overflow: visible;
    }
}
</style>
