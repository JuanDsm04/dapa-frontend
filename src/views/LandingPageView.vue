<script setup>
import CarouselClients from '@/components/Carousel.vue';

const slides = [
  {
    src: new URL('@/assets/images/camion1.jpeg', import.meta.url).href,
    alt: 'Camión 1'
  },
  {
    src: new URL('@/assets/images/camion2.jpeg', import.meta.url).href,
    alt: 'Camión 2'
  },
  {
    src: new URL('@/assets/images/camion3.jpeg', import.meta.url).href,
    alt: 'Camión 3'
  },
  {
    src: new URL('@/assets/images/camion4.jpeg', import.meta.url).href,
    alt: 'Camión 4'
  },
  {
    src: new URL('@/assets/images/camion5.jpeg', import.meta.url).href,
    alt: 'Camión 5'
  }
]
</script>

<template>
    <main>
        <header class="hero">
            <CarouselClients :slides="slides" />
        </header>

        <section>
            <p>¡Mudarte o transportar tus cosas no tiene que ser complicado! Con nosotros, tienes un servicio completo en el que puedes confiar. Conoce nuestras fortalezas:</p>
            
            <div>
                <article>
                    <span class="material-symbols-outlined">schedule</span>
                    <h3>Puntualidad</h3>
                    <p>Llegamos a tiempo, siempre</p>
                </article>
                <article>
                    <span class="material-symbols-outlined">shield</span>
                    <h3>Seguridad</h3>
                    <p>Tus pertenencias viajan protegidas</p>
                </article>
                <article>
                    <span class="material-symbols-outlined">how_to_reg</span>
                    <h3>Profesionalismo</h3>
                    <p>Servicio serio y de calidad</p>
                </article>
                <article>
                    <span class="material-symbols-outlined">payments</span>
                    <h3>Economía</h3>
                    <p>Tarifas accesibles para cada destino</p>
                </article>
            </div>
        </section>

        <footer>
            <div>
                <article>
                    <h2>Sobre nosotros</h2>
                    <p>Somos una empresa guatemalteca enfocada en realizar servicios de mudanzas, fletes y traslados a todo el país.</p>
                </article>
                
                <address>
                    <h2>Contáctanos</h2>
                    <ul>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" viewBox="0 0 32 32">
                                <path fill-rule="evenodd" d="M 24.503906 7.503906 C 22.246094 5.246094 19.246094 4 16.050781 4 C 9.464844 4 4.101563 9.359375 4.101563 15.945313 C 4.097656 18.050781 4.648438 20.105469 5.695313 21.917969 L 4 28.109375 L 10.335938 26.445313 C 12.078125 27.398438 14.046875 27.898438 16.046875 27.902344 L 16.050781 27.902344 C 22.636719 27.902344 27.996094 22.542969 28 15.953125 C 28 12.761719 26.757813 9.761719 24.503906 7.503906 Z M 16.050781 25.882813 L 16.046875 25.882813 C 14.265625 25.882813 12.515625 25.402344 10.992188 24.5 L 10.628906 24.285156 L 6.867188 25.269531 L 7.871094 21.605469 L 7.636719 21.230469 C 6.640625 19.648438 6.117188 17.820313 6.117188 15.945313 C 6.117188 10.472656 10.574219 6.019531 16.054688 6.019531 C 18.707031 6.019531 21.199219 7.054688 23.074219 8.929688 C 24.949219 10.808594 25.980469 13.300781 25.980469 15.953125 C 25.980469 21.429688 21.523438 25.882813 16.050781 25.882813 Z M 21.496094 18.445313 C 21.199219 18.296875 19.730469 17.574219 19.457031 17.476563 C 19.183594 17.375 18.984375 17.328125 18.785156 17.625 C 18.585938 17.925781 18.015625 18.597656 17.839844 18.796875 C 17.667969 18.992188 17.492188 19.019531 17.195313 18.871094 C 16.894531 18.722656 15.933594 18.40625 14.792969 17.386719 C 13.90625 16.597656 13.304688 15.617188 13.132813 15.320313 C 12.957031 15.019531 13.113281 14.859375 13.261719 14.710938 C 13.398438 14.578125 13.5625 14.363281 13.710938 14.1875 C 13.859375 14.015625 13.910156 13.890625 14.011719 13.691406 C 14.109375 13.492188 14.058594 13.316406 13.984375 13.167969 C 13.910156 13.019531 13.3125 11.546875 13.0625 10.949219 C 12.820313 10.367188 12.574219 10.449219 12.390625 10.4375 C 12.21875 10.429688 12.019531 10.429688 11.820313 10.429688 C 11.621094 10.429688 11.296875 10.503906 11.023438 10.804688 C 10.75 11.101563 9.980469 11.824219 9.980469 13.292969 C 9.980469 14.761719 11.050781 16.183594 11.199219 16.382813 C 11.347656 16.578125 13.304688 19.59375 16.300781 20.886719 C 17.011719 21.195313 17.566406 21.378906 18 21.515625 C 18.714844 21.742188 19.367188 21.710938 19.882813 21.636719 C 20.457031 21.550781 21.648438 20.914063 21.898438 20.214844 C 22.144531 19.519531 22.144531 18.921875 22.070313 18.796875 C 21.996094 18.671875 21.796875 18.597656 21.496094 18.445313 Z"></path>
                            </svg>
                            5055-7258
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" viewBox="0 0 50 50">
                                <path d="M 14 3.9902344 C 8.4886661 3.9902344 4 8.4789008 4 13.990234 L 4 35.990234 C 4 41.501568 8.4886661 45.990234 14 45.990234 L 36 45.990234 C 41.511334 45.990234 46 41.501568 46 35.990234 L 46 13.990234 C 46 8.4789008 41.511334 3.9902344 36 3.9902344 L 14 3.9902344 z M 18.005859 12.033203 C 18.633859 12.060203 19.210594 12.414031 19.558594 12.957031 C 19.954594 13.575031 20.569141 14.534156 21.369141 15.785156 C 22.099141 16.926156 22.150047 18.399844 21.498047 19.589844 L 20.033203 21.673828 C 19.637203 22.237828 19.558219 22.959703 19.824219 23.595703 C 20.238219 24.585703 21.040797 26.107203 22.466797 27.533203 C 23.892797 28.959203 25.414297 29.761781 26.404297 30.175781 C 27.040297 30.441781 27.762172 30.362797 28.326172 29.966797 L 30.410156 28.501953 C 31.600156 27.849953 33.073844 27.901859 34.214844 28.630859 C 35.465844 29.430859 36.424969 30.045406 37.042969 30.441406 C 37.585969 30.789406 37.939797 31.366141 37.966797 31.994141 C 38.120797 35.558141 35.359641 37.001953 34.556641 37.001953 C 34.000641 37.001953 27.316344 37.761656 19.777344 30.222656 C 12.238344 22.683656 12.998047 15.999359 12.998047 15.443359 C 12.998047 14.640359 14.441859 11.879203 18.005859 12.033203 z"></path>
                            </svg>
                            6676-5803
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" viewBox="0 0 50 50">
                                <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z"></path>
                            </svg>
                            De aquí para allá
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" viewBox="0 0 30 30">
                                <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"></path>
                            </svg>
                            servicios.deaquiparaalla@gmail.com
                        </li>
                    </ul>
                </address>
            </div>
            <p>© 2025 Copyright: De aquí para allá.</p>
        </footer>
    </main>
