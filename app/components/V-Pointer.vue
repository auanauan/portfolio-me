<template>
  <div ref="pointer" class="pointer">
    <img
      :src="ArrowLink"
      ref="pointerArrow"
      aria-label="arrow for indicating link"
      class="pointer__arrow"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, getCurrentInstance } from "vue";
import { gsap } from "gsap";
import ArrowLink from "../images/arrow/link.svg";

const { $emitter } = useNuxtApp();
const pointer = ref(null);
const pointerArrow = ref(null);

const isPointerInWindow = ref(true);
const isHovering = ref(false);

const internalInstance = getCurrentInstance();
const appContext = internalInstance.appContext.config.globalProperties;

// Watchers
watch(isPointerInWindow, (val) => {
  if (!pointer.value) return;
  if (val) pointer.value.classList.remove("pointer--hidden");
  else pointer.value.classList.add("pointer--hidden");
});

watch(isHovering, (val) => {
  if (!pointer.value || !pointerArrow.value) return;

  const duration = 0.3;
  const ease = "back.out";

  const hoveringSize = 7;
  const idleSize = 1;

  if (val) {
    gsap.to(pointer.value, {
      scale: hoveringSize,
      duration,
      ease,
    });
    gsap.fromTo(
      pointerArrow.value,
      { scale: 0, rotate: 0 },
      { scale: 1, rotate: -45, delay: 0.075, duration, ease }
    );
  } else {
    gsap.to(pointer.value, {
      scale: idleSize,
      duration,
      ease,
    });
    gsap.to(pointerArrow.value, {
      scale: 0,
      duration,
      ease,
    });
  }
});

// Handlers
function pointeroutHandler(ev) {
  if (!ev.toElement && !ev.relatedTarget) isPointerInWindow.value = false;
}

function pointeroverHandler() {
  if (isPointerInWindow.value) return;
  isPointerInWindow.value = true;
}

function pointermoveHandler({ clientX, clientY }) {
  if (!pointer.value) return;

  const pointerSize = gsap.getProperty(pointer.value, "width");

  const x = clientX - pointerSize / 2;
  const y = clientY - pointerSize / 2;

  gsap.to(pointer.value, {
    x,
    y,
    opacity: isPointerInWindow.value ? 1 : 0,
    duration: 0.4,
    ease: "power2.out(1.5)",
  });
}

onMounted(() => {
  const prefersReducedMotion = appContext.$prefersReducedMotion?.() || false;

  if ("ontouchstart" in document.documentElement || prefersReducedMotion) {
    return;
  }

  $emitter.on("show-layout", () => {
    gsap.to(pointer.value, {
      delay: 1,
      autoAlpha: 1,
      onComplete: () => {
        document.addEventListener("pointermove", pointermoveHandler, false);
        document.addEventListener("pointerover", pointeroverHandler, false);
        document.addEventListener("pointerout", pointeroutHandler, false);
      },
    });
  });

  $emitter.emit("show-layout");

  $emitter.on("toggle-hovering", (val) => {
    if (typeof val === "boolean") isHovering.value = val;
    else isHovering.value = !isHovering.value;
  });
});
</script>

<style lang="scss">
.pointer {
  transform-origin: center center;
  background-color: #ffe6ed;
  transition: opacity 300ms;
  mix-blend-mode: exclusion;
  justify-content: center;
  pointer-events: none;
  align-items: center;
  border-radius: 50%;
  visibility: hidden;
  position: fixed;
  display: flex;
  height: 12px;
  z-index: 100;
  width: 12px;
  opacity: 0;
  left: 0;
  top: 0;

  &__arrow {
    transform-origin: center center;
    transform: scale(0);
    width: 22.5%;
    height: auto;
  }

  &--hidden {
    opacity: 0 !important;
  }
}
</style>
