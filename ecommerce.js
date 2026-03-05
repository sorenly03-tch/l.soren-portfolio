// E-commerce demo JS (uses your existing toast style + theme variable system)

const PRODUCTS = [
  { id: "p1",  name: "Ultrabook Laptop", cat: "electronics", price: 899, rating: 4.7, reviews: 128, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=60", desc: "Lightweight laptop for work, study, and coding." },
  { id: "p2",  name: "Smartphone Pro",   cat: "electronics", price: 499, rating: 4.5, reviews: 210, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=60", desc: "Fast performance with a clean modern design." },
  { id: "p3",  name: "Wireless Headset", cat: "electronics", price: 79,  rating: 4.3, reviews: 88,  img: "https://images.unsplash.com/photo-1518441902117-f0a2b6e83f8a?auto=format&fit=crop&w=1200&q=60", desc: "Clear sound and comfortable fit for long sessions." },

  { id: "p4",  name: "Street Sneakers",  cat: "fashion",     price: 120, rating: 4.6, reviews: 164, img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=60", desc: "Everyday sneakers with clean style and comfort." },
  { id: "p5",  name: "Minimal Hoodie",   cat: "fashion",     price: 45,  rating: 4.2, reviews: 57,  img: "https://images.unsplash.com/photo-1520975683442-83e5a04d2d1f?auto=format&fit=crop&w=1200&q=60", desc: "Soft hoodie for daily wear. Simple and modern." },
  { id: "p6",  name: "Canvas Backpack",  cat: "fashion",     price: 39,  rating: 4.4, reviews: 93,  img: "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=1200&q=60", desc: "Durable backpack for school, travel, and work." },

  { id: "p7",  name: "Classic Watch",    cat: "accessories", price: 150, rating: 4.5, reviews: 72,  img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=60", desc: "Classic style watch with premium look." },
  { id: "p8",  name: "Sunglasses",       cat: "accessories", price: 25,  rating: 4.1, reviews: 39,  img: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=60", desc: "UV protection with a clean everyday vibe." },
  { id: "p9",  name: "Leather Wallet",   cat: "accessories", price: 29,  rating: 4.3, reviews: 44,  img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=60", desc: "Simple wallet, slim design, practical storage." },

  { id: "p10", name: "Desk Lamp",        cat: "home",        price: 18,  rating: 4.2, reviews: 34,  img: "https://images.unsplash.com/photo-1517999349371-c43520457b23?auto=format&fit=crop&w=1200&q=60", desc: "Warm light for your desk setup and studying." },
  { id: "p11", name: "Coffee Mug",       cat: "home",        price: 9,   rating: 4.0, reviews: 21,  img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=60", desc: "Minimal mug for coffee lovers and cozy vibes." },
  { id: "p12", name: "Smart Speaker",    cat: "home",        price: 59,  rating: 4.4, reviews: 80,  img: "https://images.unsplash.com/photo-1512446733611-9099a758e7b4?auto=format&fit=crop&w=1200&q=60", desc: "Hands-free music and smart home control (demo)." },
];

// helpers
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const toast = $("#toast");
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>toast.classList.remove("show"), 1800);
}
function formatMoney(n){ return `$${n.toFixed(2)}`; }
function saveJSON(key,val){ localStorage.setItem(key, JSON.stringify(val)); }
function loadJSON(key,fallback){
  try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch{ return fallback; }
}

function starsHTML(rating){
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let html = "";
  for(let i=1;i<=5;i++){
    const on = i<=full || (i===full+1 && half);
    html += `<span class="${on ? "on" : ""}">★</span>`;
  }
  return html;
}

// state
let state = {
  cat: "all",
  q: "",
  sort: "featured",
  cart: loadJSON("demo_cart", {}),     // {id: qty}
  wish: loadJSON("demo_wish", {}),     // {id: true}
  lastViewedCat: loadJSON("demo_lastCat", "all"),
};

// theme (connects to your existing theme saved in localStorage)
const root = document.documentElement;
const themeToggleBtn = $("#themeToggleBtn");
function getSavedTheme(){ return localStorage.getItem("theme") || "dark"; }
function applyTheme(theme){
  if(theme === "light"){
    root.setAttribute("data-theme","light");
    themeToggleBtn.textContent = "☀";
  }else{
    root.removeAttribute("data-theme");
    themeToggleBtn.textContent = "☾";
  }
  localStorage.setItem("theme", theme);
}
applyTheme(getSavedTheme());
themeToggleBtn.addEventListener("click", ()=> applyTheme(getSavedTheme()==="dark" ? "light" : "dark"));

// (optional) connect to your palette picker if you saved --accent in localStorage
const savedAccent = localStorage.getItem("accentColor");
if(savedAccent){
  document.documentElement.style.setProperty("--accent", savedAccent);
}

// DOM
const productGrid = $("#productGrid");
const searchInput = $("#searchInput");
const sortSelect = $("#sortSelect");
const cats = $("#cats");

const cartItems = $("#cartItems");
const cartItemsMobile = $("#cartItemsMobile");
const cartCountBadge = $("#cartCountBadge");
const cartCountBadge2 = $("#cartCountBadge2");
const wishCountBadge = $("#wishCountBadge");

const wishlistModal = $("#wishlistModal");
const wishlistList = $("#wishlistList");
const checkoutModal = $("#checkoutModal");

const aiList = $("#aiList");
const aiListMobile = $("#aiListMobile");
const aiExplain = $("#aiExplain");
const aiExplainMobile = $("#aiExplainMobile");

// cart helpers
function cartCount(){ return Object.values(state.cart).reduce((a,b)=>a+b,0); }
function cartSubtotal(){
  let sum = 0;
  for(const [id,qty] of Object.entries(state.cart)){
    const p = PRODUCTS.find(x=>x.id===id);
    if(p) sum += p.price * qty;
  }
  return sum;
}

function addToCart(id){
  state.cart[id] = (state.cart[id] || 0) + 1;
  saveJSON("demo_cart", state.cart);
  showToast("Added to cart 🛒");
  renderCart(); renderCounts(); renderAI();
}

function setQty(id, qty){
  if(qty <= 0) delete state.cart[id];
  else state.cart[id] = qty;

  saveJSON("demo_cart", state.cart);
  renderCart(); renderCounts(); renderAI();
}

function removeFromCart(id){
  delete state.cart[id];
  saveJSON("demo_cart", state.cart);
  renderCart(); renderCounts(); renderAI();
}

function clearCart(){
  state.cart = {};
  saveJSON("demo_cart", state.cart);
  renderCart(); renderCounts(); renderAI();
}

$("#clearCartBtn").addEventListener("click", clearCart);

// wishlist helpers
function toggleWish(id){
  if(state.wish[id]) delete state.wish[id];
  else state.wish[id] = true;
  saveJSON("demo_wish", state.wish);
  showToast(state.wish[id] ? "Added to wishlist ❤️" : "Removed from wishlist");
}

// filter + sort
function getFilteredProducts(){
  let list = [...PRODUCTS];

  if(state.cat !== "all") list = list.filter(p=>p.cat===state.cat);

  if(state.q.trim()){
    const q = state.q.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.cat.toLowerCase().includes(q)
    );
  }

  if(state.sort === "priceAsc") list.sort((a,b)=>a.price-b.price);
  else if(state.sort === "priceDesc") list.sort((a,b)=>b.price-a.price);
  else if(state.sort === "ratingDesc") list.sort((a,b)=>b.rating-a.rating);
  else list.sort((a,b)=>(b.rating*100 + b.reviews) - (a.rating*100 + a.reviews)); // featured

  return list;
}

function renderProducts(){
  const list = getFilteredProducts();
  productGrid.innerHTML = list.map(p=>{
    const wished = !!state.wish[p.id];
    return `
      <article class="p-card" data-id="${p.id}">
        <div class="p-img">
          <img src="${p.img}" alt="${p.name}">
          <span class="p-chip">${p.cat}</span>
          <button class="wish-btn ${wished ? "active" : ""}" data-wish="${p.id}" type="button" aria-label="Wishlist">
            ${wished ? "♥" : "♡"}
          </button>
        </div>

        <div class="p-body">
          <div class="p-title">
            <div class="name">${p.name}</div>
            <div class="price">$${p.price}</div>
          </div>

          <div class="p-desc">${p.desc}</div>

          <div class="rating">
            <div class="stars" aria-label="rating">${starsHTML(p.rating)}</div>
            <small>${p.rating.toFixed(1)} • ${p.reviews} reviews</small>
          </div>

          <div class="p-actions">
            <button class="btn primary small" data-add="${p.id}" type="button">Add to Cart</button>
            <button class="btn small" data-view="${p.id}" type="button">View</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  productGrid.querySelectorAll("[data-add]").forEach(btn=>{
    btn.addEventListener("click", ()=> addToCart(btn.dataset.add));
  });
  productGrid.querySelectorAll("[data-wish]").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      e.stopPropagation();
      toggleWish(btn.dataset.wish);
      renderProducts();
      renderWishlist();
      renderCounts();
      renderAI();
    });
  });
  productGrid.querySelectorAll("[data-view]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const p = PRODUCTS.find(x=>x.id===btn.dataset.view);
      state.lastViewedCat = p?.cat || "all";
      saveJSON("demo_lastCat", state.lastViewedCat);
      showToast(`Viewing: ${p?.name}`);
      renderAI();
    });
  });
}

// categories click
cats.addEventListener("click", (e)=>{
  const btn = e.target.closest(".cat-btn");
  if(!btn) return;
  $$(".cat-btn").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  state.cat = btn.dataset.cat;
  state.lastViewedCat = state.cat;
  saveJSON("demo_lastCat", state.lastViewedCat);
  renderProducts();
  renderAI();
});

// search
searchInput.addEventListener("input", ()=>{
  state.q = searchInput.value;
  renderProducts();
});
searchInput.addEventListener("keydown", (e)=>{
  if(e.key === "Enter") showToast("Search applied ✅");
});

// sort
sortSelect.addEventListener("change", (e)=>{
  state.sort = e.target.value;
  renderProducts();
});

// render cart
function renderCart(){
  const entries = Object.entries(state.cart);

  const html = entries.length ? entries.map(([id,qty])=>{
    const p = PRODUCTS.find(x=>x.id===id);
    if(!p) return "";
    return `
      <div class="cart-item">
        <img src="${p.img}" alt="${p.name}">
        <div>
          <div class="ci-top">
            <div>
              <div class="ci-name">${p.name}</div>
              <div class="ci-sub">${p.cat}</div>
            </div>
            <div class="ci-price">$${(p.price * qty).toFixed(0)}</div>
          </div>

          <div class="qty">
            <button type="button" data-dec="${id}">−</button>
            <span>${qty}</span>
            <button type="button" data-inc="${id}">+</button>

            <button class="ci-remove" type="button" data-rm="${id}">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join("") : `<div class="muted small">Your cart is empty. Add something 😊</div>`;

  cartItems.innerHTML = html;
  cartItemsMobile.innerHTML = html;

  [cartItems, cartItemsMobile].forEach(container=>{
    container.querySelectorAll("[data-inc]").forEach(b=>{
      b.addEventListener("click", ()=> setQty(b.dataset.inc, (state.cart[b.dataset.inc]||0)+1));
    });
    container.querySelectorAll("[data-dec]").forEach(b=>{
      b.addEventListener("click", ()=> setQty(b.dataset.dec, (state.cart[b.dataset.dec]||0)-1));
    });
    container.querySelectorAll("[data-rm]").forEach(b=>{
      b.addEventListener("click", ()=> removeFromCart(b.dataset.rm));
    });
  });

  const sub = cartSubtotal();
  const delivery = entries.length ? 1.50 : 0;
  const total = sub + delivery;

  $("#subtotalTxt").textContent = formatMoney(sub);
  $("#deliveryTxt").textContent = formatMoney(delivery);
  $("#totalTxt").textContent = formatMoney(total);

  $("#subtotalTxtMobile").textContent = formatMoney(sub);
  $("#deliveryTxtMobile").textContent = formatMoney(delivery);
  $("#totalTxtMobile").textContent = formatMoney(total);

  $("#checkoutSubtotal").textContent = formatMoney(sub);
  $("#checkoutTotal").textContent = formatMoney(total);
}

function renderCounts(){
  const cc = cartCount();
  const wc = Object.keys(state.wish).length;

  cartCountBadge.textContent = cc;
  cartCountBadge2.textContent = cc;
  wishCountBadge.textContent = wc;
}

// wishlist modal
function openModal(el){
  el.classList.add("show");
  el.setAttribute("aria-hidden","false");
  document.body.classList.add("no-scroll");
}
function closeModal(el){
  el.classList.remove("show");
  el.setAttribute("aria-hidden","true");
  document.body.classList.remove("no-scroll");
}

function renderWishlist(){
  const ids = Object.keys(state.wish);
  if(!ids.length){
    wishlistList.innerHTML = `<div class="muted small">No wishlist items yet. Tap ♡ on a product.</div>`;
    return;
  }
  wishlistList.innerHTML = ids.map(id=>{
    const p = PRODUCTS.find(x=>x.id===id);
    if(!p) return "";
    return `
      <div class="ai-item">
        <div class="left">
          <img src="${p.img}" alt="${p.name}">
          <div>
            <div class="name">${p.name}</div>
            <div class="muted small">${p.cat} • $${p.price}</div>
          </div>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn primary small" type="button" data-wadd="${id}">Add</button>
          <button class="btn small subtle" type="button" data-wrm="${id}">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  wishlistList.querySelectorAll("[data-wadd]").forEach(b=>{
    b.addEventListener("click", ()=> addToCart(b.dataset.wadd));
  });
  wishlistList.querySelectorAll("[data-wrm]").forEach(b=>{
    b.addEventListener("click", ()=>{
      toggleWish(b.dataset.wrm);
      renderProducts();
      renderWishlist();
      renderCounts();
      renderAI();
    });
  });
}

$("#wishlistBtn").addEventListener("click", ()=>{
  renderWishlist();
  openModal(wishlistModal);
});
$("#wishlistCloseBtn").addEventListener("click", ()=> closeModal(wishlistModal));
$("#wishlistGoShopBtn").addEventListener("click", ()=> closeModal(wishlistModal));
$("#wishlistClearBtn").addEventListener("click", ()=>{
  state.wish = {};
  saveJSON("demo_wish", state.wish);
  renderProducts(); renderWishlist(); renderCounts(); renderAI();
});
wishlistModal.addEventListener("click", (e)=>{ if(e.target===wishlistModal) closeModal(wishlistModal); });

// checkout
function openCheckout(){
  if(cartCount() === 0){
    showToast("Cart is empty. Add items first 🙂");
    return;
  }
  renderCart();
  openModal(checkoutModal);
}

$("#checkoutBtn").addEventListener("click", openCheckout);
$("#checkoutBtnTop").addEventListener("click", openCheckout);
$("#checkoutBtnMobile").addEventListener("click", openCheckout);

$("#checkoutCloseBtn").addEventListener("click", ()=> closeModal(checkoutModal));
$("#checkoutCancelBtn").addEventListener("click", ()=> closeModal(checkoutModal));
checkoutModal.addEventListener("click", (e)=>{ if(e.target===checkoutModal) closeModal(checkoutModal); });

$("#placeOrderBtn").addEventListener("click", ()=>{
  const name = $("#cName").value.trim();
  const phone = $("#cPhone").value.trim();
  const address = $("#cAddress").value.trim();
  if(!name || !phone || !address){
    showToast("Please fill name, phone, address.");
    return;
  }
  showToast("Order placed (demo) ✅");
  closeModal(checkoutModal);
  clearCart();
  $("#cName").value = "";
  $("#cPhone").value = "";
  $("#cAddress").value = "";
  $("#cNote").value = "";
});

// cart button top
$("#cartBtnTop").addEventListener("click", ()=>{
  showToast("Cart is on right (desktop) / drawer (mobile)");
  if(window.matchMedia("(max-width: 980px)").matches) openCartDrawer();
});

// mobile cart drawer
const cartDrawer = $("#cartDrawer");
const cartBackdrop = $("#cartBackdrop");

function openCartDrawer(){
  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("show");
  cartDrawer.setAttribute("aria-hidden","false");
  cartBackdrop.setAttribute("aria-hidden","false");
  document.body.classList.add("no-scroll");
}
function closeCartDrawer(){
  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("show");
  cartDrawer.setAttribute("aria-hidden","true");
  cartBackdrop.setAttribute("aria-hidden","true");
  document.body.classList.remove("no-scroll");
}

$("#openCartDrawerBtn").addEventListener("click", openCartDrawer);
$("#closeCartDrawerBtn").addEventListener("click", closeCartDrawer);
cartBackdrop.addEventListener("click", closeCartDrawer);

// AI recommendations demo
function recommend(){
  const cartCats = new Set(Object.keys(state.cart).map(id => PRODUCTS.find(p=>p.id===id)?.cat).filter(Boolean));
  const wishCats = new Set(Object.keys(state.wish).map(id => PRODUCTS.find(p=>p.id===id)?.cat).filter(Boolean));
  const inCart = new Set(Object.keys(state.cart));

  return PRODUCTS
    .filter(p => !inCart.has(p.id))
    .map(p=>{
      let s = 0;
      if(p.cat === state.lastViewedCat) s += 5;
      if(cartCats.has(p.cat)) s += 6;
      if(wishCats.has(p.cat)) s += 4;
      s += Math.round(p.rating * 2);
      return { p, s };
    })
    .sort((a,b)=>b.s-a.s)
    .slice(0, 3)
    .map(x=>x.p);
}

function renderAI(){
  const recs = recommend();
  const cartHas = cartCount() > 0;
  const wishHas = Object.keys(state.wish).length > 0;

  let explain = "Add items to cart or wishlist, and I’ll suggest related products.";
  if(cartHas || wishHas){
    const basis = [];
    if(cartHas) basis.push("your cart");
    if(wishHas) basis.push("your wishlist");
    if(state.lastViewedCat && state.lastViewedCat !== "all") basis.push(`your interest in ${state.lastViewedCat}`);
    explain = `Based on ${basis.join(", ")}, you may also like:`;
  }
  aiExplain.textContent = explain;
  aiExplainMobile.textContent = explain;

  const html = recs.length ? recs.map(p=>`
    <div class="ai-item">
      <div class="left">
        <img src="${p.img}" alt="${p.name}">
        <div>
          <div class="name">${p.name}</div>
          <div class="muted small">${p.cat} • $${p.price} • ⭐ ${p.rating.toFixed(1)}</div>
        </div>
      </div>
      <button class="btn primary small" type="button" data-recadd="${p.id}">Add</button>
    </div>
  `).join("") : `<div class="muted small">No recommendations yet.</div>`;

  aiList.innerHTML = html;
  aiListMobile.innerHTML = html;

  [aiList, aiListMobile].forEach(container=>{
    container.querySelectorAll("[data-recadd]").forEach(b=>{
      b.addEventListener("click", ()=> addToCart(b.dataset.recadd));
    });
  });
}

// ESC close
document.addEventListener("keydown", (e)=>{
  if(e.key !== "Escape") return;
  if(wishlistModal.classList.contains("show")) closeModal(wishlistModal);
  if(checkoutModal.classList.contains("show")) closeModal(checkoutModal);
  if(cartDrawer.classList.contains("open")) closeCartDrawer();
});

// init
renderProducts();
renderCart();
renderCounts();
renderAI();

// keep updated
window.addEventListener("resize", ()=>{
  renderCart();
  renderAI();
});