// ============================================================
//  KALINE & PEDRO — SITE DE CASAMENTO
//  audio.js — logica de trilha sonora compartilhada
//
//  Inclua em todas as paginas via:
//    <script src="audio.js"></script>
//
//  TROCAR A MUSICA:
//    Substitua o arquivo  assets/musica-fundo.mp3  pelo seu .mp3.
//    IMPORTANTE: o arquivo precisa ser um MP3 valido e nao pode
//    estar vazio (0 KB) — isso e a causa mais comum da musica
//    "nao funcionar".
//
//  CONTINUIDADE ENTRE PAGINAS:
//    localStorage["musica-estado"] : "tocando" | "pausado"
//    localStorage["musica-tempo"]  : posicao em segundos
// ============================================================

(function () {
  'use strict';

  var KEY_ESTADO = 'musica-estado';
  var KEY_TEMPO  = 'musica-tempo';

  var audio = document.getElementById('musica-fundo');
  var botao = document.getElementById('btn-musica-topo');

  if (!audio || !botao) return;

  var estadoSalvo = localStorage.getItem(KEY_ESTADO);
  var tempoSalvo  = parseFloat(localStorage.getItem(KEY_TEMPO) || '0');
  if (isNaN(tempoSalvo)) tempoSalvo = 0;

  audio.volume = 0.45;

  // ── NOVO: detecta arquivo de musica ausente/vazio/corrompido ──────────────
  // Se assets/musica-fundo.mp3 nao existir, estiver vazio (0 KB) ou for
  // invalido, o navegador dispara o evento "error" no <audio>. Sem isso,
  // o problema falha silenciosamente e parece que o JS nao funciona.
  audio.addEventListener('error', function () {
    console.warn(
      '[audio.js] Nao foi possivel carregar assets/musica-fundo.mp3. ' +
      'Verifique se o arquivo existe na pasta assets, se o nome esta ' +
      'exatamente "musica-fundo.mp3" e se ele nao esta vazio (0 KB).'
    );
    // Esconde o botao de musica, ja que nao ha nada para tocar
    botao.style.display = 'none';
  });

  // ── Icone do botao ───────────────────────────────────────────────────────
  function atualizarIcone(tocando) {
    botao.textContent = tocando ? '\u23F8' : '\u266A';
    botao.setAttribute('aria-label', tocando ? 'Pausar musica' : 'Tocar musica');
    botao.setAttribute('title',      tocando ? 'Pausar musica' : 'Tocar musica');
  }

  // ── Salva estado no localStorage ─────────────────────────────────────────
  function salvarEstado(tocando) {
    localStorage.setItem(KEY_ESTADO, tocando ? 'tocando' : 'pausado');
    localStorage.setItem(KEY_TEMPO,  String(audio.currentTime));
  }

  // ── Tenta tocar — se o browser bloquear, configura listener de clique ─────
  function tentarTocar() {
    var p = audio.play();
    if (p !== undefined) {
      p.then(function () {
        // Autoplay permitido: musica tocando
        atualizarIcone(true);
        salvarEstado(true);
      }).catch(function () {
        // Autoplay bloqueado pelo browser: aguarda qualquer interacao
        atualizarIcone(false);
        configurarPrimeiroClique();
      });
    } else {
      atualizarIcone(true);
      salvarEstado(true);
    }
  }

  // ── Listener de primeiro clique (fallback de autoplay) ────────────────────
  function configurarPrimeiroClique() {
    var ativado = false;
    function aoInteragir(e) {
      if (e.target === botao || botao.contains(e.target)) return;
      if (ativado) return;
      ativado = true;
      document.removeEventListener('click',      aoInteragir);
      document.removeEventListener('touchstart', aoInteragir);
      audio.play().then(function () {
        atualizarIcone(true);
        salvarEstado(true);
      }).catch(function () {});
    }
    document.addEventListener('click',      aoInteragir);
    document.addEventListener('touchstart', aoInteragir, { passive: true });
  }

  // ── Botao: alterna play / pause ───────────────────────────────────────────
  botao.addEventListener('click', function (e) {
    e.stopPropagation();
    if (audio.paused) {
      audio.play().then(function () {
        atualizarIcone(true);
        salvarEstado(true);
      }).catch(function () {});
    } else {
      audio.pause();
      atualizarIcone(false);
      salvarEstado(false);
    }
  });

  // ── Salva tempo continuamente enquanto toca ───────────────────────────────
  audio.addEventListener('timeupdate', function () {
    localStorage.setItem(KEY_TEMPO, String(audio.currentTime));
  });

  // ── Salva ao sair / navegar ───────────────────────────────────────────────
  window.addEventListener('beforeunload', function () {
    salvarEstado(!audio.paused);
  });

  // ── Restaura posicao e decide acao ao carregar ────────────────────────────
  function iniciar() {
    // Restaura o ponto de onde parou
    if (tempoSalvo > 0) {
      try { audio.currentTime = tempoSalvo; } catch (e) {}
    }

    if (estadoSalvo === 'pausado') {
      // Usuario pausou manualmente: respeita a escolha
      atualizarIcone(false);

    } else {
      // "tocando", ou primeira visita (null) — tenta tocar automaticamente
      atualizarIcone(true); // mostra pause otimisticamente
      tentarTocar();
    }
  }

  // Aguarda o audio ter metadados antes de ajustar currentTime
  if (audio.readyState >= 1) {
    iniciar();
  } else {
    audio.addEventListener('loadedmetadata', iniciar, { once: true });
    // Tambem tenta sem metadados (arquivo pode ser curto ou ja em cache)
    audio.addEventListener('canplay', function handler() {
      audio.removeEventListener('canplay', handler);
      iniciar();
    });
    // Se nenhum evento disparar (arquivo ausente/invalido), tenta mesmo assim
    setTimeout(iniciar, 800);
  }

}());
