<template>
  <Transition name="success-fade">
    <div
      v-if="show"
      class="success-overlay"
    >
      <div class="success-card">

        <div class="success-circle">
          ✓
        </div>

        <h1>Payment Successful</h1>

        <p>
          Your rental has been activated successfully.
        </p>

        <div class="loading-bar">
          <div class="loading-fill"></div>
        </div>

        <span class="loading-text">
          Loading your library...
        </span>

      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>

.success-overlay{
position:fixed;
inset:0;
background:rgba(8,10,20,.82);
backdrop-filter:blur(10px);
display:flex;
justify-content:center;
align-items:center;
z-index:99999;
}

.success-card{
width:430px;
padding:45px;
border-radius:30px;
background:rgba(255,255,255,.08);
border:1px solid rgba(255,255,255,.15);
backdrop-filter:blur(20px);
text-align:center;
box-shadow:0 35px 80px rgba(0,0,0,.45);
}

.success-circle{
width:95px;
height:95px;
margin:auto;
border-radius:50%;
background:linear-gradient(135deg,#22c55e,#16a34a);
display:flex;
justify-content:center;
align-items:center;
font-size:46px;
font-weight:bold;
color:white;
animation:pop .45s ease;
}

.success-card h1{
margin-top:30px;
font-size:38px;
color:white;
}

.success-card p{
margin:15px 0 35px;
color:#d1d5db;
font-size:17px;
}

.loading-bar{
width:100%;
height:8px;
border-radius:999px;
background:rgba(255,255,255,.1);
overflow:hidden;
}

.loading-fill{
height:100%;
width:100%;
background:linear-gradient(90deg,#00d4ff,#7c5cff);
animation:loading 2s linear forwards;
}

.loading-text{
display:block;
margin-top:18px;
color:#cbd5e1;
font-size:15px;
}

.success-fade-enter-active,
.success-fade-leave-active{
transition:.35s;
}

.success-fade-enter-from,
.success-fade-leave-to{
opacity:0;
}

@keyframes loading{
from{
width:0;
}
to{
width:100%;
}
}
@keyframes pop{
0%{
transform:scale(.3);
}
70%{
transform:scale(1.15);
}
100%{
transform:scale(1);
}
}

</style>