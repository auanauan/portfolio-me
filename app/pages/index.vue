<template>
    <div role="presentation">
        <V-Navbar :current-section="currentSection" />
        <V-Header aria-label="content header" />
        <main aria-label="main content">
            <V-Work />
            <V-About />
            <V-Contact />
        </main>
        <V-Footer />
        <V-Menu :current-section="currentSection" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentSection = ref(0)

onMounted(() => {
    const gsap = window.$gsap || null // หรือถ้าคุณ inject gsap ผ่าน globalProperties ปรับตามนั้น
    const ScrollTrigger = window.$ScrollTrigger || null

    if (!gsap || !ScrollTrigger) return

    gsap.utils.toArray('header, section').forEach((item, i) => {
        ScrollTrigger.create({
            trigger: item,
            start: 'top 45%',
            end: 'bottom 45%',
            onEnter: () => {
                currentSection.value = i
            },
            onEnterBack: () => {
                currentSection.value = i
            }
        })
    })
})
</script>

<style></style>
