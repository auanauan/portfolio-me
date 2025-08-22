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
    border-radius: 16px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    }
  }

  &__image__wrapper {
    overflow: hidden;
    width: 100%;
    min-height: 20rem;
    max-height: 30rem;
    border-radius: 16px 16px 0 0;
    position: relative;

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
    transition: transform 0.3s ease;
  }

  &__content {
    $text-color: color.adjust(
      $color: #fff,
      $lightness: -20%,
    );

    padding: 0.75rem 1rem 1.25rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    backdrop-filter: blur(10px);
    border-radius: 0 0 16px 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-top: none;

    &__title {
      font-size: calc(var(--step-0) + 0.4rem);
      letter-spacing: 0.25px;
      color: $text-color;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    &__tags {
      font-size: calc(var(--step--2));
      color: color.scale($text-color, $lightness: -6.25%);
      margin: 0;
      opacity: 0.8;
    }
  }

  &__source {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 48px;
    height: 48px;
    cursor: pointer;
    z-index: 20;
    mix-blend-mode: normal;
    color: white;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.5);
      transform: scale(1.05);
    }
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
    z-index: 10;
    pointer-events: none;
    transition: opacity 0.4s ease;
    border-radius: 16px;
  }

  &:hover::after,
  &:focus-within::after {
    opacity: 0;
  }

  &:hover &__image {
    transform: scale(1.05);
  }
}
</style>