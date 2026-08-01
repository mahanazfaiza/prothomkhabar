
/* =====================================================================
   BOOTSTRAP
   Wires the new modules into the existing app without altering any of
   the original functions. Three integration points:
     1. lazy initialisation of new tabs the first time they are opened
     2. remembering the last open tab across reloads
     3. restoring the saved language on load
   ===================================================================== */
(function(){

  /* --- 1. Lazy tab initialisation -----------------------------------
     Heavy tabs render only when first opened, keeping the initial paint
     as fast as the original single-tab app. setTab() is wrapped rather
     than modified so the original implementation stays authoritative. */
  const INITS = {
    planner:    function(){ Planner.init(); },
    recipes:    function(){ Recipes.init(); },
    guides:     function(){ Guides.init(); },
    firstaid:   function(){ FirstAid.init(); },
    milestones: function(){ Milestones.init(); },
    shopping:   function(){ Shopping.init(); },
    blwpro:     function(){ BLWPro.init(); },
    /* The Tracker tab is original markup, but its data-safety panel is new. */
    tracker:    function(){ Backup.init(); },
  };
  const started = {};

  const originalSetTab = setTab;
  setTab = function(tab){
    originalSetTab(tab);
    if(INITS[tab] && !started[tab]){ INITS[tab](); started[tab] = true; }
    Util.save('lastTab', tab);
    /* Keep the active tab visible when the bar scrolls horizontally. */
    const btn = document.querySelector('.tab-btn[data-tab="'+tab+'"]');
    try{ if(btn && btn.scrollIntoView) btn.scrollIntoView({ block:'nearest', inline:'nearest' }); }catch(e){}
    try{ window.scrollTo({ top:0, behavior:'smooth' }); }catch(e){}
  };

  /* --- 2. Language: run every module's re-render hook ---------------
     setLang() in the original code calls runLangHooks(); this is where
     that call lands. Only tabs that have been initialised are touched. */
  window.runLangHooks = function(){
    LANG_HOOKS.forEach(function(fn){
      try{ fn(); }catch(e){ /* a failing module must not break the toggle */ }
    });
    Util.save('lang', state.lang);
  };

  /* --- 3. Restore saved preferences --------------------------------- */
  function restore(){
    const savedLang = Util.load('lang', null);
    if(savedLang === 'en') setLang('en');

    const lastTab = Util.load('lastTab', null);
    if(lastTab && document.getElementById('tab-'+lastTab)) setTab(lastTab);
  }

  /* Close the modal with the overlay click / Escape handler already in
     the original code; we only need to drop the wide-modal class that the
     recipe view adds so the food-database modal keeps its own width. */
  const originalCloseModal = closeModal;
  closeModal = function(){
    originalCloseModal();
    const m = document.getElementById('modal');
    if(m) m.classList.remove('lg');
  };

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', restore);
  else restore();
})();
