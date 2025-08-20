<template>
  <li class="works__item work-item">
    <a
      :href="work.live"
      target="_blank"
      rel="noopener noreferrer"
      class="work__wrapper"
    >
      <div class="work__image__wrapper">
        <img :src="work.image" :alt="work.title" class="work__image" />
      </div>
      <div class="work__content">
        <h3 class="work__content__title">{{ work.title }}</h3>
        <p class="work__content__tags">{{ work.tags.join(", ") }}</p>
      </div>
    </a>
  </li>
</template>

<script setup lang="ts">
interface Work {
  title: string;
  image: string;
  live: string;
  description: string;
  tags: string[];
}

defineProps<{
  work: Work;
}>();
</script>

<style lang="scss" scoped>
@use "sass:color";

.work {
  position: relative;
  max-width: 475px;
  display: grid;
  gap: 1rem;
  will-change: transform, opacity;

  &__wrapper {
    display: grid;
    gap: 1rem;
    text-decoration: none;
    cursor: pointer;
    grid-template-rows: fit-content fit-content;
  }

  &__image__wrapper {
    overflow: hidden;
    width: 100%;
    min-height: 20rem;
    max-height: 30rem;

    @supports (aspect-ratio: 1/1) {
      aspect-ratio: 1/1;
      min-height: unset;
      max-height: unset;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  &__content {
    $text-color: color.adjust(
      $color: #fff,
      $lightness: -20%,
    );

    &__title {
      font-size: calc(var(--step-0) + 0.4rem);
      letter-spacing: 0.25px;
      color: $text-color;
      margin-bottom: 0;
    }

    &__tags {
      font-size: calc(var(--step--2));
      color: color.scale($text-color, $lightness: -6.25%);
    }
  }

  &__source {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 48px;
    height: 48px;
    cursor: pointer;
    z-index: 20;
    mix-blend-mode: normal;
    color: white;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: rgba(3, 3, 3, 0.35);
    z-index: 10;
    pointer-events: none;
    transition: opacity 0.4s;
  }

  &:hover::after,
  &:focus-within::after {
    opacity: 0;
  }
}
</style>