</template>

<style scoped>
    header {
        width: 100%;
        height: 100vh;
    }

    section {
        background-color: #D9D9D9;
        text-align: center;
        padding: 30px 0 100px 0;
    }

    section > p {
        padding: 50px;
        font-size: 20px;
    }

    section div {
        width: 90%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 50px;
        justify-content: center;
        align-items: center;
    }
    
    section article {
        background-color: #fff;
        padding: 30px 30px 80px 30px;
        border-radius: 8px;
        align-items: center;
        text-align: center;
    }

    h3 {
        font-weight: 500;
        font-size: 30px;
    }

    h2 {
        font-weight: 500;
        padding-bottom: 10px;
    }

    section article p {
        font-size: 16px;
    }

    section span {
        font-size: 60px; 
        color: var(--text-on-light);
        margin-bottom: 20px;
    }

    footer {
        padding-top: 40px;
    }

    footer div {
        width: 90%;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 40px;
    }

    footer article {
        width: 40%;
    }

    footer address{
        width: 40%;
        font-style: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: flex;
        align-items: center;
    }

    li svg {
        padding: 5px 15px 5px 0;
        min-width: 30px;
    }

    footer > p{
        text-align: center;
        padding: 40px 20px 20px 20px;
    }

    @media (max-width: 1200px) {
        footer article {
            width: 100%;
        }

        footer address{
            width: 100%;
        }
    }

    @media (max-width: 770px) {
        section > p {
            font-size: 16px;
            padding: 30px;
        }

        section article p {
            font-size: 14px;
        }

        h3 {
            font-size: 24px;
        }

        h2 {
            font-size: 20px;
        }

        section span {
            font-size: 40px;
        }

        footer div {
            flex-direction: column;
        }

        footer > p {
            font-size: 14px;
        }

        li{
            font-size: 10px;
        }
    }
</style>