<template>
  <div class="box" @click="handleClick">
    <span
      v-for="n in 5"
      :key="n"
      class="line"
      :class="{ running: click }"
    ></span>
    <audio ref="audioRef" :src="music" loop></audio>
  </div>
</template>

<script setup>
import { ref } from "vue";
import music from "../audio/Neon.mp3";

const audioRef = ref(null);
const click = ref(false);

const handleClick = () => {
  click.value = !click.value;
  if (click.value) {
    audioRef.value.play();
  } else {
    audioRef.value.pause();
  }
};
</script>

<style lang="scss" scoped>
@use "sass:list";

$line-count: 5;
$animation-delays: 0.2s, 0.3s, 0.4s, 0.5s, 0.8s;

.box {
  display: flex;
  cursor: pointer;
  position: fixed;
  left: 7rem;
  top: 4rem;
  z-index: 10;
  align-items: center;
}

.line {
  background: whitesmoke;
  border: 1px solid whitesmoke;
  height: 1rem;
  width: 2px;
  margin: 0 0.1rem;
  animation: play 1s ease infinite;
  animation-play-state: paused;

  @for $i from 1 through $line-count {
    &:nth-child(#{$i}) {
      animation-delay: list.nth($animation-delays, $i);
    }
  }
}

.line.running {
  animation-play-state: running;
}

@keyframes play {
  0% {
    transform: scaleY(1);
  }

  50% {
    transform: scaleY(2);
  }

  100% {
    transform: scaleY(1);
  }
}
</style>
