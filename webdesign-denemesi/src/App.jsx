import React, { useEffect, useRef, useState } from 'react';
import { issues } from './data/issues.js';

function getIssueFromPath() {
  const match = window.location.pathname.match(/^\/dergi\/([^/]+)\/?$/i);
  if (!match) return null;
  try {
    const issueId = decodeURIComponent(match[1]);
    return issues.some((issue) => issue.id === issueId) ? issueId : null;
  } catch {
    return issues.some((issue) => issue.id === match[1]) ? match[1] : null;
  }
}

function BrandMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 40" className="brand-mark" fill="none">
      <path d="M4 11h24v26H4z" fill="currentColor" />
      <path d="M8 15h7v8H8zm9 0h7v8h-7zM8 26h7v8H8zm9 0h7v8h-7z" fill="#081722" />
      <path d="M11 3h10v7H11z" fill="#f4eedb" />
      <path d="M15 3h2v7h-2z" fill="#193c55" />
      <path d="M2 11h28M6 8h20" stroke="#c99d61" strokeWidth="1.5" />
    </svg>
  );
}

function IssueCard({ issue, order, onChoose, disabled }) {
  return (
    <button
      className="issue-card"
      type="button"
      data-issue-id={issue.id}
      style={{ '--order': order }}
      onClick={() => onChoose(issue)}
      disabled={disabled}
      aria-label={`${issue.title} sayısını aç`}
    >
      <span className="cover-frame">
        <img
          className="cover-image"
          src={issue.cover}
          alt={`${issue.title} kapak görseli`}
          loading="lazy"
          decoding="async"
          onError={(event) => event.currentTarget.classList.add('cover-image--failed')}
        />
        <span className="cover-fallback" aria-hidden="true">PEJMÜRDE<br /><b>{issue.display}</b></span>
        <span className="cover-shine" aria-hidden="true" />
      </span>
      <span className="issue-card-meta">
        <span className="issue-card-title">{issue.title}</span>
        <span className="issue-card-type">{issue.kind}</span>
      </span>
    </button>
  );
}

