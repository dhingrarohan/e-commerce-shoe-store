const wrapper = document.querySelector(".sliderWrapper");
const menuItems = document.querySelectorAll(".menuItem");

const products = [
  {
    id: 1,
    title: "Air Force",
    price: 119,
    desc: "The Nike Air Force 1 is a timeless streetwear icon, blending legendary comfort with a clean, versatile design. Featuring classic Nike Air cushioning and a durable build, it’s the ultimate everyday essential.",
    colors: [
      { code: "black", img: "./img/air.png" },
      { code: "darkblue", img: "./img/air2.png" },
    ],
  },
  {
    id: 2,
    title: "Air Jordan",
    price: 149,
    desc: "Step into history with the Air Jordan. Built with premium materials and signature responsive cushioning, this sneaker delivers a bold look that dominates both the court and the streets.",
    colors: [
      { code: "lightgray", img: "./img/jordan.png" },
      { code: "green", img: "./img/jordan2.png" },
    ],
  },
  {
    id: 3,
    title: "Blazer",
    price: 109,
    desc: "Old-school style meets modern skateboarding culture. The Nike Blazer offers a retro look with a durable leather upper and a flexible rubber outsole, perfect for effortless daily wear.",
    colors: [
      { code: "lightgray", img: "./img/blazer.png" },
      { code: "green", img: "./img/blazer2.png" },
    ],
  },
  {
    id: 4,
    title: "Crater",
    price: 129,
    desc: "Designed with sustainability in mind, the Nike Crater combines eco-friendly recycled materials with a futuristic aesthetic. Experience lightweight comfort that makes a statement for the planet.",
    colors: [
      { code: "black", img: "./img/crater.png" },
      { code: "lightgray", img: "./img/crater2.png" },
    ],
  },
  {
    id: 5,
    title: "Hippie",
    price: 99,
    desc: "Part of an exploratory footwear collection, the Space Hippie is transformed from trash into a unique sneaker. Featuring a highly breathable knit upper, it's wild, raw, and incredibly comfortable.",
    colors: [
      { code: "gray", img: "./img/hippie.png" },
      { code: "black", img: "./img/hippie2.png" },
    ],
  },
];

let choosenProduct = products[0];

const currentProductImg = document.querySelector(".productImg");
const currentProductTitle = document.querySelector(".productTitle");
const currentProductPrice = document.querySelector(".productPrice");
const currentProductDesc = document.querySelector(".productDesc");
const currentProductColors = document.querySelectorAll(".color");
const currentProductSizes = document.querySelectorAll(".size");

function changeActiveSlide(index) {
  wrapper.style.transform = `translateX(${-100 * index}vw)`;
  choosenProduct = products[index];

  currentProductTitle.textContent = choosenProduct.title;
  currentProductPrice.textContent = "$" + choosenProduct.price;
  currentProductDesc.textContent = choosenProduct.desc;
  currentProductImg.src = choosenProduct.colors[0].img;

  currentProductColors.forEach((color, i) => {
    color.style.backgroundColor = choosenProduct.colors[i].code;
  });

  menuItems.forEach((item) => item.classList.remove("active"));
  menuItems[index].classList.add("active");

  selectedSize = null;
  currentProductSizes.forEach((sz) => {
    sz.style.backgroundColor = "white";
    sz.style.color = "black";
  });
}

menuItems.forEach((item, index) => {
  item.addEventListener("click", () => { changeActiveSlide(index); });
});

currentProductColors.forEach((color, index) => {
  color.addEventListener("click", () => { currentProductImg.src = choosenProduct.colors[index].img; });
});

currentProductSizes.forEach((size) => {
  size.addEventListener("click", () => {
    currentProductSizes.forEach((sz) => {
      sz.style.backgroundColor = "white";
      sz.style.color = "black";
    });
    size.style.backgroundColor = "black";
    size.style.color = "white";
    selectedSize = size.textContent;
  });
});


// --- SHOPPING CART SYSTEM ---

let cart = JSON.parse(localStorage.getItem("nike_store_cart")) || [];
let selectedSize = null;
let appliedDiscountPercent = 0; 
let appliedCodeString = "";

const paymentModal = document.querySelector(".payment");
const closeModalBtn = document.querySelector(".close");
const productButton = document.querySelector(".productButton");
const cartToggle = document.querySelector("#cartToggle");
const cartDropdown = document.querySelector("#cartDropdown");
const cartCountElement = document.querySelector(".cartCount");
const cartItemsWrapper = document.querySelector(".cartItemsWrapper");

