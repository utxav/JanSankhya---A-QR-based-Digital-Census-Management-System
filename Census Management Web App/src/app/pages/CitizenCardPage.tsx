import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useAuth, Citizen } from '../Context/AuthContext';

const PAGE_SIZE = 24; // Only render 24 cards at a time — prevents browser freeze

// ── Real QR Card Component ────────────────────────────────────────────────────
// index prop staggers QR generation so all 24 don't fire simultaneously
function UIDCard({ citizen, size = 'normal', index = 0 }: {
  citizen: Citizen;
  size?: 'normal' | 'large';
  index?: number;
}) {
  const [qrSrc, setQrSrc] = useState<string>('');
  const isLarge = size === 'large';

  useEffect(() => {
    // Stagger generation: each card waits (index * 40ms) before generating
    // This prevents 24 simultaneous CPU-heavy QR calls from freezing the browser
    const timer = setTimeout(() => {
      QRCode.toDataURL(citizen.uid, {
        width: 120,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      }).then(url => setQrSrc(url));
    }, index * 40);

    return () => clearTimeout(timer);
  }, [citizen.uid, index]);

  return (
    <div
      className="uid-card"
      style={{
        width:           isLarge ? '340px' : '100%',
        minWidth:        '0',
        maxWidth:        '320px',
        background:      'white',
        borderRadius:    '12px',
        overflow:        'hidden',
        boxShadow:       '0 4px 24px rgba(0,0,0,0.15)',
        fontFamily:      "'Noto Sans', sans-serif",
        border:          '1px solid #e2e8f0',
        pageBreakInside: 'avoid',
      }}
    >
      {/* Card Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a4f 100%)',
        padding:    isLarge ? '14px 16px' : '10px 14px',
        display:    'flex',
        alignItems: 'center',
        gap:        '10px',
      }}>
        <div style={{
          width:          isLarge ? '36px' : '28px',
          height:         isLarge ? '36px' : '28px',
          borderRadius:   '50%',
          background:     'rgba(255,255,255,0.15)',
          border:         '2px solid rgba(255,255,255,0.4)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          flexShrink:     0,
        }}>
          <span style={{ fontSize: isLarge ? '18px' : '14px' }}>⊕</span>
        </div>
        <div>
          <div style={{
            color:         '#ffd700',
            fontSize:      isLarge ? '10px' : '8px',
            fontWeight:    '700',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}>
            Government of India
          </div>
          <div style={{
            color:         'white',
            fontSize:      isLarge ? '13px' : '11px',
            fontWeight:    '700',
            letterSpacing: '0.5px',
          }}>
            JanSankhya — Census Card
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div style={{
        padding:    isLarge ? '14px 16px' : '12px 14px',
        display:    'flex',
        gap:        '12px',
        alignItems: 'flex-start',
      }}>
        {/* Photo placeholder */}
        <div style={{
          width:          isLarge ? '70px' : '56px',
          height:         isLarge ? '84px' : '68px',
          background:     'linear-gradient(135deg, #e8f4fd, #d1e8f0)',
          border:         '2px solid #cbd5e1',
          borderRadius:   '6px',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          flexShrink:     0,
          gap:            '4px',
        }}>
          <span style={{ fontSize: isLarge ? '28px' : '22px', opacity: 0.5 }}>
            {citizen.gender === 'Female' ? '👩' : '👨'}
          </span>
          <span style={{ fontSize: '8px', color: '#94a3b8' }}>PHOTO</span>
        </div>

        {/* Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize:     isLarge ? '14px' : '12px',
            fontWeight:   '700',
            color:        '#1e293b',
            marginBottom: '6px',
            lineHeight:   1.2,
            wordBreak:    'break-word',
          }}>
            {citizen.name}
          </div>

          {[
            { label: 'UID',    value: citizen.uid },
            { label: 'DOB',    value: citizen.dob },
            { label: 'Gender', value: citizen.gender },
            { label: 'State',  value: citizen.state },
            { label: 'Caste',  value: citizen.caste },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display:      'flex',
              gap:          '4px',
              marginBottom: '3px',
              fontSize:     isLarge ? '10px' : '9px',
            }}>
              <span style={{ color: '#64748b', fontWeight: '600', minWidth: '42px' }}>
                {label}:
              </span>
              <span style={{ color: '#1e293b', fontWeight: '500', wordBreak: 'break-all' }}>
                {value || '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* QR + UID strip */}
      <div style={{
        background:     '#f8fafc',
        borderTop:      '1px solid #e2e8f0',
        padding:        isLarge ? '10px 16px' : '8px 14px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        gap:            '8px',
      }}>
        <div>
          <div style={{
            fontSize:           isLarge ? '16px' : '13px',
            fontWeight:         '800',
            color:              '#1e3a5f',
            letterSpacing:      '1px',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {citizen.uid}
          </div>
          <div style={{ fontSize: isLarge ? '9px' : '8px', color: '#94a3b8', marginTop: '2px', letterSpacing: '0.5px' }}>
            UNIQUE IDENTIFICATION NO.
          </div>
          <div style={{ fontSize: isLarge ? '9px' : '8px', color: '#64748b', marginTop: '4px', fontStyle: 'italic' }}>
            Issued: {new Date().getFullYear()}
          </div>
        </div>

        {/* QR code — shows placeholder while generating */}
        {qrSrc ? (
          <img
            src={qrSrc}
            alt={`QR Code for ${citizen.uid}`}
            style={{
              width:          isLarge ? '60px' : '48px',
              height:         isLarge ? '60px' : '48px',
              border:         '2px solid #e2e8f0',
              borderRadius:   '4px',
              padding:        '2px',
              background:     'white',
            }}
          />
        ) : (
          <div style={{
            width:          isLarge ? '60px' : '48px',
            height:         isLarge ? '60px' : '48px',
            border:         '2px solid #e2e8f0',
            borderRadius:   '4px',
            background:     '#f1f5f9',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            fontSize:       '8px',
            color:          '#94a3b8',
          }}>
            QR...
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        background:     'linear-gradient(135deg, #1e3a5f 0%, #2d6a4f 100%)',
        padding:        '5px 14px',
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '7px', letterSpacing: '0.5px' }}>
          जनसंख्या • JanSankhya
        </span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '7px' }}>
          {citizen.district}, {citizen.state}
        </span>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CitizenCardPage() {
  const { citizens } = useAuth();

  const [searchQuery,    setSearchQuery]    = useState('');
  const [selectedState,  setSelectedState]  = useState('All');
  const [selectedCards,  setSelectedCards]  = useState<Set<string>>(new Set());
  const [previewCitizen, setPreviewCitizen] = useState<Citizen | null>(null);
  const [bulkCount,      setBulkCount]      = useState(10);
  const [page,           setPage]           = useState(1);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const availableStates = ['All', ...Array.from(new Set(citizens.map(c => c.state))).sort()];

  // Reset page when search/filter changes
  useEffect(() => { setPage(1); }, [searchQuery, selectedState]);

  const filtered = citizens.filter(c => {
    const matchState  = selectedState === 'All' || c.state === selectedState;
    const q           = searchQuery.toLowerCase().trim();
    const matchSearch = !q ||
      c.name.toLowerCase().includes(q) ||
      c.uid.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q) ||
      c.mobile.includes(q);
    return matchState && matchSearch;
  });

  // Only render current page — prevents rendering 5000 cards at once
  const paginated          = filtered.slice(0, page * PAGE_SIZE);
  const hasMore            = paginated.length < filtered.length;
  const selectedCitizensList = citizens.filter(c => selectedCards.has(c.uid));

  const toggleCard = (uid: string) => {
    setSelectedCards(prev => {
      const next = new Set(prev);
      next.has(uid) ? next.delete(uid) : next.add(uid);
      return next;
    });
  };

  // Select all only selects from filtered (not all 5000)
  const selectAll  = () => setSelectedCards(new Set(filtered.slice(0, 200).map(c => c.uid)));
  const clearAll   = () => setSelectedCards(new Set());
  const selectBulk = () => setSelectedCards(new Set(filtered.slice(0, bulkCount).map(c => c.uid)));

  // ── Print with real async QR codes ───────────────────────────────────────
  const handlePrint = async () => {
    if (selectedCards.size === 0) {
      alert('Please select at least one citizen card to print.');
      return;
    }

    const CARDS_PER_PAGE = 12;

    const makeCard = async (citizen: Citizen): Promise<string> => {
      const qrSrc = await QRCode.toDataURL(citizen.uid, { width: 100, margin: 1 });

      return `<div style="width:240px;background:white;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;page-break-inside:avoid;break-inside:avoid;font-family:sans-serif;">
        <div style="background:linear-gradient(135deg,#1e3a5f,#2d6a4f);padding:10px 14px;display:flex;align-items:center;gap:10px;">
          <div style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.15);border:2px solid rgba(255,255,255,0.4);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:white;font-size:14px;">⊕</div>
          <div>
            <div style="color:#ffd700;font-size:8px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Government of India</div>
            <div style="color:white;font-size:11px;font-weight:700;">JanSankhya — Census Card</div>
          </div>
        </div>
        <div style="padding:12px 14px;display:flex;gap:10px;align-items:flex-start;">
          <div style="width:52px;height:64px;flex-shrink:0;border-radius:6px;background:linear-gradient(135deg,#e8f4fd,#d1e8f0);border:2px solid #cbd5e1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;">
            <span style="font-size:20px;opacity:0.5;">${citizen.gender === 'Female' ? '👩' : '👨'}</span>
            <span style="font-size:7px;color:#94a3b8;">PHOTO</span>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:12px;font-weight:700;color:#1e293b;margin-bottom:5px;line-height:1.2;">${citizen.name}</div>
            ${[['UID', citizen.uid], ['DOB', citizen.dob], ['Gender', citizen.gender], ['State', citizen.state], ['Caste', citizen.caste]].map(([l, v]) =>
              `<div style="display:flex;gap:4px;margin-bottom:2px;font-size:9px;"><span style="color:#64748b;font-weight:600;min-width:40px;flex-shrink:0;">${l}:</span><span style="color:#1e293b;font-weight:500;">${v || '—'}</span></div>`
            ).join('')}
          </div>
        </div>
        <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:8px 14px;display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <div style="min-width:0;flex:1;">
            <div style="font-size:12px;font-weight:800;color:#1e3a5f;letter-spacing:0.5px;">${citizen.uid}</div>
            <div style="font-size:7px;color:#94a3b8;margin-top:2px;">UNIQUE IDENTIFICATION NO.</div>
            <div style="font-size:7px;color:#64748b;margin-top:3px;font-style:italic;">Issued: ${new Date().getFullYear()}</div>
          </div>
          <img src="${qrSrc}" style="width:44px;height:44px;border:2px solid #e2e8f0;border-radius:4px;padding:2px;background:white;" />
        </div>
        <div style="background:linear-gradient(135deg,#1e3a5f,#2d6a4f);padding:4px 14px;display:flex;justify-content:space-between;align-items:center;">
          <span style="color:rgba(255,255,255,0.7);font-size:7px;">जनसंख्या • JanSankhya</span>
          <span style="color:rgba(255,255,255,0.7);font-size:7px;">${citizen.district}, ${citizen.state}</span>
        </div>
      </div>`;
    };

    const allCardHtmls = await Promise.all(selectedCitizensList.map(makeCard));

    let pagesHtml = '';
    for (let i = 0; i < allCardHtmls.length; i += CARDS_PER_PAGE) {
      const pageCards  = allCardHtmls.slice(i, i + CARDS_PER_PAGE);
      const isLastPage = i + CARDS_PER_PAGE >= allCardHtmls.length;
      pagesHtml += `<div style="width:210mm;min-height:297mm;padding:12mm;background:white;box-sizing:border-box;${isLastPage ? '' : 'page-break-after:always;break-after:page;'}">
        <div style="display:flex;flex-wrap:wrap;gap:16px;">${pageCards.join('')}</div>
      </div>`;
    }

    const printWindow = window.open('', '_blank', 'width=1000,height=700');
    if (!printWindow) { alert('Please allow popups for this site to enable printing.'); return; }
    printWindow.document.write(`<!DOCTYPE html><html><head><title>JanSankhya UID Cards</title>
      <style>* { margin:0; padding:0; box-sizing:border-box; } body { background:white; } @media print { @page { margin:0; } }</style>
    </head><body>${pagesHtml}
      <script>window.onload=function(){ setTimeout(function(){ window.print(); window.close(); },500); };<\/script>
    </body></html>`);
    printWindow.document.close();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');
        @media print {
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }
          #print-area {
            position: fixed !important; top: 0; left: 0;
            width: 100vw; padding: 20px;
            display: flex !important; flex-wrap: wrap; gap: 16px; background: white;
          }
          .uid-card { box-shadow: none !important; }
          .no-print { display: none !important; }
        }
        .card-item:hover .card-overlay { opacity: 1 !important; }
        .card-item:hover .preview-btn  { opacity: 1 !important; }
        .search-input:focus { outline: none; border-color: #3b82f6 !important; }
        .stat-badge {
          background: linear-gradient(135deg, #1e3a5f15, #2d6a4f10);
          border: 1px solid #1e3a5f20; border-radius: 8px;
          padding: 12px 20px; text-align: center;
        }
        .load-more-btn:hover { opacity: 0.85; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Noto Sans', sans-serif", padding: '24px' }}>

        {/* Header */}
        <div className="no-print" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '28px', color: '#1e293b', margin: '0 0 4px 0' }}>
                UID Card Generator
              </h1>
              <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
                Search citizens → select cards → print &amp; distribute
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { label: 'Total Citizens', value: citizens.length.toLocaleString() },
                { label: 'Filtered',       value: filtered.length.toLocaleString() },
                { label: 'Selected',       value: selectedCards.size.toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="stat-badge">
                  <div style={{ fontSize: '22px', fontWeight: '800', color: '#1e3a5f' }}>{value}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="no-print" style={{
          background: 'white', borderRadius: '12px', padding: '16px 20px',
          marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center',
        }}>
          <input
            className="search-input"
            type="text"
            placeholder="🔍  Search by name, UID, district, mobile..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: '1', minWidth: '220px', padding: '9px 14px',
              border: '1.5px solid #e2e8f0', borderRadius: '8px',
              fontSize: '13px', color: '#1e293b', background: '#f8fafc',
            }}
          />

          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            style={{
              padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px',
              fontSize: '13px', color: '#1e293b', background: '#f8fafc',
              cursor: 'pointer', minWidth: '160px',
            }}
          >
            {availableStates.map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All States' : s}</option>
            ))}
          </select>

          <div style={{ width: '1px', height: '32px', background: '#e2e8f0' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Select top</span>
            <input
              type="number" min={1} max={200} value={bulkCount}
              onChange={e => setBulkCount(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
              style={{
                width: '60px', padding: '7px 10px', border: '1.5px solid #e2e8f0',
                borderRadius: '8px', fontSize: '13px', textAlign: 'center',
                color: '#1e293b', background: '#f8fafc',
              }}
            />
            <button onClick={selectBulk} style={{
              padding: '8px 14px', background: '#f1f5f9', border: '1.5px solid #e2e8f0',
              borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
              color: '#475569', fontWeight: '600',
            }}>
              Select
            </button>
          </div>

          <button onClick={selectAll} style={{
            padding: '8px 14px', background: '#eff6ff', border: '1.5px solid #bfdbfe',
            borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
            color: '#2563eb', fontWeight: '600',
          }}>
            Select All ({Math.min(filtered.length, 200)})
          </button>

          <button onClick={clearAll} style={{
            padding: '8px 14px', background: '#fef2f2', border: '1.5px solid #fecaca',
            borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
            color: '#dc2626', fontWeight: '600',
          }}>
            Clear
          </button>

          <button
            onClick={handlePrint}
            disabled={selectedCards.size === 0}
            style={{
              padding: '9px 20px', marginLeft: 'auto',
              background: selectedCards.size > 0 ? 'linear-gradient(135deg, #1e3a5f, #2d6a4f)' : '#e2e8f0',
              border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700',
              cursor: selectedCards.size > 0 ? 'pointer' : 'not-allowed',
              color: selectedCards.size > 0 ? 'white' : '#94a3b8', letterSpacing: '0.3px',
            }}
          >
            🖨️ Print {selectedCards.size > 0 ? `${selectedCards.size} Cards` : 'Cards'}
          </button>
        </div>

        {/* Citizen Grid */}
        {citizens.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '12px', color: '#94a3b8' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#64748b' }}>No citizens in database</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>Go to Data Generator to add citizens first</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px', color: '#94a3b8' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#64748b' }}>No results found</div>
            <div style={{ fontSize: '13px', marginTop: '6px' }}>Try a different name, UID, or state</div>
          </div>
        ) : (
          <>
            {/* Showing X of Y info */}
            <div style={{ marginBottom: '12px', fontSize: '13px', color: '#64748b' }}>
              Showing <strong style={{ color: '#1e293b' }}>{paginated.length}</strong> of <strong style={{ color: '#1e293b' }}>{filtered.length}</strong> citizens
              {filtered.length > 200 && <span style={{ color: '#f59e0b', marginLeft: '8px' }}>⚠ Select All is capped at 200 for performance</span>}
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px', alignItems: 'start', width: '100%', boxSizing: 'border-box',
            }}>
              {paginated.map((citizen, i) => {
                const isSelected = selectedCards.has(citizen.uid);
                return (
                  <div
                    key={citizen.uid}
                    className="card-item"
                    onClick={() => toggleCard(citizen.uid)}
                    style={{
                      cursor: 'pointer', position: 'relative', borderRadius: '14px',
                      transition: 'all 0.15s',
                      outline: isSelected ? '3px solid #3b82f6' : '3px solid transparent',
                      outlineOffset: '2px',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      overflow: 'visible', display: 'flex', justifyContent: 'center', minWidth: '0',
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: 'absolute', top: '-8px', right: '-8px',
                        width: '24px', height: '24px', background: '#3b82f6', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 10, color: 'white', fontSize: '14px',
                        boxShadow: '0 2px 8px rgba(59,130,246,0.5)',
                      }}>✓</div>
                    )}

                    <div className="card-overlay" style={{
                      position: 'absolute', inset: 0, background: 'rgba(59,130,246,0.08)',
                      borderRadius: '12px', opacity: 0, transition: 'opacity 0.15s',
                      pointerEvents: 'none', zIndex: 5,
                    }} />

                    {/* Pass index for staggered QR generation */}
                    <UIDCard citizen={citizen} index={i} />

                    <button
                      className="preview-btn"
                      onClick={e => { e.stopPropagation(); setPreviewCitizen(citizen); }}
                      style={{
                        position: 'absolute', bottom: '8px', left: '50%',
                        transform: 'translateX(-50%)', padding: '4px 12px',
                        background: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0',
                        borderRadius: '20px', fontSize: '11px', cursor: 'pointer',
                        color: '#475569', fontWeight: '600', zIndex: 20,
                        opacity: 0, transition: 'opacity 0.15s',
                      }}
                    >
                      Preview
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Load More button */}
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <button
                  className="load-more-btn"
                  onClick={() => setPage(p => p + 1)}
                  style={{
                    padding: '12px 40px',
                    background: 'linear-gradient(135deg, #1e3a5f, #2d6a4f)',
                    color: 'white', border: 'none', borderRadius: '8px',
                    fontSize: '14px', cursor: 'pointer', fontWeight: '700',
                    boxShadow: '0 2px 8px rgba(30,58,95,0.3)',
                    transition: 'opacity 0.2s',
                  }}
                >
                  Load More ({filtered.length - paginated.length} remaining)
                </button>
              </div>
            )}
          </>
        )}

        {/* Print Area — hidden on screen */}
        <div id="print-area" ref={printAreaRef} style={{ display: 'none' }}>
          {selectedCitizensList.map((citizen, i) => (
            <UIDCard key={citizen.uid} citizen={citizen} size="large" index={i} />
          ))}
        </div>

        {/* Preview Modal */}
        {previewCitizen && (
          <div
            onClick={() => setPreviewCitizen(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, backdropFilter: 'blur(4px)',
            }}
          >
            <div onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <UIDCard citizen={previewCitizen} size="large" index={0} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => { toggleCard(previewCitizen.uid); setPreviewCitizen(null); }}
                  style={{
                    padding: '10px 24px',
                    background: selectedCards.has(previewCitizen.uid) ? '#fef2f2' : 'linear-gradient(135deg, #1e3a5f, #2d6a4f)',
                    border: selectedCards.has(previewCitizen.uid) ? '1px solid #fecaca' : 'none',
                    borderRadius: '8px',
                    color: selectedCards.has(previewCitizen.uid) ? '#dc2626' : 'white',
                    fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                  }}
                >
                  {selectedCards.has(previewCitizen.uid) ? '✗ Deselect' : '✓ Select for Print'}
                </button>
                <button
                  onClick={() => setPreviewCitizen(null)}
                  style={{
                    padding: '10px 24px', background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px',
                    color: 'white', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}