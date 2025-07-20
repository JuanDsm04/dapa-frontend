<script setup>
import { useRouter } from 'vue-router'
import { getUserRole } from '@/utils/auth'
const router = useRouter()

function goBack() {
  const role = getUserRole()
  
  if (role === 'admin') {
    router.push('/assignments')
  } else if (role === 'driver') {
    router.push('/profile')
  } else {
    router.push('/')
  }
}
</script>

<template>
    <section>
        <article>
            <h1>De aquí para...<br /><span>Ningún lado</span></h1>
            <p>Esta página no existe,<br />te recomendamos ir al inicio</p>
            <button class="button-1" @click="goBack">Regresar</button>
        </article>
        <div>
            <img src="../assets/images/not_found.png" alt="Camión perdido" />
        </div>
        <button class="button-2" @click="goBack">Regresar</button>
    </section>
</template>

<style scoped>
section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    height: 100vh;
    padding: 4rem;
}

article h1 {
    font-size: 5rem;
    font-weight: 700;
    margin: 0;
}

article span {
    display: block;
    font-weight: 400;
    font-size: 4rem;
    margin-top: 0.5rem;
}

article p {
    margin-top: 1rem;
    font-size: 2rem;
    color: #555;
}

div {
    text-align: center;
}

div img {
    width: 100%;
    max-width: 800px;
}

button {
    background-color: #3949ab;
    color: white;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 1rem;
}

button:hover {
    background-color: #303f9f;
}

.button-1 {
    display: block;
}

.button-2 {
    display: none;
    margin: 0 auto;
}

@media (max-width: 1600px) {
    article h1 {
        font-size: 4rem;
    }

    article span {
        font-size: 3rem;
    }

    article p {
        font-size: 1.5rem;
    }

    div img {
        width: 100%;
        max-width: 600px;
    }
}

@media (max-width: 1100px) {
    section {
        padding: 2rem;
    }

    article h1 {
        font-size: 3rem;
    }

    article span {
        font-size: 2rem;
    }

    article p {
        font-size: 1rem;
    }

    div img {
        width: 100%;
        max-width: 600px;
    }
}

@media (max-width: 770px) {
    section {
        padding: 1.5rem;
        text-align: center;
    }

    article h1 {
        font-size: 2rem;
    }

    article span {
        font-size: 1.5rem;
    }

    article p {
        font-size: 1rem;
    }

    section {
        grid-template-columns: 1fr;
    }

    div img {
        width: 100%;
        max-width: 300px;
    }

    .button-1 {
        display: none;
    }

    .button-2 {
        display: block;
    }

}
</style>