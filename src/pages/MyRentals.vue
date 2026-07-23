<template>
  <div class="rentals-page">
    <div class="background-blur blur-1"></div>
    <div class="background-blur blur-2"></div>

    <div class="container">

      <div class="page-header">

        <h1>🎬 My Rentals</h1>

        <p>
          Watch your rented movies anytime before they expire.
        </p>

      </div>

      <div
  v-for="rental in rentals"
  :key="rental.id"
  class="rental-card"
>

  <div class="poster">

    <img
      :src="rental.poster"
      :alt="rental.movie"
    />

    </div>

    <div class="details">

        <span class="badge">
        ACTIVE RENTAL
        </span>

        <h2>{{ rental.movie }}</h2>

        <p class="quality">
        4K Ultra HD • Dolby Atmos
        </p>

        <div class="info">

        <p>
            ⏳ Rental: <strong>{{ rental.days }} Days</strong>
        </p>

        <p>
            💳 Paid: <strong>₹{{ rental.price }}</strong>
        </p>

        </div>

        <div style="display:flex;gap:15px;flex-wrap:wrap;">

        <button class="watch-btn">
            ▶ Watch Now
        </button>

        <button
            class="remove-btn"
            @click="removeRental(rental.id)"
        >
            🗑 Remove
        </button>

        </div>

    </div>

    </div>

  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const rentals = ref([])

onMounted(() => {
  rentals.value = JSON.parse(
    localStorage.getItem("cinevault_rentals") || "[]"
  )
})

function removeRental(id) {
  rentals.value = rentals.value.filter(r => r.id !== id)

  localStorage.setItem(
    "cinevault_rentals",
    JSON.stringify(rentals.value)
  )
}
</script>

<style scoped>
.rentals-page{
min-height:100vh;
padding:70px 0;
position:relative;
overflow:hidden;
background:
linear-gradient(135deg,#0b1020,#131d3d,#1d2954);
}

.background-blur{
position:absolute;
width:400px;
height:400px;
border-radius:50%;
filter:blur(120px);
opacity:.25;
animation:float 12s infinite ease-in-out;
}

.blur-1{
background:#00d4ff;
top:-100px;
left:-100px;
}

.blur-2{
background:#7c5cff;
right:-100px;
bottom:-100px;
}

.container{
width:min(1200px,92%);
margin:auto;
position:relative;
z-index:2;
}

.page-header{
text-align:center;
margin-bottom:50px;
}

.page-header h1{
font-size:54px;
color:white;
margin-bottom:10px;
}

.page-header p{
color:#cbd5e1;
font-size:18px;
}

.rental-card{
display:grid;
grid-template-columns:300px 1fr;
gap:40px;
padding:35px;
border-radius:28px;
background:rgba(255,255,255,.08);
backdrop-filter:blur(20px);
border:1px solid rgba(255,255,255,.12);
}

.poster img{
width:100%;
border-radius:20px;
box-shadow:0 20px 50px rgba(0,0,0,.45);
}

.badge{
display:inline-block;
padding:8px 18px;
border-radius:999px;
background:linear-gradient(90deg,#00d4ff,#7c5cff);
color:white;
font-size:13px;
font-weight:700;
margin-bottom:20px;
}

.details h2{
font-size:42px;
color:white;
margin-bottom:10px;
}

.quality{
color:#cbd5e1;
margin-bottom:25px;
}

.info p{
color:white;
margin-bottom:12px;
font-size:18px;
}

.watch-btn{
margin-top:25px;
padding:18px 30px;
border:none;
border-radius:16px;
cursor:pointer;
font-size:18px;
font-weight:700;
color:white;
background:linear-gradient(90deg,#00d4ff,#7c5cff);
transition:.3s;
}

.watch-btn:hover{
transform:translateY(-4px);
box-shadow:0 18px 45px rgba(0,212,255,.35);
}

@keyframes float{
0%,100%{
transform:translateY(0);
}
50%{
transform:translateY(25px);
}
}

@media(max-width:900px){

.rental-card{
grid-template-columns:1fr;
}

.page-header h1{
font-size:40px;
}

}
.remove-btn{
margin-top:25px;
padding:18px 30px;
border:none;
border-radius:16px;
cursor:pointer;
font-size:18px;
font-weight:700;
background:#dc2626;
color:white;
transition:.3s;
}

.remove-btn:hover{
background:#b91c1c;
transform:translateY(-4px);
}
</style>