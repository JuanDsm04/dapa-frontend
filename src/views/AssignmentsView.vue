<script setup>
import VerticalNav from '@/components/NavBar.vue'

</script>

<template>
    <VerticalNav />
    <main class="content">
        <header>
            <h1>Asignaciones</h1>
        </header>
    </main>
</template>

<style scoped>
.content {
	margin-left: 80px;
	padding: 2rem;
    display: flex;
	flex-direction: column;
    justify-content: start;
    align-items: center;
    height: 100dvh;
    width: calc(100% - 80px);
}

header {
	align-self: start;
	padding: 0 0 30px 0;
}
</style>