function Icon({ name }) {
  if (name === 'close') {
    return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg>;
  }
  if (name === 'left') {
    return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M19 12H5m0 0 7-7m-7 7 7 7" /></svg>;
  }
  if (name === 'right') {
    return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m0 0-7-7m7 7-7 7" /></svg>;
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12h16m0 0-6-6m6 6-6 6" /></svg>;
}

function App() {
  const initialPath = window.location.pathname;
  const initialIssueId = getIssueFromPath();
  const [routeNotice, setRouteNotice] = useState(() => (
    /^\/dergi\/[^/]+\/?$/i.test(initialPath) && !initialIssueId
      ? 'Bu sayı arşivde bulunamadı. Raflardaki sayılara göz atabilirsin.'
      : ''
  ));
  const [doorsOpen, setDoorsOpen] = useState(Boolean(initialIssueId));
  const [activeIssueId, setActiveIssueId] = useState(initialIssueId);
  const [readerOpen, setReaderOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageDirection, setPageDirection] = useState('next');
  const closeButtonRef = useRef(null);
  const touchStartX = useRef(null);
  const activeIssue = issues.find((issue) => issue.id === activeIssueId) ?? null;
  const availableIssues = issues.filter((issue) => issue.pages.length > 0);

  useEffect(() => {
    if (/^\/dergi\/[^/]+\/?$/i.test(window.location.pathname) && !getIssueFromPath()) {
      window.history.replaceState({}, '', '/');
    }
    const onPopState = () => {
      const nextId = getIssueFromPath();
      if (!nextId && /^\/dergi\/[^/]+\/?$/i.test(window.location.pathname)) {
        window.history.replaceState({}, '', '/');
        setRouteNotice('Bu sayı arşivde bulunamadı. Raflardaki sayılara göz atabilirsin.');
      } else {
        setRouteNotice('');
      }
      setActiveIssueId(nextId);
      setReaderOpen(false);
      setPageIndex(0);
      if (nextId) setDoorsOpen(true);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!activeIssue) return undefined;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = priorOverflow;
    };
  }, [activeIssueId, readerOpen, activeIssue]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Tab' && activeIssue) {
        const dialog = document.querySelector(readerOpen ? '.reader-overlay' : '.issue-dialog');
        const controls = Array.from(dialog?.querySelectorAll('button:not(:disabled), input:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])') ?? []);
        if (controls.length) {
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
            event.preventDefault();
            first.focus();
          }
        }
      }
      if (event.key === 'Escape') {
        if (readerOpen) {
          setReaderOpen(false);
        } else if (activeIssue) {
          closeIssue();
        } else if (doorsOpen) {
          setDoorsOpen(false);
        }
      }
      if (readerOpen && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        event.preventDefault();
        turnPage(event.key === 'ArrowRight' ? 1 : -1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIssue, doorsOpen, readerOpen, pageIndex]);

  function chooseIssue(issue) {
    window.history.pushState({ issueId: issue.id }, '', `/dergi/${encodeURIComponent(issue.id)}`);
    setRouteNotice('');
    setActiveIssueId(issue.id);
    setPageIndex(0);
    setReaderOpen(false);
    setDoorsOpen(true);
  }

  function closeIssue() {
    if (window.location.pathname !== '/') window.history.replaceState({}, '', '/');
    setActiveIssueId(null);
    setReaderOpen(false);
    const focusId = activeIssueId;
    window.setTimeout(() => document.querySelector(`[data-issue-id="${CSS.escape(focusId ?? '')}"]`)?.focus(), 80);
  }

  function turnPage(direction) {
    if (!activeIssue?.pages?.length) return;
    setPageDirection(direction > 0 ? 'next' : 'previous');
    setPageIndex((current) => Math.max(0, Math.min(activeIssue.pages.length - 1, current + direction)));
  }

  const currentPageUrl = activeIssue?.pages?.[pageIndex];

  return (
    <main className="archive-app">
      <div className="cosmos-backdrop" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <header className="topbar" aria-hidden={Boolean(activeIssue)}>
        <a className="brand-lockup" href="/" onClick={(event) => { event.preventDefault(); closeIssue(); }} aria-label="Pejmürde ana arşiv">
          <BrandMark />
          <span className="brand-word">PEJMÜRDE</span>
          <span className="brand-divider" aria-hidden="true" />
          <span className="brand-subtitle">ZAMAN ARŞİVİ</span>
        </a>
        <div className="archive-counter" aria-label={`${issues.length} sayı, ${availableIssues.length} okunabilir sayı`}>
          <span className="counter-dot" aria-hidden="true" />
          <span><b>{String(issues.length).padStart(2, '0')}</b> SAYI <i>/</i> <b>{String(availableIssues.length).padStart(2, '0')}</b> OKUNABİLİR</span>
        </div>
      </header>

      <section className="hero" aria-label="Pejmürde TARDIS dergi arşivi" aria-hidden={Boolean(activeIssue)}>
        <div className="hero-copy">
          <p className="eyebrow"><span>DOCTOR WHO</span><i aria-hidden="true" /> TÜRKİYE FAN ARŞİVİ</p>
          <h1>Bir kapağın ardında<br /><em>başka bir zaman</em> var.</h1>
          <p className="hero-description">Pejmürde’nin sayılarını TARDIS’in raflarında keşfet. Bir kapı, sekiz ayrı zaman çizgisi.</p>
          <button className="open-archive-button" type="button" onClick={() => setDoorsOpen((open) => !open)} aria-expanded={doorsOpen} aria-controls="library-shelves">
            <span>{doorsOpen ? 'Kapıları kapat' : 'Kütüphaneye gir'}</span>
            <Icon name={doorsOpen ? 'close' : 'right'} />
          </button>
          <p className="gesture-hint">{doorsOpen ? 'Bir sayıyı seçmek için kapağa dokun' : 'Kapıları açmak için dokun'}</p>
        </div>

        <div className={`portal-stage ${doorsOpen ? 'portal-stage--open' : ''}`}>
          <div className="portal-glow" aria-hidden="true" />
          <div className="portal-frame" aria-label="TARDIS kütüphane kapıları">
            <div className="lamp" aria-hidden="true"><span /></div>
            <div className="police-sign" aria-hidden="true"><span>POLICE PUBLIC CALL BOX</span></div>
            <section className="library-interior" id="library-shelves" aria-label="Pejmürde dergi rafları" aria-hidden={!doorsOpen}>
              <div className="interior-header">
                <span className="interior-kicker">THE PEJMÜRDE ARCHIVE</span>
                <span className="interior-count">01—08 <i>·</i> DOSYALANDI</span>
              </div>
              <div className="shelf-grid">
                {[issues.slice(0, 4), issues.slice(4, 8)].map((row, rowIndex) => (
                  <div className={`shelf-row shelf-row--${rowIndex + 1}`} key={rowIndex}>
                    {row.map((issue, cardIndex) => (
                      <IssueCard
                        key={issue.id}
                        issue={issue}
                        order={rowIndex * 4 + cardIndex}
                        onChoose={chooseIssue}
                        disabled={!doorsOpen}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="interior-footer"><span>PEJMÜRDE</span><span>ARŞİV RAFI <b>·</b> 08</span></div>
            </section>
            <button className="portal-door portal-door--left" type="button" onClick={() => setDoorsOpen((open) => !open)} aria-label={doorsOpen ? 'TARDIS kapılarını kapat' : 'TARDIS kapılarını aç'} aria-expanded={doorsOpen} aria-controls="library-shelves">
              <span className="door-window" aria-hidden="true" />
              <span className="door-panel door-panel--top" aria-hidden="true" />
              <span className="door-panel door-panel--bottom" aria-hidden="true" />
              <span className="door-handle" aria-hidden="true" />
            </button>
            <button className="portal-door portal-door--right" type="button" onClick={() => setDoorsOpen((open) => !open)} aria-label={doorsOpen ? 'TARDIS kapılarını kapat' : 'TARDIS kapılarını aç'} aria-expanded={doorsOpen} aria-controls="library-shelves">
              <span className="door-window" aria-hidden="true" />
              <span className="door-panel door-panel--top" aria-hidden="true" />
              <span className="door-panel door-panel--bottom" aria-hidden="true" />
              <span className="door-handle" aria-hidden="true" />
            </button>
            <div className="portal-threshold" aria-hidden="true" />
          </div>
          <div className="portal-caption" aria-live="polite">
            <span className="caption-line" />
            <span>{doorsOpen ? 'İÇERİSİ, HER ZAMANKİNDEN DAHA BÜYÜK.' : 'KÜTÜPHANEYİ AÇ'}</span>
            <span className="caption-line" />
          </div>
        </div>

        <div className="hero-index" aria-hidden="true"><span>01</span><i /> TARDIS KÜTÜPHANESİ</div>
        <div className="scroll-note" aria-hidden="true"><span /> PEJMÜRDE · ZAMANIN İÇİNDE</div>
      </section>

      {routeNotice && (
        <div className="route-notice" role="status">
          <span>{routeNotice}</span>
          <button type="button" onClick={() => { setRouteNotice(''); setDoorsOpen(true); }}>Arşivi göster</button>
        </div>
      )}

      {activeIssue && !readerOpen && (
        <div className="dialog-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) closeIssue(); }}>
          <section className="issue-dialog" role="dialog" aria-modal="true" aria-labelledby="issue-dialog-title" aria-describedby="issue-dialog-copy">
            <button className="icon-button dialog-close" type="button" ref={closeButtonRef} onClick={closeIssue} aria-label="Sayı ayrıntılarını kapat"><Icon name="close" /></button>
            <div className="detail-cover-wrap">
              <div className="detail-cover-shadow" aria-hidden="true" />
              <img className="detail-cover" src={activeIssue.cover} alt={`${activeIssue.title} kapak görseli`} />
              <span className="detail-cover-label">PEJMÜRDE <b>{activeIssue.display}</b></span>
            </div>
            <div className="issue-details">
              <p className="eyebrow"><span>{activeIssue.kind.toUpperCase()}</span><i aria-hidden="true" /> PEJMÜRDE ARŞİVİ</p>
              <h2 id="issue-dialog-title">{activeIssue.title}</h2>
              <p className="issue-detail-copy" id="issue-dialog-copy">
                {activeIssue.pages.length > 0
                  ? `${activeIssue.pages.length} sayfalık tarama çevrim içi okuyucuda hazır.`
                  : 'Bu sayının kapak görseli arşivde. Sayfa taraması mevcut proje dosyalarında bulunmuyor.'}
              </p>
              <div className="detail-rule" />
              <dl className="issue-facts">
                <div><dt>KOLEKSİYON</dt><dd>Doctor Who · Türkiye</dd></div>
                <div><dt>OKUMA DURUMU</dt><dd>{activeIssue.pages.length > 0 ? `${activeIssue.pages.length} sayfa çevrim içi` : 'Kapak kaydı'}</dd></div>
              </dl>
              {activeIssue.pages.length > 0 ? (
                <button className="read-button" type="button" onClick={() => { setPageIndex(0); setReaderOpen(true); }}>
                  <span>Sayfaları okumaya başla</span><Icon name="right" />
                </button>
              ) : (
                <p className="archive-note"><span className="note-pin" aria-hidden="true" /> Arşiv kaydı korunuyor; eksik sayfalar varmış gibi gösterilmiyor.</p>
              )}
              <button className="back-to-archive" type="button" onClick={closeIssue}><Icon name="left" /> Raflara dön</button>
            </div>
          </section>
        </div>
      )}

      {activeIssue && readerOpen && currentPageUrl && (
        <div className="reader-overlay" role="dialog" aria-modal="true" aria-labelledby="reader-dialog-title">
          <header className="reader-topbar">
            <button className="reader-back" type="button" onClick={() => setReaderOpen(false)}><Icon name="left" /><span>Sayı bilgisi</span></button>
            <div className="reader-title"><span className="reader-title-kicker">PEJMÜRDE ARŞİVİ</span><b id="reader-dialog-title">{activeIssue.title}</b></div>
            <button className="icon-button reader-close" type="button" ref={closeButtonRef} onClick={closeIssue} aria-label="Okuyucuyu kapat ve arşive dön"><Icon name="close" /></button>
          </header>
          <div className="reader-main" onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }} onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const delta = event.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(delta) > 44) turnPage(delta < 0 ? 1 : -1);
            touchStartX.current = null;
          }}>
            <button className="page-nav page-nav--previous" type="button" onClick={() => turnPage(-1)} disabled={pageIndex === 0} aria-label="Önceki sayfa"><Icon name="left" /></button>
            <div className={`reader-page reader-page--${pageDirection}`} key={`${activeIssue.id}-${pageIndex}`}>
              <img src={currentPageUrl} alt={`${activeIssue.title}, sayfa ${pageIndex + 1}`} fetchPriority="high" />
            </div>
            <button className="page-nav page-nav--next" type="button" onClick={() => turnPage(1)} disabled={pageIndex >= activeIssue.pages.length - 1} aria-label="Sonraki sayfa"><Icon name="right" /></button>
          </div>
          <footer className="reader-footer">
            <span className="reader-edition">{activeIssue.kind.toUpperCase()} <i>·</i> {activeIssue.display}</span>
            <div className="page-progress" role="group" aria-label="Sayfa ilerlemesi">
              <span className="page-number">{String(pageIndex + 1).padStart(2, '0')}</span>
              <input
                aria-label="Okunacak sayfa"
                type="range"
                min="0"
                max={activeIssue.pages.length - 1}
                value={pageIndex}
                onChange={(event) => { const next = Number(event.target.value); setPageDirection(next > pageIndex ? 'next' : 'previous'); setPageIndex(next); }}
                style={{ '--progress': `${activeIssue.pages.length > 1 ? (pageIndex / (activeIssue.pages.length - 1)) * 100 : 0}%` }}
              />
              <span className="page-number">{String(activeIssue.pages.length).padStart(2, '0')}</span>
            </div>
            <span className="reader-hint">← → TUŞLARIYLA GEZİN</span>
          </footer>
        </div>
      )}
    </main>
  );
}

export default App;
