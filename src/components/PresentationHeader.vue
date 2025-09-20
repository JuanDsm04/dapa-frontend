<script setup lang="ts"></script>
<template>
    <header>
        <div>
            <h1>De aquí para allá</h1>
            <span>Mudanzas, fletes y translados</span>
        </div>
        <img src="@/assets/images/logo_2.png" alt="Company logo" class="logo">
    </header>
</template>

<style scoped>
header {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    padding: 2.5rem 3rem;
    background-color: var(--neutral-white);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    border-radius: 10px;
    gap: 2rem;
}

h1 {
    font-size: 2rem;
    font-weight: 600;
}

header img {
    width: 9rem;
    height: auto;
}

header div {
    min-width: 0;
}

@media (max-width: 770px) {
    header {
        padding: 1.5rem 2rem;
    }

    h1 {
        font-size: 1.5rem;
    }

    header img {
        width: 7rem;
    }
}
</style>