// Cart UI DOM Elements
const cartOriginalTotalElement = document.querySelector(".cartOriginalTotal");
const cartTotalValueElement = document.querySelector(".cartTotalValue");
const cartCouponInput = document.querySelector(".cartCouponInput");
const cartCouponBtn = document.querySelector(".cartCouponBtn");
const cartCouponMessage = document.querySelector(".cartCouponMessage");

// Checkout Overlay DOM Elements
const checkoutCouponInput = document.querySelector(".checkoutCouponInput");
const removeCheckoutCouponBtn = document.querySelector(".removeCheckoutCouponBtn");
const checkoutOriginalTotal = document.querySelector(".checkoutOriginalTotal");
const checkoutFinalTotal = document.querySelector(".checkoutFinalTotal");

if (cartToggle) {
  cartToggle.addEventListener("click", () => {
    // Open/Close toggle execution path
    cartDropdown.classList.toggle("active");
    
    // Reset the promo code input whenever the user opens the cart drawer
    if (cartDropdown.classList.contains("active")) {
      if (cartCouponInput) cartCouponInput.value = "";
      if (cartCouponMessage) {
        cartCouponMessage.textContent = "";
        cartCouponMessage.style.color = "black";
      }
    }
  });
}

if (productButton) {
  productButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (!selectedSize) {
      alert("Please select a size first!");
      return;
    }

    const currentImgSrc = currentProductImg.src;
    const existingItemIndex = cart.findIndex(
      (item) => item.title === choosenProduct.title && item.size === selectedSize && item.img === currentImgSrc
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        title: choosenProduct.title,
        price: choosenProduct.price,
        size: selectedSize,
        img: currentImgSrc,
        quantity: 1
      });
    }

    updateCartDOM();
    productButton.textContent = "ADDED!";
    setTimeout(() => { productButton.textContent = "ADD TO CART"; }, 1000);
  });
}

function updateCartDOM() {
  if (!cartItemsWrapper) return;
  cartItemsWrapper.innerHTML = "";
  let totalItemsCount = 0;
  let baseCartPrice = 0;

  if (cart.length === 0) {
    cartItemsWrapper.innerHTML = `<p class="emptyCartMessage">Your cart is empty!</p>`;
    if (cartCountElement) cartCountElement.textContent = 0;
    if (cartTotalValueElement) cartTotalValueElement.textContent = "$0";
    if (cartOriginalTotalElement) cartOriginalTotalElement.textContent = "";
    
    document.querySelector(".checkoutButton").style.display = "none";
    document.querySelector(".cartCouponModule").style.display = "none";
    localStorage.removeItem("nike_store_cart");
    return;
  }

  document.querySelector(".checkoutButton").style.display = "block";
  document.querySelector(".cartCouponModule").style.display = "block";

  cart.forEach((item, index) => {
    totalItemsCount += item.quantity;
    baseCartPrice += item.price * item.quantity;

    const itemRow = document.createElement("div");
    itemRow.classList.add("cartItem");
    itemRow.innerHTML = `
      <img src="${item.img}" alt="" class="cartItemImg">
      <div class="cartItemDetails">
          <p class="cartItemTitle">${item.title}</p>
          <div class="cartItemMetaRow">
              <span class="cartItemMeta">Size: ${item.size} | </span>
              <button class="qtyCtrlBtn minusQtyBtn" data-index="${index}">-</button>
              <span class="cartItemQtyDisplay">${item.quantity}</span>
              <button class="qtyCtrlBtn plusQtyBtn" data-index="${index}">+</button>
          </div>
      </div>
      <span class="cartItemPrice">$${item.price * item.quantity}</span>
      <button class="removeCartItem" data-index="${index}">&times;</button>
    `;
    cartItemsWrapper.appendChild(itemRow);
  });

  if (cartCountElement) cartCountElement.textContent = totalItemsCount;
  
  if (appliedDiscountPercent > 0) {
    let finalDiscountedPrice = baseCartPrice - (baseCartPrice * (appliedDiscountPercent / 100));
    
    if (cartOriginalTotalElement) {
      cartOriginalTotalElement.textContent = "$" + baseCartPrice;
      cartOriginalTotalElement.classList.add("originalTotalStrikethrough");
    }
    if (cartTotalValueElement) {
      cartTotalValueElement.innerHTML = `$${Math.round(finalDiscountedPrice)} <span class="discountBadgeText">(${appliedDiscountPercent}% OFF)</span>`;
    }

    if (checkoutOriginalTotal) {
      checkoutOriginalTotal.textContent = "$" + baseCartPrice;
      checkoutOriginalTotal.classList.add("originalTotalStrikethrough");
    }
    if (checkoutFinalTotal) checkoutFinalTotal.textContent = "$" + Math.round(finalDiscountedPrice);
    if (checkoutCouponInput) checkoutCouponInput.value = appliedCodeString + " (Applied)";
    if (removeCheckoutCouponBtn) removeCheckoutCouponBtn.style.display = "block";

  } else {
    if (cartOriginalTotalElement) cartOriginalTotalElement.textContent = "";
    if (cartTotalValueElement) cartTotalValueElement.textContent = "$" + baseCartPrice;
    
    if (checkoutOriginalTotal) checkoutOriginalTotal.textContent = "";
    if (checkoutFinalTotal) checkoutFinalTotal.textContent = "$" + baseCartPrice;
    if (checkoutCouponInput) checkoutCouponInput.value = "No code applied";
    if (removeCheckoutCouponBtn) removeCheckoutCouponBtn.style.display = "none";
  }

  localStorage.setItem("nike_store_cart", JSON.stringify(cart));

  // 1. Hook up the Minus (-) quantity controls
  document.querySelectorAll(".minusQtyBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      if (cart[idx].quantity > 1) {
        cart[idx].quantity -= 1;
      } else {
        cart.splice(idx, 1); // Delete completely if descending below 1
      }
      updateCartDOM();
    });
  });

  // 2. Hook up the Plus (+) quantity controls
  document.querySelectorAll(".plusQtyBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      cart[idx].quantity += 1;
      updateCartDOM();
    });
  });

  // 3. Hook up absolute trash/close button row items
  document.querySelectorAll(".removeCartItem").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      cart.splice(idx, 1);
      updateCartDOM();
    });
  });
}

