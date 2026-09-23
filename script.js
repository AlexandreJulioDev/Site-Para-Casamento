// ============================================================
//  KALINE & PEDRO — SITE DE CASAMENTO
//  script.js — agora tudo numa página só (index.html)
//
//  A "Lista de Presentes" deixou de ser uma página separada.
//  Ela é uma <section> escondida (class="hidden") que aparece
//  via JavaScript quando a pessoa clica no botão — sem recarregar
//  a página, o que mantém a música tocando sem interrupção.
// ============================================================


// ============================================================
//  DEBUG MODE — Helper de console
//  Ative adicionando class="debug" no <body>.
// ============================================================
if (document.body.classList.contains('debug')) {
  console.info(
    '%c[DEBUG MODE ATIVO]%c Todas as áreas clicáveis estão com contorno vermelho.\n' +
    'Ajuste top/left/width/height em style.css e recarregue para calibrar.\n' +
    'Remova class="debug" do <body> antes de publicar.',
    'color: red; font-weight: bold;',
    'color: inherit;'
  );
}


// ============================================================
//  "COMO CHEGAR" → Google Maps (nova aba)
// ============================================================
const btnMapa = document.getElementById('btn-mapa');
if (btnMapa) {
  btnMapa.addEventListener('click', () => {
    const endereco = 'Rua Coelho Chaves, 200, Aldeia dos Camarás, Camaragibe - PE';
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
    window.open(url, '_blank');
  });
}


// ============================================================
//  "CONFIRME SUA PRESENÇA" → Google Forms
//  O link já está no <a href="..."> do HTML; nenhum JS necessário.
// ============================================================


// ============================================================
//  TROCA ENTRE VIEW DO CONVITE E VIEW DA LISTA DE PRESENTES
//  (sem navegação real — o <audio> nunca é recriado)
// ============================================================
const viewConvite = document.getElementById('view-convite');
const viewLista    = document.getElementById('view-lista');
const btnPresentes = document.getElementById('btn-presentes');
const btnVoltar    = document.getElementById('btn-voltar');

function mostrarLista() {
  if (!viewConvite || !viewLista) return;
  viewConvite.classList.add('hidden');
  viewLista.classList.remove('hidden');
  window.scrollTo(0, 0);
  history.replaceState(null, '', '#presentes');
}

function mostrarConvite() {
  if (!viewConvite || !viewLista) return;
  viewLista.classList.add('hidden');
  viewConvite.classList.remove('hidden');
  window.scrollTo(0, 0);
  history.replaceState(null, '', window.location.pathname);
}

if (btnPresentes) btnPresentes.addEventListener('click', mostrarLista);
if (btnVoltar)    btnVoltar.addEventListener('click', mostrarConvite);

// Suporte a link direto tipo "index.html#presentes"
// (usado pelo presentes.html, que agora só redireciona pra cá)
if (window.location.hash === '#presentes') {
  mostrarLista();
}
