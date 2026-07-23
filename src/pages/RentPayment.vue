<template>
  <div class="payment-page">

    <div class="payment-bg payment-bg-1"></div>
    <div class="payment-bg payment-bg-2"></div>

    <div class="payment-container">

      <div class="payment-card">
        <!-- LEFT SIDE -->
        <div class="left-panel">

          <h1>💳 Secure Checkout</h1>

          <p class="subtitle">
            Your rental is almost ready.
          </p>

          <div class="movie-card">

            <h2>{{ movie }}</h2>

            <div class="summary-row">
              <span>Rental Plan</span>
              <strong>{{ days }} Days</strong>
            </div>

            <div class="summary-row">
              <span>Streaming</span>
              <strong>4K Ultra HD</strong>
            </div>

            <div class="summary-row">
              <span>Platform Fee</span>
              <strong>FREE</strong>
            </div>

            <div class="summary-row">
              <span>GST</span>
              <strong>₹0</strong>
            </div>

            <hr>

            <div class="summary-row total">

              <span>Total</span>

              <strong>₹{{ price }}</strong>

            </div>

          </div>

        </div>

        <!-- RIGHT SIDE -->

        <div class="right-panel">

          <h2>Select Payment Method</h2>

          <div class="payment-options">

            <div
              class="payment-option"
              :class="{active:selected==='upi'}"
              @click="selected='upi'"
            >

              <span>📱</span>

              <div>

                <h3>UPI</h3>

                <p>Google Pay • PhonePe • Paytm</p>

              </div>

            </div>

            <div
              class="payment-option"
              :class="{active:selected==='card'}"
              @click="selected='card'"
            >

              <span>💳</span>

              <div>

                <h3>Credit / Debit Card</h3>

                <p>Visa • Mastercard • RuPay</p>

              </div>

            </div>

            <div
              class="payment-option"
              :class="{active:selected==='wallet'}"
              @click="selected='wallet'"
            >

              <span>👛</span>

              <div>

                <h3>Wallet</h3>

                <p>Amazon Pay • Paytm Wallet</p>

              </div>

            </div>

            <div
              class="payment-option"
              :class="{active:selected==='bank'}"
              @click="selected='bank'"
            >

              <span>🏦</span>

              <div>

                <h3>Net Banking</h3>
                <p>All Major Banks</p>
              </div>
            </div>
          </div>

          <button
            class="pay-btn"
            @click="payNow"
            :disabled="processing"
            >
            <template v-if="processing">
                <span class="spinner"></span>
                Processing Payment...
            </template>

            <template v-else>
                🔒 Pay Securely ₹{{ price }}
            </template>
            </button>
        </div>
      </div>
    </div>
    <PaymentSuccess
    :show="showSuccess"
    />
    </div>
</template>

<script setup>
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import PaymentSuccess from "@/components/common/PaymentSuccess.vue"

const route = useRoute()
const router = useRouter()

const movie = route.query.movie
const poster = route.query.poster
const days = route.query.days
const price = route.query.price

const selected = ref("upi")
const processing = ref(false)
const showSuccess = ref(false)

function payNow() {

  processing.value = true

  setTimeout(() => {
    processing.value = false
    showSuccess.value = true

    const rentals = JSON.parse(localStorage.getItem("cinevault_rentals") || "[]")

    rentals.unshift({
      id: Date.now(),
      movie,
      poster,
      days,
      price,
      rentedAt: new Date().toISOString()
    })

    localStorage.setItem(
    "cinevault_rentals",
    JSON.stringify(rentals)
    )

    setTimeout(() => {
      router.push({
        name: "MyRentals"
        })
    }, 2500)
  }, 2000)
}
</script>

