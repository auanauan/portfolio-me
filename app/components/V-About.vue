<template>
  <section
    ref="aboutSection"
    class="about"
    aria-label="about section"
    data-scroll-section
  >
    <V-H2 aria-label="about section heading">About</V-H2>

    <!-- Render full Markdown as hidden for screen readers -->
    <div class="sr-only" v-html="AboutHtmlClean"></div>

    <!-- Animate words -->
    <p ref="aboutText" class="about__text">
      <span
        v-for="(word, key) in aboutWords"
        :key="key"
        :ref="(el) => el && aboutTextWords.push(el)"
        class="about__text__word"
        aria-hidden="true"
        v-html="`${key === 0 ? '' : '&nbsp'}${word}`"
      ></span>
    </p>

    <ul class="about__tech" aria-label="tech I am using">
      <li
        v-for="(icon, key) in icons"
        :key="key"
        :ref="(el) => el && aboutTechItems.push(el)"
      >
        <a
          class="about__tech__item"
          :aria-label="`link to ${icon.svgName} website`"
          :href="icon.link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <component
            :is="icon.component"
            class="about__tech__item__svg"
            aria-hidden="true"
          />
        </a>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutHtml from "../content/about.md?raw";

import JS_SVG from "../images/logo/JavaScript.svg";
import TS_SVG from "../images/logo/TypeScript.svg";
import HTML_SVG from "../images/logo/HTML.svg";
import VUE_SVG from "../images/logo/Vue.js.svg";
import CSS_SVG from "../images/logo/CSS.svg";
import SCSS_SVG from "../images/logo/Sass.svg";
import NUXT_SVG from "../images/logo/NuxtJS.svg";
import REACT_SVG from "../images/logo/React.svg";
import PostgreSQL_SVG from "../images/logo/PostgresSQL.svg";

gsap.registerPlugin(ScrollTrigger);

const AboutHtmlClean = AboutHtml.replace(
  /<script[\s\S]*?<\/script>/gi,
  ""
).replace(/<[^>]+>/g, "");

const about = ref({ text: AboutHtmlClean });

const aboutText = ref(null);
const aboutTextWords = [];
const aboutTechItems = [];
const aboutSection = ref(null);

const icons = [
  {
    component: JS_SVG,
    svgName: "JavaScript",
    link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  {
    component: TS_SVG,
    svgName: "TypeScript",
    link: "https://typescriptlang.org/",
  },
  { component: HTML_SVG, svgName: "HTML" },
  { component: CSS_SVG, svgName: "CSS" },
  { component: SCSS_SVG, svgName: "SASS", link: "https://sass-lang.com/" },
  { component: VUE_SVG, svgName: "VUE", link: "https://vuejs.org/" },
  { component: REACT_SVG, svgName: "VUE", link: "https://react.dev/" },
  { component: NUXT_SVG, svgName: "NUXT", link: "https://nuxt.com/" },
  {
    component: PostgreSQL_SVG,
    svgName: "PostgreSQL",
    link: "https://www.postgresql.org/",
  },
];

const aboutWords = computed(() => about.value.text.split(" "));

onMounted(() => {
  aboutTechItems.forEach((item) => {
    gsap.fromTo(
      item,
      { opacity: 0 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: item,
          start: "top-=2% bottom-=12%",
          once: true,
        },
      }
    );

    gsap.fromTo(
      item,
      { yPercent: gsap.utils.random(-5, -10) },
      {
        yPercent: gsap.utils.random(5, 10),
        scrollTrigger: { trigger: aboutSection.value, scrub: true },
      }
    );
  });

  gsap.fromTo(
    aboutTextWords,
    { opacity: 0, yPercent: 50 },
    {
      opacity: 1,
      yPercent: 0,
      stagger: 0.1,
      scrollTrigger: {
        trigger: aboutText.value,
        start: "top 85%",
        end: "50% 70%",
        once: true,
        scrub: true,
      },
      onUpdate: () => {
        aboutTextWords.forEach((word) =>
          word.classList.add("about__text__word--revealed")
        );
      },
    }
  );
});
</script>

<style lang="scss">
@use "sass:color";

.about {
  padding: 4rem clamp(1rem, 7vw, 5rem) 4rem;
  background-color: var(--black-color);
  pointer-events: all;
  position: relative;
  min-height: 100vh;
  margin-top: -2px;
  color: white;

  &__text {
    color: white;
    font-size: var(--step-0);
    letter-spacing: 0.1px;
    text-align: center;
    max-width: 1100px;
    line-height: 1.5;
    margin: 0 auto;

    &__word {
      display: inline-block;
      opacity: 0;
      transform: translateY(50%);
      transition: transform 0.75s ease, opacity 0.75s ease;

      &--revealed {
        opacity: 1;
        transform: translateY(0%);
      }

      @media (prefers-reduced-motion: reduce) {
        opacity: 1;
        transform: translateY(0%);
      }
    }
  }

  &__tech {
    justify-content: space-evenly;
    padding-inline-start: 0;
    list-style-type: none;
    align-items: center;
    gap: var(--step-3);
    max-width: 1100px;
    margin: 6% auto 0;
    flex-wrap: wrap;
    display: flex;

    &__item {
      transition: transform 0.3s var(--ease-back);
      display: inline-block;
      cursor: none;

      &:is(:hover, :focus-visible) {
        transform: scale(0.9);
      }

      &__svg {
        max-width: 150px;
        opacity: 1;
        height: auto;
        width: 100%;
        transition: filter 0.3s ease;

        @media screen and (max-width: 500px) {
          max-width: 30vw;
        }
      }

      &:hover &__svg {
        filter: brightness(1.2);
      }

      @media (prefers-reduced-motion: reduce) {
        cursor: pointer;
      }
    }
  }

  &__bg-img {
    filter: drop-shadow(0 0 2rem #fff) blur(3px);
    width: calc(var(--step-5) * 2);
    position: absolute;
    height: auto;
  }
}
</style>