<template>
  <header ref="header" class="header" role="banner" data-scroll-section>
    <V-Header-Background class="header__canvas" />

    <div ref="headerContainer" class="header__container">
      <h1 class="header__container__title">
        <span class="sr-only">THANAKRIT MANGKANG</span>
        <span class="line" aria-hidden="true">
          <span class="line__content">THANAKRIT</span>
        </span>
        <span class="line" aria-hidden="true">
          <span class="line__content ml-responsive serif">MANGKANG</span>
        </span>
      </h1>

      <div class="header__container__subtitle">
        <p class="sr-only">{{ subTitleText }}</p>
        <span
          v-for="(char, key) in subTitleText"
          :key="key"
          :ref="setSubtitleRefs"
          aria-hidden="true"
          v-html="char"
        />
      </div>
    </div>

    <div class="header__bottom-bar">
      <V-Scroll-Down ref="scrollDownComp" @click="$scrollTo('.works')" />
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin properly
gsap.registerPlugin(ScrollTrigger);

// Refs
const header = ref(null);
const headerContainer = ref(null);
const scrollDownComp = ref(null);

// Data
const subTitleText = "Frontend Developer";
const prefersReducedMotion = ref(false);
const subtitleElements = ref([]);

// Store timeline and scroll triggers for cleanup
let mainTimeline = null;
const scrollTriggers = [];

function setSubtitleRefs(el) {
  if (el && !subtitleElements.value.includes(el)) {
    subtitleElements.value.push(el);
  }
}

function createScrollTriggerAnimations() {
  if (
    !prefersReducedMotion.value &&
    header.value &&
    headerContainer.value &&
    scrollDownComp.value?.scrollDownElement
  ) {
    // Store scroll triggers for cleanup
    const headerScrollTrigger = gsap.fromTo(
      headerContainer.value,
      { y: -3 },
      {
        y: 20,
        scrollTrigger: {
          scrub: true,
          trigger: header.value,
          start: "top-=50px top",
          end: "bottom top",
        },
      }
    );
    scrollTriggers.push(headerScrollTrigger);

    const scrollDownScrollTrigger = gsap.fromTo(
      scrollDownComp.value.scrollDownElement,
      { opacity: 1 },
      {
        opacity: 0,
        scrollTrigger: {
          scrub: 0.75,
          trigger: header.value,
          start: "top+=25% top",
          end: "bottom-=25% top",
        },
      }
    );
    scrollTriggers.push(scrollDownScrollTrigger);
  }
}

function createMainTimeline() {
  const lineContents = header.value
    ? Array.from(header.value.querySelectorAll(".line__content"))
    : [];

  const navSections = Array.from(
    document.querySelectorAll(".nav__sections__list__section")
  );
  const navMenuButtons = Array.from(
    document.querySelectorAll(".nav__menu-button")
  );
  const navElements = navSections.concat(navMenuButtons);

  mainTimeline = gsap.timeline({
    paused: true,
    delay: 0.25,
    onEnd: () => {
      if (window.locomotiveScroll) {
        window.locomotiveScroll.update();
      }
    },
  });

  // Title animation
  if (lineContents.length > 0) {
    if (prefersReducedMotion.value) {
      mainTimeline.from(lineContents, { opacity: 0, stagger: 0.25 });
    } else {
      mainTimeline.from(lineContents, {
        yPercent: 105,
        ease: "power1.out",
        duration: 1,
        stagger: 0.25,
      });
    }
  }

  // Subtitle animation
  if (subtitleElements.value.length > 0) {
    mainTimeline.from(
      subtitleElements.value,
      { opacity: 0, stagger: { amount: 0.5, from: "center" } },
      "-=0.75"
    );
  }

  // Navigation animation
  if (navElements.length > 0) {
    mainTimeline.from(navElements, { opacity: 0, stagger: 0.05 }, "<+0.75");
  }

  // Scroll down animation
  if (scrollDownComp.value?.scrollDownElement) {
    mainTimeline.from(scrollDownComp.value.scrollDownElement, { opacity: 0 }, "<+0.25");
  }

  return mainTimeline;
}

function handleShowLayout() {
  if (mainTimeline) {
    mainTimeline.play();
  }
}

onMounted(async () => {
  try {
    // Check for reduced motion preference
    prefersReducedMotion.value = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Create scroll trigger animations
    createScrollTriggerAnimations();

    // Wait for next tick to ensure DOM is ready
    await nextTick();

    // Create main timeline
    createMainTimeline();

    // Add event listener for show-layout
    window.addEventListener("show-layout", handleShowLayout);

    // Optional: Auto-trigger the animation after a short delay if no show-layout event
    setTimeout(() => {
      if (mainTimeline && !mainTimeline.progress()) {
        console.log('Auto-triggering header animation');
        mainTimeline.play();
      }
    }, 1000);

  } catch (error) {
    console.error('Error initializing header component:', error);
  }
});

onBeforeUnmount(() => {
  // Clean up event listeners
  window.removeEventListener("show-layout", handleShowLayout);

  // Kill main timeline
  if (mainTimeline) {
    mainTimeline.kill();
    mainTimeline = null;
  }

  // Kill all scroll triggers
  scrollTriggers.forEach(trigger => {
    if (trigger.scrollTrigger) {
      trigger.scrollTrigger.kill();
    }
  });
  scrollTriggers.length = 0;

  // Refresh ScrollTrigger to clean up any remaining instances
  ScrollTrigger.refresh();
});
</script>

<style lang="scss">
@use "sass:color";

.header {
  --100vh: calc(100 * var(--vh, 1vh));

  background-color: var(--black-color);
  justify-content: center;
  align-items: center;
  pointer-events: all;
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  max-width: 100vw;
  display: flex;
  width: 100%;
  z-index: 0;

  &__canvas {
    position: absolute;
    z-index: -10;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }

  &__container {
    mix-blend-mode: difference;
    cursor: default;
    color: white;

    &__title {
      margin-bottom: 1rem;
      line-height: 1.2;

      & > *:last-of-type {
        margin-top: min(-0.5rem, calc(1vw * -1));
      }
    }

    &__subtitle {
      font-size: var(--step--1);
      text-align: center;
    }
  }

  &__bottom-bar {
    top: calc(var(--100vh) - var(--step--1));
    transform: translateY(-100%);
    justify-content: flex-start;
    right: var(--x-padding);
    left: var(--x-padding);
    align-items: flex-end;
    position: absolute;
    display: flex;

    &__clock {
      color: color.adjust(grey, $lightness: 1%);
      display: none;
    }

    &__scroll-down {
      color: color.scale(grey, $lightness: 14.0551181102%);
    }
  }

  &__navigation {
    padding-inline: clamp(1rem, 4vw, 5rem);
    mix-blend-mode: difference;
    justify-content: flex-end;
    font-size: var(--step--1);
    list-style-type: none;
    pointer-events: all;
    align-items: center;
    position: absolute;
    display: flex;
    color: white;
    width: 100%;
    left: 0;
    top: 0;

    & > * {
      position: relative;
    }

    @media screen and (max-width: 512px) {
      justify-content: space-between;
      width: 100%;
    }
  }

  &::before {
    position: absolute;
    max-height: 11rem;
    min-height: 2rem;
    content: "";
    width: 100%;
    height: 25%;
    z-index: 0;
    bottom: 0;
    left: 0;

    background: linear-gradient(
      to top,
      var(--black-color) 0%,
      var(--black-color) 25%,
      rgba(3, 3, 3, 0)
    );
  }
}

.line {
  overflow: hidden;
  display: block;

  &__content {
    display: inline-block;
  }
}
</style>