// ==========================================
// GOOGLE APPS SCRIPT URL (replace with yours)
// ==========================================
const scriptURL = "https://script.google.com/macros/s/AKfycbzkqJZOmYUB45sBY_c6y9T_Rx-pHPH1hJJjp_B4QVIWsF-xOsPQfPICM9EcQD6D7iVZ/exec";

// ==========================================
// NAVIGATION: SHOW ORDER PAGE / MAIN PAGE
// ==========================================
const mainPage = document.getElementById('mainPage');
const orderPage = document.getElementById('orderPage');
const orderNavBtn = document.getElementById('orderNavBtn');
const navBtns = document.querySelectorAll('.nav-btn[data-section]');
const allNavBtns = document.querySelectorAll('.nav-btn');

function showOrderPage() {
    mainPage.classList.add('hidden');
    orderPage.classList.add('visible');
    allNavBtns.forEach(b => b.classList.remove('active'));
    orderNavBtn.classList.add('active');
    document.getElementById('navLinks').classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
    mainPage.classList.remove('hidden');
    orderPage.classList.remove('visible');
    updateActiveNav();
    document.getElementById('navLinks').classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

orderNavBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showOrderPage();
});

// ==========================================
// SCROLL TO SECTION (main page)
// ==========================================
function scrollToSection(sectionId) {
    if (orderPage.classList.contains('visible')) {
        goHome();
        setTimeout(() => {
            const target = document.getElementById(`section-${sectionId}`);
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight || 80;
                const offset = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        }, 200);
        return;
    }
    const target = document.getElementById(`section-${sectionId}`);
    if (target) {
        const navHeight = document.querySelector('.navbar').offsetHeight || 80;
        const offset = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    }
}

// ==========================================
// NAV ACTIVE STATE (scroll spy)
// ==========================================
const sections = document.querySelectorAll('.section');
const sectionNavBtns = document.querySelectorAll('.nav-btn[data-section]');

function updateActiveNav() {
    if (orderPage.classList.contains('visible')) {
        allNavBtns.forEach(b => b.classList.remove('active'));
        orderNavBtn.classList.add('active');
        return;
    }

    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.id.replace('section-', '');
        }
    });

    allNavBtns.forEach(b => b.classList.remove('active'));
    sectionNavBtns.forEach(btn => {
        if (btn.dataset.section === current) {
            btn.classList.add('active');
        }
    });
    orderNavBtn.classList.remove('active');
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

sectionNavBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.dataset.section;
        if (section) {
            scrollToSection(section);
        }
    });
});

// ==========================================
// HAMBURGER MENU
// ==========================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    navLinks.classList.toggle('open');
});

document.addEventListener('click', function(e) {
    if (!e.target.closest('.navbar')) {
        navLinks.classList.remove('open');
    }
});

// ==========================================
// ORDER FORM
// ==========================================
const form = document.getElementById('orderForm');
const messageEl = document.getElementById('orderMessage');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
        name: document.getElementById('name').value,
        contact: document.getElementById('contact').value,
        product: document.getElementById('product').value,
        quantity: document.getElementById('quantity').value,
        delivery: document.getElementById('delivery').value,
        payment: document.getElementById('payment').value,
        instructions: document.getElementById('instructions').value
    };

    // ---------- UNCOMMENT FOR GOOGLE APPS SCRIPT ----------
    /*
    fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(result => {
        messageEl.style.color = "#27ae60";
        messageEl.textContent = "✅ Order submitted successfully!";
        form.reset();
    })
    .catch(error => {
        messageEl.style.color = "#e74c3c";
        messageEl.textContent = "❌ Failed to submit order.";
        console.error(error);
    });
    */

    // ---------- SIMULATED ----------
    messageEl.style.color = "#27ae60";
    messageEl.textContent = "✅ Order submitted successfully! (simulated)";
    form.reset();
});

// ==========================================
// FLOATING CHAT WIDGET
// ==========================================
const chatWidget = document.getElementById('chatWidget');
const chatWindow = document.getElementById('chatWindow');
const chatBubble = document.getElementById('chatBubble');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const chatTyping = document.getElementById('chatTyping');
const quickReplies = document.getElementById('quickReplies');

let isChatOpen = false;
let chatTimeout = null;

