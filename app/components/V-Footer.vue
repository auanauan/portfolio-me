<template>
  <footer ref="footer" class="footer">
    <div ref="footerWrapper" class="footer__wrapper" data-scroll-sticky>
      <div ref="footerContent" class="footer__content">
        <p ref="footerContentTitle" class="footer__content__title">
          THANAKRIT <br />
          <span class="serif">MANGKANG</span>
        </p>

        <ul class="footer__content__social">
          <li
            v-for="(link, key) in socialLinks"
            :key="key"
            class="footer__content__social__link"
          >
            <V-Footer-Social-Link
              ref="footerContentSocialLinks"
              target="_blank"
              :href="link.href"
              :aria-label="`link to ${link.label}`"
            >
              {{ link.label }}
            </V-Footer-Social-Link>
          </li>
        </ul>

        <p class="footer__content__copyright">
          Copyright ©{{ currentYear }} AU
        </p>
        <p class="footer__content__note">Made with ❤ from Thailand!</p>
      </div>

      <div
        class="footer__arrow__wrapper"
        role="button"
        aria-label="scroll to top"
        tabindex="0"
        @click="scrollToTop"
      >
        <ArrowUpSVG aria-label="up arrow" class="footer__arrow" />
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ArrowUpSVG from "../images/arrow/up.svg";

gsap.registerPlugin(ScrollTrigger);

// ===== Refs =====
const footer = ref(null);
const footerWrapper = ref(null);
const footerContentTitle = ref(null);
let resizeObserver = null;

// ===== Data =====
const socialLinks = [
  { label: "linkedin", href: "https://linkedin.com/in/thanakrit-mangkang-298a7b211" },
  { label: "github", href: "https://github.com/auanauan/ThanakritMangkang" },
  { label: "facebook", href: "https://www.facebook.com/thana.krit.33886" },
  { label: "email", href: "mailto:thanakritmk38@gmail.com" },
];

const currentYear = computed(() => new Date().getFullYear());

// ===== Methods =====
const setFooterWrapperHeightVar = () => {
  gsap.set(footer.value, {
    "--wrapper-height": `${footerWrapper.value.offsetHeight}px`,
    onComplete: () => {
      if (window.locomotiveScroll?.update) {
        window.locomotiveScroll.update();
      }
    },
  });
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// ===== Lifecycle =====
onMounted(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  resizeObserver = new ResizeObserver(setFooterWrapperHeightVar);
  resizeObserver.observe(footerWrapper.value);
  setFooterWrapperHeightVar();

  if (!prefersReducedMotion) {
    gsap.fromTo(
      footerContentTitle.value,
      { "--x-offset": "0%" },
      {
        "--x-offset": "100%",
        ease: "none",
        scrollTrigger: {
          trigger: footer.value,
          start: `bottom-=${footerContentTitle.value.offsetHeight} bottom`,
          end: `bottom bottom`,
          scrub: true,
        },
      }
    );
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});
</script>

<style lang="scss">
@use "sass:color";

@mixin visible-after {
  position: absolute;
  content: "";
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;

  @media (prefers-reduced-motion: reduce) {
    content: none;
  }
}

.footer {
  height: var(--wrapper-height);
  overflow: hidden;

  &__wrapper {
    justify-content: flex-start;
    align-items: stretch;
    pointer-events: all;
    flex-wrap: wrap;
    position: fixed;
    display: flex;
    z-index: -1;
    bottom: 0;
    right: 0;
    left: 0;
  }

  &__content {
    --secondary-color: #{color.adjust($color: #fff, $lightness: -25%)};
    grid-template-columns: repeat(2, 1fr);
    padding: 2rem clamp(1rem, 4vw, 5rem) 3rem;
    background: var(--black-color);
    align-items: center;
    position: relative;
    color: whitesmoke;
    flex-basis: 80%;
    display: grid;
    flex-grow: 1;
    gap: 1.5rem;
    width: 100%;

    & > *:nth-child(even) {
      justify-self: end;
      text-align: right;
    }

    &__title {
      font-size: var(--step-4);
      display: inline-block;
      width: min-content;
      position: relative;
      --x-offset: 0px;
      overflow: hidden;
      margin: 0;

      .serif {
        margin-inline-start: calc(var(--step-5) / 2);
        display: inline-block;
        position: relative;

        &::after {
          @include visible-after;

          & {
            background-color: rgba($color: #030303, $alpha: 0.75);
            transform: translateX(var(--x-offset));
          }
        }
      }

      &::after {
        @include visible-after;

        & {
          background-color: rgba($color: #030303, $alpha: 0.65);
          transform: translateX(var(--x-offset));
          bottom: calc(50% - 5px);
        }
      }
    }

    &__social {
      padding-inline-start: 0;
      list-style-type: none;
      margin: 0;

      &__link {
        margin: 1rem 0;

        a {
          font-size: calc(var(--step--2) + 0.1rem);
          text-transform: uppercase;
          text-decoration: none;
          color: whitesmoke;
        }
      }
    }

    &__copyright {
      color: var(--secondary-color);
      margin: 0;
    }

    &__note {
      color: var(--secondary-color);
      margin: 0;

      img {
        transform: translateY(20%);
        width: var(--step--1);
        height: auto;

        &:last-of-type {
          width: calc(var(--step--1) + 0.15rem);
        }
      }
    }

    &::after {
      background-color: rgba($color: white, $alpha: 0.125);
      position: absolute;
      content: "";
      width: 1px;
      bottom: 0;
      right: 0;
      top: 0;
    }

    @media screen and (max-width: 600px) {
      grid-template-rows: repeat(4, fit-content);
      grid-template-columns: 1fr;

      & > * {
        justify-self: center !important;
        text-align: center !important;
      }
    }
  }

  &__arrow {
    transition: transform 300ms, opacity 300ms;
    color: color.adjust(white, $lightness: -40%);
    max-width: min(15vw, 130px);
    height: auto;
    width: 40%;

    &__wrapper {
      background: var(--black-color);
      justify-content: center;
      align-items: center;
      min-width: 115px;
      cursor: pointer;
      flex-basis: 20%;
      display: flex;
      flex-grow: 1;

      &:is(:focus, :hover) {
        svg {
          transform: scale(0.9) translateY(-15px);
          opacity: 0.75;
        }
      }
    }

    @media screen and (max-width: 575px) {
      min-height: 30vw;
      color: whitesmoke;
    }
  }
}
</style>
