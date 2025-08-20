<template>
  <canvas ref="canvas" class="canvas" aria-label="landing background" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { gsap } from "gsap";

import fragmentShader from "../shaders/fragment.glsl";
import vertexShader from "../shaders/vertex.glsl";

const canvas = ref(null);

const clock = new THREE.Clock();
const MAX_DPR = 2.3;

let prefersReducedMotion = false;
let isShaderRunning = false;
let hasRunOnce = false;
let renderer = null;
let aspect = 16 / 9;
let camera = null;
let object = null;
let scene = null;
let animationId = null; // For requestAnimationFrame fallback

function resize() {
  if (!canvas.value || !renderer || !camera || !object) return;
  
  const width = canvas.value.clientWidth;
  const height = canvas.value.clientHeight;

  if (canvas.value.width !== width || canvas.value.height !== height) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  camera.updateMatrix();
  object.updateMatrix();

  object.material.uniforms.resolution.value.set(
    window.innerWidth,
    window.innerHeight
  );
}

function render() {
  if (
    window.scrollY - 20 > window.innerHeight ||
    !isShaderRunning ||
    (prefersReducedMotion && hasRunOnce)
  ) {
    return;
  }

  if (prefersReducedMotion) hasRunOnce = true;

  if (object?.material?.uniforms?.time) {
    object.material.uniforms.time.value = clock.getElapsedTime();
  }
  
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

// Fallback animation loop using requestAnimationFrame
function animate() {
  render();
  animationId = requestAnimationFrame(animate);
}

onMounted(() => {
  try {
    prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    aspect = window.innerWidth / window.innerHeight;

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      precision: "highp",
      canvas: canvas.value,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(new THREE.Color(0x030303));
    renderer.failIfMajorPerformanceCaveat = true;

    camera = new THREE.PerspectiveCamera(70, aspect, 0.5, 2);
    camera.position.set(0, 0, 1);

    const size = 2;
    const geometry = new THREE.PlaneGeometry(size * aspect, size);
    const material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      uniforms: {
        time: { value: 0.0 },
        randomSeed: { value: Math.random() },
        objectOpacity: { value: prefersReducedMotion ? 1.0 : 0.0 },
        noisePower: { value: 1.0 },
        pixelRatio: { value: window.devicePixelRatio },
        resolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
      depthTest: false,
      transparent: true,
    });

    object = new THREE.Mesh(geometry, material);
    scene.add(object);

    camera.matrixAutoUpdate = false;
    object.matrixAutoUpdate = false;

    window.addEventListener("resize", resize);
    resize();

    window.addEventListener("show-shader", () => {
      if (
        object &&
        object.material &&
        object.material.uniforms &&
        object.material.uniforms.objectOpacity
      ) {
        isShaderRunning = true;
        gsap.to(object.material.uniforms.objectOpacity, {
          value: 1,
          duration: 1.75,
          delay: 0.125,
        });
      } else {
        console.warn(
          "object or uniforms.objectOpacity not ready yet for GSAP animation"
        );
      }
    });

    // Try to use GSAP ticker, fallback to requestAnimationFrame
    if (gsap.ticker && typeof gsap.ticker.add === 'function') {
      console.log('Using GSAP ticker');
      gsap.ticker.add(render);
    } else {
      console.log('GSAP ticker not available, using requestAnimationFrame');
      animate();
    }

  } catch (error) {
    console.error('Error during component initialization:', error);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
  
  // Clean up animation
  if (gsap.ticker && typeof gsap.ticker.remove === 'function') {
    gsap.ticker.remove(render);
  }
  
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  // Clean up Three.js resources
  if (renderer) {
    renderer.dispose();
  }
  if (object?.material) {
    object.material.dispose();
  }
  if (object?.geometry) {
    object.geometry.dispose();
  }
});
</script>

<style>
.canvas {
  width: 100%;
  height: 100%;
}
</style>