<style scoped>
.payment-page{
    min-height:100vh;
    position:relative;
    overflow:hidden;
    padding:70px 0;
    background:
    radial-gradient(circle at top left,#0ea5e9 0%,transparent 30%),
    radial-gradient(circle at bottom right,#7c3aed 0%,transparent 35%),
    linear-gradient(135deg,#0b1020,#111827,#1e293b);
}

.payment-bg{
    position:absolute;
    width:450px;
    height:450px;
    border-radius:50%;
    filter:blur(120px);
    opacity:.25;
    animation:blobMove 12s infinite ease-in-out;
}

.payment-bg-1{
    background:#00d4ff;
    top:-150px;
    left:-120px;
}

.payment-bg-2{
    background:#7c5cff;
    bottom:-120px;
    right:-100px;
}

.payment-container{
    width:min(1200px,92%);
    margin:auto;
    position:relative;
    z-index:5;
}

.payment-card{
display:grid;
grid-template-columns:420px 1fr;
gap:40px;
padding:40px;
border-radius:30px;
backdrop-filter:blur(22px);
background:rgba(255,255,255,.08);
border:1px solid rgba(255,255,255,.15);
box-shadow:0 25px 70px rgba(0,0,0,.5);
}

.left-panel h1{
font-size:48px;
color:white;
margin-bottom:12px;
}

.subtitle{
color:#cbd5e1;
margin-bottom:30px;
}

.movie-card{
padding:28px;
border-radius:24px;
background:rgba(255,255,255,.06);
border:1px solid rgba(255,255,255,.12);
}

.movie-card h2{
font-size:32px;
margin-bottom:30px;
color:white;
}

.summary-row{
display:flex;
justify-content:space-between;
margin-bottom:18px;
color:#dbeafe;
font-size:17px;
}

.total{
margin-top:20px;
font-size:22px;
font-weight:700;
color:white;
}

.right-panel h2{
font-size:34px;
margin-bottom:30px;
color:white;
}

.payment-options{
display:flex;
flex-direction:column;
gap:20px;
}

.payment-option{
display:flex;
gap:18px;
align-items:center;
padding:22px;
border-radius:20px;
cursor:pointer;
background:rgba(255,255,255,.05);
border:1px solid rgba(255,255,255,.08);
transition:.35s;
}

.payment-option span{
font-size:34px;
}

.payment-option h3{
color:white;
margin-bottom:5px;
}

.payment-option p{
color:#cbd5e1;
font-size:15px;
}

.payment-option:hover{
transform:translateY(-4px);
background:rgba(255,255,255,.12);
box-shadow:0 18px 40px rgba(0,212,255,.18);
}

.payment-option.active{
background:linear-gradient(135deg,#00d4ff,#7c5cff);
border:none;
transform:scale(1.02);
box-shadow:0 20px 45px rgba(0,212,255,.35);
}

.pay-btn{
margin-top:35px;
width:100%;
padding:20px;
border:none;
border-radius:18px;
font-size:20px;
font-weight:700;
cursor:pointer;
background:linear-gradient(90deg,#00d4ff,#7c5cff);
color:white;
transition:.35s;
display:flex;
justify-content:center;
align-items:center;
gap:10px;
}

.pay-btn:hover{
transform:translateY(-4px);
box-shadow:0 20px 50px rgba(0,212,255,.45);
}

@keyframes blobMove{

0%,100%{
transform:translateY(0);
}

50%{
transform:translateY(35px);
}
}

@media(max-width:950px){

.payment-card{
grid-template-columns:1fr;
}

.left-panel h1{
font-size:38px;
}

}
.success-toast{
position:fixed;
top:30px;
right:30px;
background:linear-gradient(135deg,#10b981,#059669);
color:white;
padding:18px 26px;
border-radius:14px;
font-weight:700;
font-size:16px;
box-shadow:0 15px 40px rgba(16,185,129,.35);
animation:toastSlide .4s ease;
z-index:9999;
}

@keyframes toastSlide{

from{
opacity:0;
transform:translateX(80px);
}

to{
opacity:1;
transform:translateX(0);
}
}
.spinner{
width:20px;
height:20px;
border:3px solid rgba(255,255,255,.35);
border-top:3px solid white;
border-radius:50%;
display:inline-block;
margin-right:10px;
vertical-align:middle;
animation:spin .8s linear infinite;
}

@keyframes spin{
to{
transform:rotate(360deg);
}
}
</style>