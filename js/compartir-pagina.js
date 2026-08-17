/* ===================================
   COMPARTIR-PAGINA.JS
   Rellena el bloque genérico "Comparte esta página"
   (<div class="page-share"><div id="pageShareButtons">) allí donde exista.
   Autónomo: no depende de app.js, funciona en cualquier página que lo cargue.
   =================================== */

document.addEventListener('DOMContentLoaded', function () {
  const contenedor = document.getElementById('pageShareButtons');
  if (!contenedor) return;

  const url = window.location.href;
  const texto = document.title;
  const urlCodificada = encodeURIComponent(url);
  const textoCodificado = encodeURIComponent(texto);

  contenedor.innerHTML = `
    <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(texto + '\n\n' + url)}" target="_blank" rel="noopener noreferrer" class="page-share-btn whatsapp" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
    <a href="https://t.me/share/url?url=${urlCodificada}&text=${textoCodificado}" target="_blank" rel="noopener noreferrer" class="page-share-btn telegram" title="Telegram"><i class="fab fa-telegram-plane"></i></a>
    <a href="https://twitter.com/intent/tweet?url=${urlCodificada}&text=${textoCodificado}" target="_blank" rel="noopener noreferrer" class="page-share-btn twitter" title="Twitter"><i class="fab fa-twitter"></i></a>
  `;
});
