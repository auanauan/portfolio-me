<template>
    <a :href="href" rel="noopener noreferrer" class="social-link" @focus="showHoverText" @blur="hideHoverText"
        @pointerenter="showHoverText" @pointerleave="hideHoverText">
        <div class="social-link__wrapper" aria-hidden="true">
            <span class="social-link__line serif">
                <span v-for="(char, key) in linkText" :key="`hover-${key}`" ref="hoverChars">
                    {{ char }}
                </span>
            </span>
            <span class="social-link__line">
                <span v-for="(char, key) in linkText" :key="`idle-${key}`" ref="idleChars">
                    {{ char }}
                </span>
            </span>
        </div>
        <span class="sr-only">{{ linkText }}</span>
    </a>
</template>

<script setup>
import { ref, computed, onMounted, useSlots } from 'vue'
import { gsap } from "gsap";

// ===== Props =====
const props = defineProps({
    href: {
        type: String,
        required: true,
        default: 'https://example.com',
        validator: (string) =>
            string.startsWith('http://') ||
            string.startsWith('https://') ||
            string.startsWith('mailto:')
    }
})

// ===== Refs =====
const prefersReducedMotion = ref(false)
const hoverChars = ref([])
const idleChars = ref([])
let prevTl = null

// ===== Computed =====
const slots = useSlots()
const linkText = computed(() => {
    return slots.default?.()[0]?.children?.toString().trim() || ''
})

// ===== Lifecycle =====
onMounted(() => {
    // Replace with your own prefersReducedMotion logic
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

// ===== Methods =====
const timelineFactory = (props = {}) =>
    gsap.timeline({
        defaults: { stagger: 0.05, duration: 0.2 },
        ...props
    })

const showHoverText = () => {
    if (prefersReducedMotion.value) return
    if (prevTl) prevTl.kill()

    const tl = timelineFactory()
    tl.to(idleChars.value, { yPercent: -100 })
    tl.to(hoverChars.value, { yPercent: -100 }, '<')

    prevTl = tl
}

const hideHoverText = () => {
    if (prefersReducedMotion.value) return
    if (prevTl) prevTl.kill()

    const tl = timelineFactory()
    tl.to(idleChars.value, { yPercent: 0 })
    tl.to(hoverChars.value, { yPercent: 0 }, '<')

    prevTl = tl
}
</script>

<style lang="scss">
.social-link {
    display: inline-block;
    cursor: pointer;
    margin: 0;

    &__wrapper {
        position: relative;
        overflow: hidden;
        line-height: 1;
    }

    &__line {
        letter-spacing: 0.25px;
        white-space: nowrap;
        cursor: pointer;
        padding: 0;
        margin: 0;

        &:nth-child(1) {
            font-size: calc(var(--step-0) - 0.125rem);
            transform: translateY(100%);

            @media (prefers-reduced-motion: reduce) {
                display: none;
            }
        }

        &:nth-child(2) {
            font-size: calc(var(--step--1) - 0.0125rem);
            position: absolute;
            right: 0;
            top: 0;

            @media screen and (max-width: 600px) {
                font-size: calc(var(--step--1) - 0.05rem);
                transform: translateX(50%);
                right: 50%;
            }

            @media (prefers-reduced-motion: reduce) {
                display: none;
            }
        }
    }

    @media (prefers-reduced-motion: reduce) {
        cursor: pointer !important;

        .sr-only {
            font-size: var(--step--1);
            position: static;
            height: auto;
            width: auto;

            &:is(:focus, :hover) {
                text-decoration: underline;
                color: #ffe6ed;
            }
        }
    }

    span {
        display: inline-block;
    }
}
</style>