function toggleChat() {
    isChatOpen = !isChatOpen;
    chatWindow.classList.toggle('open', isChatOpen);
    if (isChatOpen) {
        chatInput.focus();
        document.querySelector('.chat-bubble .badge').style.display = 'none';
    }
}

chatBubble.addEventListener('click', toggleChat);
chatClose.addEventListener('click', toggleChat);

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';

    chatTyping.style.display = 'block';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    clearTimeout(chatTimeout);
    chatTimeout = setTimeout(() => {
        chatTyping.style.display = 'none';
        const reply = getBotReply(text);
        addMessage(reply, 'bot');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600 + Math.random() * 600);
}

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

quickReplies.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
        const q = e.target.dataset.q;
        if (q) {
            chatInput.value = q;
            sendMessage();
        }
    }
});

chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});

chatSend.addEventListener('click', sendMessage);

// ==========================================
// CHAT BOT LOGIC (updated with 5 flavors)
// ==========================================
function getBotReply(input) {
    const text = input.toLowerCase();

    if (text.match(/price|cost|how much|magkano|presyo|₱|pesos/)) {
        return "Our Mango Lassi Classic starts at ₱79 for 16oz! 🍹 Other flavors: Matcha (₱79), Watermelon (₱89), Dark Chocolate (₱89), and Mango Cheesecake (₱99). All are 16oz and 100% natural!";
    }

    if (text.match(/healthy|health|nutritious|masustansya|benefit|good for you|organic/)) {
        return "Yes! 🌿 All TropiGo blends are packed with vitamins, minerals, and antioxidants. They're naturally sweetened with fruit sugars and honey — no artificial additives. Each 16oz serving has about 180 calories and 45% of your daily Vitamin C!";
    }

    if (text.match(/signature|best|favorite|classic|recommend/)) {
        return "Our signature is the Mango Lassi Classic — a smooth, creamy blend made with ripe mangoes, yogurt, and a touch of honey. It's our bestseller! 🥭 Would you like to order one?";
    }

    if (text.match(/delivery|deliver|shipping|pickup|pick up|deliver|ship/)) {
        return "Yes, we offer delivery through our partner couriers! 🚚 You can also pick up your order at our store. We're open daily from 7:00 AM to 8:00 PM.";
    }

    if (text.match(/menu|flavors|flavours|options|choices|variety/)) {
        return "We have 5 delicious lassi blends! 🍹\n1. Mango Lassi Classic — ₱79\n2. Matcha Mango — ₱79\n3. Watermelon Mango — ₱89\n4. Dark Chocolate Mango — ₱89\n5. Mango Cheesecake — ₱99\nAll are 16oz and made with 100% natural ingredients!";
    }

    if (text.match(/vegan|plant-based|dairy-free|milk/)) {
        return "Yes! 🌱 All our fruit blends are plant-based and vegan-friendly. We use coconut or almond milk alternatives upon request — just let us know when you order!";
    }

    if (text.match(/hours|open|time|schedule|store|branch|location/)) {
        return "We're open daily from 7:00 AM to 8:00 PM. 🕐 You can also order online anytime through our website!";
    }

    if (text.match(/nutrients|nutrition|calories|vitamin|mineral|fiber|potassium/)) {
        return "Each 16oz Mango Lassi Classic has: 🔹 180 calories 🔹 6g dietary fiber 🔹 45% Vitamin C 🔹 350mg potassium. All from natural fruit sugars — no refined sugar added!";
    }

    return "Thanks for asking! 🙌 I'm here to help. You can ask me about our menu, prices, ingredients, delivery, or anything else about TropiGo. Or check out our Menu and FAQs sections above!";
}

// ==========================================
// CHAT NAV BUTTON - toggle chat
// ==========================================
document.getElementById('chatNavBtn').addEventListener('click', function(e) {
    e.preventDefault();
    if (!isChatOpen) {
        toggleChat();
    } else {
        chatInput.focus();
    }
    navLinks.classList.remove('open');
});

// ==========================================
// KEYBOARD SHORTCUT: ESC to close chat
// ==========================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isChatOpen) {
        toggleChat();
    }
});

// ==========================================
// LOGO click → go home
// ==========================================
document.querySelector('.logo-area').addEventListener('click', goHome);

console.log('🍹 TropiGo loaded! Chatbot is ready. Ask me anything!');