function removeFromCart(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }
  updateCartDOM();
}

// Coupon Logic Handler in Cart Drawer
if (cartCouponBtn) {
  cartCouponBtn.addEventListener("click", () => {
    const enteredCode = cartCouponInput.value.trim().toUpperCase();
    if (enteredCode === "NIKE20") {
      appliedDiscountPercent = 20;
      appliedCodeString = "NIKE20";
      cartCouponMessage.textContent = "20% Discount Applied!";
      cartCouponMessage.style.color = "#369e62";
      updateCartDOM();
    } else {
      cartCouponMessage.textContent = "Invalid Coupon Code";
      cartCouponMessage.style.color = "crimson";
    }
  });
}

// Remove Coupon Action Event Handler on Checkout Screen
if (removeCheckoutCouponBtn) {
  removeCheckoutCouponBtn.addEventListener("click", () => {
    // Reset global tracking variables back to zero bounds
    appliedDiscountPercent = 0;
    appliedCodeString = "";
    
    // Clear cart inputs and error message elements entirely
    if (cartCouponInput) cartCouponInput.value = "";
    if (cartCouponMessage) cartCouponMessage.textContent = "";
    
    // Recalculate dynamic tracking data back to base levels
    updateCartDOM();
  });
}

// Checkout Form Display Activation Engine
const checkoutButton = document.querySelector(".checkoutButton");
if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) return;
    if (cartDropdown) cartDropdown.classList.remove("active");
    if (paymentModal) paymentModal.style.display = "flex";

    const productSection = document.querySelector(".product");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // LOCK BACKGROUND SCROLLING
    document.body.style.overflow = "hidden";
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    if (paymentModal) paymentModal.style.display = "none";
    // UNLOCK BACKGROUND SCROLLING
    document.body.style.overflow = "";
  });
}

