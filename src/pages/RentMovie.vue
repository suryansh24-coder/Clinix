<template>
  <div class="rent-page">

    <div class="background-blur blur-1"></div>
    <div class="background-blur blur-2"></div>

    <div class="rent-container">

      <div class="rent-header">

        <span class="premium-badge">
          PREMIUM RENTAL
        </span>

        <h1>
          Rent {{ movie?.title }}
        </h1>

        <p>
          Experience cinema in 4K Ultra HD • Dolby Atmos • Unlimited Streaming
        </p>

      </div>

      <div class="rent-card">
        <div class="poster-section">

          <img
            :src="movie?.poster"
            :alt="movie?.title"
          >
        </div>

        <div class="details-section">
          <div class="movie-info">
            <h2>{{ movie?.title }}</h2>
            <p>

              ⭐ {{ movie?.rating }}

              •

              {{ movie?.duration }}

            </p>

          </div>

          <h3 class="plan-title">

            Choose Your Rental Plan

          </h3>

          <div class="plans">

            <button
              v-for="plan in rentalPlans"
              :key="plan.id"
              class="plan"
              :class="{ active: selectedPlan?.id === plan.id }"
              @click="selectedPlan = plan"
            >

              {{ plan.days }}

              Day

              <span v-if="plan.days>1">s</span>

              <strong>

                ₹{{ plan.price }}

              </strong>

            </button>

          </div>

          <div
            v-if="selectedPlan"
            class="price-box"
          >
            <h2>
              Total
            </h2>
            <h1>
              ₹{{ totalPrice }}
            </h1>
            <button
              class="continue-btn"
              @click="goToPayment"
            >
              Continue Secure Payment →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useMovies } from "@/composables/useMovies"

const route = useRoute()
const router = useRouter()

const {
fetchMovie,
currentMovie: movie
} = useMovies()

import { ref, computed } from 'vue'
const selectedPlan = ref(null)
const rentalPlans = [
  { id: 1, days: 1, price: 99 },
  { id: 2, days: 3, price: 199 },
  { id: 3, days: 7, price: 289 },
  { id: 4, days: 30, price: 369 }
]

const totalPrice = computed(() => {
  return selectedPlan.value ? selectedPlan.value.price : 0
})

onMounted(()=>{
fetchMovie(route.params.id)
})

function goToPayment() {
  router.push({
    name: "RentPayment",
    query: {
      movie: movie.value.title,
      poster: movie.value.poster,   // ADD THIS
      days: selectedPlan.value.days,
      price: selectedPlan.value.price
    }
  })
}

</script>
<style scoped>
.rent-page{
    min-height:100vh;
    position:relative;
    overflow:hidden;
    padding:70px 0;
    background:
    radial-gradient(circle at top left,#1f3b73 0%,transparent 35%),
    radial-gradient(circle at bottom right,#6a11cb 0%,transparent 30%),
    linear-gradient(135deg,#0b1020,#141b33,#1b2450);
}

.background-blur{
    position:absolute;
    width:420px;
    height:420px;
    border-radius:50%;
    filter:blur(120px);
    opacity:.28;
    animation:floatBlob 12s ease-in-out infinite;
}

.blur-1{
    background:#00d4ff;
    top:-120px;
    left:-120px;
}

.blur-2{
    background:#7c5cff;
    bottom:-140px;
    right:-100px;
}

.rent-container{
    width:min(1200px,92%);
    margin:auto;
    position:relative;
    z-index:2;
}

.rent-header{
    text-align:center;
    margin-bottom:50px;
}

.premium-badge{
    display:inline-block;
    padding:8px 18px;
    border-radius:999px;
    background:linear-gradient(90deg,#00d4ff,#7c5cff);
    color:white;
    font-size:13px;
    letter-spacing:2px;
    font-weight:700;
    margin-bottom:20px;
}

.rent-header h1{
    font-size:56px;
    font-weight:800;
    margin-bottom:15px;
    color:white;
}

.rent-header p{
    color:#c7d2fe;
    font-size:18px;
}

.rent-card{
    display:grid;
    grid-template-columns:340px 1fr;
    gap:50px;
    padding:40px;
    border-radius:28px;
    backdrop-filter:blur(22px);
    background:rgba(255,255,255,.07);
    border:1px solid rgba(255,255,255,.15);
    box-shadow:
    0 30px 80px rgba(0,0,0,.45);
}

.poster-section{
    display:flex;
    justify-content:center;
    align-items:center;
}

.poster-section img{
    width:290px;
    border-radius:24px;
    transition:.5s;
    box-shadow:0 25px 60px rgba(0,0,0,.55);
}

.poster-section img:hover{
    transform:translateY(-12px) scale(1.04);
}

.details-section{
    display:flex;
    flex-direction:column;
    justify-content:center;
}

.movie-info h2{
    color:white;
    font-size:40px;
    margin-bottom:12px;
}

.movie-info p{
    color:#cbd5e1;
    font-size:17px;
    margin-bottom:35px;
}

.plan-title{
    color:white;
    margin-bottom:22px;
    font-size:24px;
}

.plans{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:20px;
}

.plan{
    border:none;
    border-radius:20px;
    padding:22px;
    background:rgba(255,255,255,.08);
    color:white;
    cursor:pointer;
    transition:.35s;
    display:flex;
    flex-direction:column;
    gap:12px;
    font-size:20px;
    font-weight:700;
}

.plan strong{
    font-size:30px;
}

.plan:hover{
    transform:translateY(-6px);
    background:linear-gradient(135deg,#00d4ff,#7c5cff);
    box-shadow:0 20px 40px rgba(0,212,255,.35);
}

.plan.active{
    background:linear-gradient(135deg,#00d4ff,#7c5cff);
    transform:scale(1.03);
    box-shadow:0 25px 45px rgba(0,212,255,.45);
}

.price-box{
    margin-top:40px;
    padding:28px;
    border-radius:22px;
    background:rgba(255,255,255,.08);
    border:1px solid rgba(255,255,255,.15);
}

.price-box h2{
    color:#cbd5e1;
}

.price-box h1{
    color:white;
    font-size:54px;
    margin:12px 0 24px;
}

.continue-btn{
    width:100%;
    padding:18px;
    border:none;
    border-radius:18px;
    cursor:pointer;
    font-size:19px;
    font-weight:700;
    color:white;
    background:linear-gradient(90deg,#00d4ff,#7c5cff);
    transition:.35s;
}

.continue-btn:hover{
    transform:translateY(-4px);
    box-shadow:0 18px 40px rgba(0,212,255,.45);
}

@keyframes floatBlob{
    0%,100%{
        transform:translateY(0);
    }
    50%{
        transform:translateY(30px);
    }
}

@media(max-width:900px){

.rent-card{
grid-template-columns:1fr;
}

.poster-section img{
width:240px;
}

.rent-header h1{
font-size:40px;
}

.plans{
grid-template-columns:1fr;
}

}
</style>
