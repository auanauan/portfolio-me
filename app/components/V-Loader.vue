<template>
    <div ref="loader" class="loader" style="
      position: fixed;
      top: 0;
      left: 0;
      z-index: 5;
      width: 100vw;
      height: 100vh;
      background-color: #030303;
      pointer-events: all;
    ">
        <p class="loader__word">
            <span v-for="(char, key) in firstWord" :key="key" :ref="setLoaderWord1Chars" class="loader__word__char">
                {{ char }}
            </span>
        </p>
        <p class="loader__word">and Welcome.</p>
        <p class="loader__word loader__word--logo serif">Portfolio.</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

// Reactive state
const firstWord = 'Hello'

const loader = ref(null)
const loaderWord1Chars = ref([])

function setLoaderWord1Chars(el) {
    if (el && !loaderWord1Chars.value.includes(el)) {
        loaderWord1Chars.value.push(el)
    }
}

// Dummy placeholders for scroll control; replace with your own logic or global composables
function disableScrollY() {
    document.body.style.overflowY = 'hidden'
}
function enableScrollY() {
    document.body.style.overflowY = ''
}

onMounted(() => {
    disableScrollY()

    const readTime = 0.45
    const loaderChildren = Array.from(loader.value.children)

    const tl = gsap.timeline({
        delay: 0.6,
        paused: false,
        defaults: { duration: 0.65, ease: 'power1.out' }
    })

    tl.set(loaderChildren, {
        opacity: 0,
        filter: 'blur(10px)'
    })

    for (let i = 0; i < loaderChildren.length; i++) {
        const loaderChild = loaderChildren[i]

        if (i === 0) {
            tl.set(loaderChild, { opacity: 1, filter: 'blur(0px)' })
            tl.fromTo(
                loaderWord1Chars.value,
                { color: '#000' },
                { color: '#fff', ease: 'power3.out', stagger: 0.05 }
            )
        } else {
            tl.to(
                loaderChild,
                { opacity: 1, filter: 'blur(0px)' },
                '-=0.125'
            )
        }

        tl.to(loaderChild, { opacity: 0, filter: 'blur(5px)' }, `+=${readTime}`)
    }

    tl.to(loader.value, {
        opacity: 0,
        onStart: () => {
            enableScrollY()
        },
        onComplete: () => {
            window.dispatchEvent(new Event('show-shader'))
            window.dispatchEvent(new Event('show-layout'))
        }
    })

    tl.set(loader.value, { display: 'none' })
})
</script>

<style lang="scss">
.loader {
    background-color: #030303;
    pointer-events: all;
    color: #dfdfdf;
    position: fixed;
    height: 100vh;
    width: 100vw;
    z-index: 5;
    left: 0;
    top: 0;

    &__word {
        transform: translate(-50%, -50%);
        font-size: var(--step-2);
        position: absolute;
        line-height: 1.125;
        overflow: hidden;
        opacity: 0;
        left: 50%;
        margin: 0;
        top: 50%;

        &__char {
            display: inline-block;
        }

        &--logo {
            font-size: var(--step-4);
        }
    }
}
</style>
