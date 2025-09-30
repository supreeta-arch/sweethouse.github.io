// Sweethouse - WhatsApp connect widget
(function(){
  const PHONE = '919900770011'; // Business WhatsApp number
  const BRAND = 'Sweethouse';

  function fmtINR(n){
    try{ return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n) }catch{ return `₹${n}` }
  }
  function buildCartSummary(){
    try{
      const cart = JSON.parse(localStorage.getItem('sweethouse_cart')||'[]');
      if(!cart.length) return '';
      const lines = cart.map(i=>`• ${i.title} — ${i.qty} pack(s) (${i.qty*200}g) = ${fmtINR(i.price*i.qty)}`).join('%0A');
      const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
      const weight = cart.reduce((s,i)=>s+i.qty*200,0);
      return `%0A%0AOrder summary:%0A${lines}%0ATotal weight: ${weight}g%0ASubtotal: ${fmtINR(total)}`;
    }catch{ return ''}
  }
  function buildMessage(){
    const base = encodeURIComponent(`Hello ${BRAND} team, I need help with placing an order / bulk order / order status.`);
    return `${base}${buildCartSummary()}`;
  }
  function openWhatsApp(){
    const msg = buildMessage();
    window.open(`https://wa.me/${PHONE}?text=${msg}`, '_blank');
  }

  function createEl(tag, attrs={}, html=''){
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v])=> el.setAttribute(k,v));
    if(html) el.innerHTML = html;
    return el;
  }

  function mountWidget(){
    // Floating button (WhatsApp SVG)
    const waIcon = `
      <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <path d="M20 11.5a8.5 8.5 0 0 1-12.7 7.2L4 20l1.3-3.1A8.5 8.5 0 1 1 20 11.5z" stroke="currentColor" stroke-width="2"/>
        <path d="M8.8 9.2c0 2.9 3.1 5.7 5.2 5.7.5 0 1.3-.4 1.6-.9l.4-.7c.1-.2 0-.5-.2-.6l-1.5-.7c-.2-.1-.5 0-.6.2l-.3.5c-.1.2-.4.2-.5.1-1.2-.6-2.1-1.5-2.7-2.7-.1-.1 0-.4.1-.5l.5-.3c.2-.1.3-.4.2-.6l-.7-1.5c-.1-.2-.4-.3-.6-.2l-.7.4c-.5.3-.9 1.1-.9 1.6z" fill="currentColor"/>
      </svg>`;
    const btn = createEl('button', { class: 'wa-fab', ariaLabel: 'Chat on WhatsApp' }, waIcon);

    // Panel
    const panel = createEl('div', { class: 'wa-panel', role: 'dialog', 'aria-hidden':'true' }, `
      <div class="wa-panel-head">
        <div>
          <div class="wa-title">Namskara from ${BRAND} 🙏</div>
          <div class="wa-sub">We will help you place orders, bulk orders, and find order status.</div>
        </div>
        <button class="wa-close" aria-label="Close">✕</button>
      </div>
      <div class="wa-icons">
        <a href="https://instagram.com" target="_blank" aria-label="Instagram">
          <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
          </svg>
        </a>
        <a href="https://facebook.com" target="_blank" aria-label="Facebook">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5 22v-8h2.5l.5-3h-3V9.5c0-.9.3-1.5 1.6-1.5H17V5.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.3-3.8 3.9V11H8v3h3v8h2.5z"/>
          </svg>
        </a>
        <a href="https://wa.me/${PHONE}" target="_blank" aria-label="WhatsApp">
          <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11.5a8.5 8.5 0 0 1-12.7 7.2L4 20l1.3-3.1A8.5 8.5 0 1 1 20 11.5z" stroke="currentColor" stroke-width="2"/>
            <path d="M8.8 9.2c0 2.9 3.1 5.7 5.2 5.7.5 0 1.3-.4 1.6-.9l.4-.7c.1-.2 0-.5-.2-.6l-1.5-.7c-.2-.1-.5 0-.6.2l-.3.5c-.1.2-.4.2-.5.1-1.2-.6-2.1-1.5-2.7-2.7-.1-.1 0-.4.1-.5l.5-.3c.2-.1.3-.4.2-.6l-.7-1.5c-.1-.2-.4-.3-.6-.2l-.7.4c-.5.3-.9 1.1-.9 1.6z" fill="currentColor"/>
          </svg>
        </a>
      </div>
      <div class="wa-card">
        <div class="wa-card-title">Contact Us</div>
        <button class="btn btn-primary wa-chat-btn">WhatsApp Chat - Click here!</button>
      </div>
    `);

    btn.addEventListener('click', ()=>{
      panel.classList.toggle('open');
      panel.setAttribute('aria-hidden', panel.classList.contains('open') ? 'false':'true');
    });
    panel.querySelector('.wa-close').addEventListener('click', ()=>{
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden','true');
    });
    panel.querySelector('.wa-chat-btn').addEventListener('click', openWhatsApp);

    document.body.appendChild(panel);
    document.body.appendChild(btn);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', mountWidget);
  } else {
    mountWidget();
  }
})();