// --- FEATURE: CHECKOUT FORM SUBMISSION & VALIDATION ---
const payButton = document.querySelector(".payButton");
if (payButton) {
  payButton.addEventListener("click", () => {
    // HARD GUARD: Prevent checkout if the cart array is empty
    if (!cart || cart.length === 0) {
      alert("Your shopping cart is empty! Add items before checking out.");
      if (paymentModal) paymentModal.style.display = "none";
      document.body.style.overflow = "";
      return;
    }

    // Grab input fields directly via classes or specific order inside the modal
    const nameInput = document.querySelector(".payment input[placeholder='John Doe']");
    const phoneInput = document.querySelector(".payment input[placeholder='+1 234 5678']");
    const addressInput = document.querySelector(".payment input[placeholder='Elton St 21 22-145']");
    const cardInput = document.querySelector(".payment input[placeholder='Card Number']");
    const mmInput = document.querySelector(".payment input[placeholder='mm']");
    const yyyyInput = document.querySelector(".payment input[placeholder='yyyy']");
    const cvvInput = document.querySelector(".payment input[placeholder='cvv']");

    let allValid = true;

    // Helper function to validate fields safely
    function validateField(element, condition) {
      if (!element) return;
      if (!condition || element.value.trim() === "") {
        element.style.borderBottom = "2px solid crimson"; // Highlight red if invalid
        allValid = false;
      } else {
        element.style.borderBottom = "1px solid gray";   // Reset to normal
      }
    }

    // 1. Name validation: Letters and spaces only, minimum 3 characters
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    validateField(nameInput, nameInput && nameRegex.test(nameInput.value.trim()));

    // 2. Phone validation: Optional leading +, followed by 7 to 15 digits
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    validateField(phoneInput, phoneInput && phoneRegex.test(phoneInput.value.trim().replace(/\s/g, "")));

    // 3. Address validation: Must be at least 5 characters long
    validateField(addressInput, addressInput && addressInput.value.trim().length >= 5);

    // 4. Card Number validation: Exactly 16 digits
    const cardClean = cardInput ? cardInput.value.replace(/\s/g, "") : "";
    validateField(cardInput, /^[0-9]{16}$/.test(cardClean));

    // 5. Expiration Month validation: 01 through 12
    const mmVal = mmInput ? parseInt(mmInput.value.trim(), 10) : 0;
    validateField(mmInput, mmVal >= 1 && mmVal <= 12);

    // 6. Expiration Year validation: Must be current year (2026) or later
    const yyyyVal = yyyyInput ? parseInt(yyyyInput.value.trim(), 10) : 0;
    validateField(yyyyInput, yyyyVal >= 2026 && yyyyVal <= 2045);

    // 7. CVV validation: Exactly 3 or 4 digits
    const cvvClean = cvvInput ? cvvInput.value.trim() : "";
    validateField(cvvInput, /^[0-9]{3,4}$/.test(cvvClean));

    // Halt form submission if any of the rule checks above failed
    if (!allValid) {
      alert("Some fields are empty or invalid. Please check the highlighted red inputs!");
      return;
    }

    // Success Sequence
    alert("Thank you for your purchase! Your order has been successfully placed.");
    
    // Reset state variables completely
    cart = []; 
    appliedDiscountPercent = 0; 
    appliedCodeString = "";
    
    // Clear out input fields for the next session
    const allInputs = document.querySelectorAll(".payment .payInput");
    allInputs.forEach(input => {
      if (!input.disabled) input.value = "";
    });
    
    // Update the UI, close modal, and unlock scrolling
    updateCartDOM(); 
    if (paymentModal) paymentModal.style.display = "none"; 
    document.body.style.overflow = ""; 
  });
}

// --- DYNAMIC SEARCH FILTER SYSTEM ---
const searchInput = document.querySelector(".searchInput");
const searchIcon = document.querySelector(".searchIcon");

// Reusable function to execute the search
function performSearch() {
  if (!searchInput) return;
  const queryValue = searchInput.value.trim().toLowerCase();
  const matchIndex = products.findIndex((p) => p.title.toLowerCase().includes(queryValue));
  
  if (matchIndex > -1) {
    changeActiveSlide(matchIndex);
    document.querySelector(".slider").scrollIntoView({ behavior: "smooth" });
    searchInput.value = "";
  }
}

// 1. Trigger search when pressing Enter key
if (searchInput) {
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });
}

// 2. Trigger search when clicking the lens image icon
if (searchIcon) {
  searchIcon.addEventListener("click", () => {
    performSearch();
  });
}

// Automatically load and render the cart when a user opens or refreshes the page
document.addEventListener("DOMContentLoaded", () => {
    updateCartDOM();
});