<template>
    <div>
        <div role="presentation" class="scroller">
            <NuxtPage />
        </div>
        <V-Pointer />
        <V-Loader />
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

function setViewHeight() {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
}

function clear() {
    console.clear()
}

onMounted(() => {
    clear()
    setViewHeight()
    window.addEventListener('resize', setViewHeight)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', setViewHeight)
})
</script>

<style></style>
