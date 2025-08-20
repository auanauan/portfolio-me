<template>
    <section ref="contact" class="contact" data-scroll-section>
        <a ref="contactEmail" href="mailto:hello@farish.is-a.dev" rel="noopener" class="contact__email">
            <span class="sr-only">Send me an email</span>
            <span v-for="row in 3" :key="row" ref="contactEmailRow" aria-hidden="true" class="contact__email__row">
                <span v-for="textKey in textCount" :key="textKey" ref="contactMarqueeText" aria-hidden="true"
                    class="contact__email__row__text">
                    Send me an <span class="serif">email</span><span v-if="textKey !== textCount">&nbsp; - &nbsp;</span>
                </span>
            </span>
        </a>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const textCount = 4

const contact = ref(null)
const contactEmailRow = ref([])

onMounted(() => {
  // Vertical animation
  gsap.fromTo(
    contactEmailRow.value,
    { yPercent: 'random(-15, -20)' },
    {
      yPercent: 'random(15, 20)',
      scrollTrigger: { trigger: contact.value, scrub: true }
    }
  )

  // Scroll trigger factory
  const smoothScrollBreakPoint = 1024
  const scrollTriggerFactory = (trigger) => ({
    trigger,
    scrub: window.innerWidth >= smoothScrollBreakPoint ? true : 0.5
  })

  // Horizontal marquee animation
  contactEmailRow.value.forEach((item) => {
    const sumWidth =
      item.offsetWidth + window.innerWidth / (window.innerWidth < 700 ? 2 : 4)

    gsap.fromTo(
      item,
      { x: window.innerWidth },
      { x: -sumWidth, scrollTrigger: scrollTriggerFactory(item) }
    )
  })
})
</script>

<style lang="scss">
@use "sass:color";
.contact {
    background-color: var(--black-color);
    padding: 4rem 0 8rem;
    pointer-events: all;
    max-width: 100vw;
    margin-top: -2px;
    overflow: hidden;
    width: 100%;

    &__email {
        color: color.adjust(white, $lightness: -40%);
        text-decoration: none;
        position: relative;
        display: block;
        line-height: 1;

        &__row {
            font-size: var(--step-5);
            will-change: transform;
            white-space: nowrap;
            display: block;
            margin: 0;

            @supports (-webkit-text-stroke: 1px white) {
                -webkit-text-stroke: 1px color.scale(white, $lightness: -40%);
                color: transparent;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            cursor: pointer !important;
        }
    }
}
</style>
