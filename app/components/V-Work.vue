<template>
  <section
    ref="works"
    class="works"
    aria-label="works section"
    data-scroll-section
  >
    <V-H2 aria-label="work section heading">Work</V-H2>
    <ul class="works__list" aria-label="works list">
      <WorkItem
        v-for="(work, key) in works"
        :key="key"
        ref="worksListItems"
        :work="work"
        :i="key"
        :aria-label="work.title"
        class="works__list__item"
      />
    </ul>
  </section>
</template>

<script setup lang="ts">
import WorkItem from "../components/V-Work-Item.vue";

interface Work {
  title: string;
  image: string;
  live: string;
  description: string;
  tags: string[];
}

const works: Work[] = [
  {
    title: "Nordic Land",
    image: "../images/projects/NordicLand.jpg",
    live: "#",
    description: "Website, NuxtJS, VueJS, SSCSS, Prisma, PostgreSQL",
    tags: ["Vue", "Nuxt", "Prisma", "PostgreSQL", "SSCSS"],
  },
  {
    title: "Maze",
    image: "../images/projects/NordicLand.jpg",
    live: "#",
    description: "Website, WASM",
    tags: ["WASM", "WebGL"],
  },
];
</script>

<style lang="scss" scoped>
@use 'sass:color';

.works {
  padding: 4rem clamp(1rem, 7vw, 5rem) 1rem;
  background-color: var(--black-color);
  pointer-events: all;
  margin-top: -1px;
  color: white;

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--step-3);
    justify-items: center;
    align-items: start;
    list-style: none;
    padding-inline-start: 0;
    margin: 0 auto;
    max-width: 1100px;

    @media screen and (min-width: 798px) {
      > :nth-child(even) {
        margin-block-start: 35%;
      }
    }
  }
}
</style>
