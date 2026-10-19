#!/usr/bin/env python3
"""
Centricity — Portfolio Matrix backend generator (the Python route into RISK_MATRIX).
Input : monthly NAV Data workbook (3 sheets) + site/index.html (for window.MASTER names and prev_name)
Output: a .js file holding window.RISK_MATRIX keyed by MASTER name, DATA_DATES.riskMatrix and
        RISK_MATRIX_BENCH_SD. The output must be a .js path OUTSIDE site/: this tool never writes
        into the deploy set (KNOWN_ISSUES A22).
Usage : python -I tools/build_risk_matrix.py "<NAV Data as on ....xlsx>" site/index.html "30 Sep 2026" <scratch/out.js> [--rf 0.045]
Status: not the production route. Production uses tools/merge_risk_matrix.js (DECISIONS D43); this
        route has not been validated for production on pandas 3.x. Rf defaults to 4.5% (C11: to be
        re-confirmed with the desk). Per the outgoing owner, the method reproduced the deployed
        30-Jun-2026 sibling (base metrics + Alpha exact).
"""
import sys, os, re, json, math, statistics, collections, warnings, argparse, tempfile
from pathlib import Path
from decimal import Decimal, ROUND_HALF_UP
import numpy as np, pandas as pd
from dateutil.relativedelta import relativedelta
warnings.filterwarnings('ignore')

# ---------- 0. Arguments (exit 2 on any misuse, before anything is read) ----------
ap = argparse.ArgumentParser(prog='python -I tools/build_risk_matrix.py',
                             description='Build a RISK_MATRIX .js from the NAV Data workbook (writes outside site/ only).')
ap.add_argument('nav', help='NAV Data workbook (.xlsx)')
ap.add_argument('index', help='site/index.html (read only, for window.MASTER)')
ap.add_argument('as_on', help='as-on label, plain short date, e.g. "30 Sep 2026"')
ap.add_argument('out', help='output .js path, outside site/')
ap.add_argument('--rf', type=float, default=0.045, help='annual risk-free rate as a decimal (default 0.045)')
args = ap.parse_args()

def die(msg, code=2):
    print('*** ' + msg, file=sys.stderr); sys.exit(code)

NAV, IDX, ASLABEL, OUT = args.nav, args.index, args.as_on.strip(), args.out
REPO = Path(__file__).resolve().parent.parent
SITE = (REPO / 'site').resolve()
if not os.path.isfile(NAV) or not NAV.lower().endswith('.xlsx'): die('NAV workbook not found or not .xlsx: ' + NAV)
if not os.path.isfile(IDX): die('index.html not found: ' + IDX)
# The label lands inside a JavaScript string literal: accept only a plain short date (same rule as
# blocklib.checkAsOn(label, 'short')), so no quote, backslash or `$` can reach the output.
MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
if not re.fullmatch(r'([1-9]|[12][0-9]|3[01]) (' + '|'.join(MON) + r') (20[0-9]{2})', ASLABEL):
    die('as-on "%s" is not a plain date label (expected e.g. "30 Sep 2026")' % ASLABEL)
out_p = Path(OUT).resolve()
if OUT.lower().endswith('.html') or out_p.suffix.lower() == '.html': die('refusing an .html output path: ' + OUT)
if out_p.suffix.lower() != '.js': die('output must be a .js file: ' + OUT)
if out_p == SITE or SITE in out_p.parents: die('refusing to write inside site/ (the deploy set): ' + OUT)
if out_p in (Path(NAV).resolve(), Path(IDX).resolve()): die('output path is one of the inputs: ' + OUT)
if not out_p.parent.is_dir(): die('output folder does not exist: ' + str(out_p.parent))
if not (0 <= args.rf <= 0.25): die('--rf %r is outside 0..0.25 (it is a decimal: 0.045 = 4.5%%)' % args.rf)

Rf=args.rf; Rf_day=Rf/252; SQ=math.sqrt(252); RF_PCT=Rf*100
EPS=1e-12   # a dispersion below this is floating-point noise, i.e. zero (real funds are many orders above it)
print(f"Rf={Rf} (annual, decimal; alpha uses {RF_PCT}%)")
BMAP={'Large Cap':'NIFTY 100 - TRI','Mid Cap':'Nifty Midcap 150 - TRI','Small Cap':'Nifty Smallcap 250 - TRI'}
BDISP={'NIFTY 100 - TRI':'NIFTY 100 TRI','Nifty Midcap 150 - TRI':'Nifty Midcap 150 TRI',
       'Nifty Smallcap 250 - TRI':'Nifty Smallcap 250 TRI','NIFTY 500 - TRI':'NIFTY 500 TRI'}
bcol=lambda c: BMAP.get(c,'NIFTY 500 - TRI')

def fin(x):
    """True for a real, finite number (None, NaN and +-inf are not)."""
    try: return x is not None and math.isfinite(x)
    except TypeError: return False

# ---------- 1. Parse NAV workbook ----------
raw=pd.read_excel(NAV, sheet_name='NAV Data-MF', header=0)
if 'Date' not in raw.columns: die("NAV Data-MF has no 'Date' column", 1)
# Row 2 of the sheet (the first row below the header) holds AMFI codes, not a date: drop it only
# when it really is not a date, so a sheet without that row keeps its first NAV day. A bare number
# is never a date here: pandas would read an AMFI code in that cell as a 1970 timestamp.
v0 = raw['Date'].iloc[0] if len(raw) > 0 else None
first_is_date = (v0 is not None and not isinstance(v0, (int, float, np.number))
                 and not pd.isna(pd.to_datetime(v0, errors='coerce')))
data=(raw if first_is_date else raw.iloc[1:]).copy()
try: data['Date']=pd.to_datetime(data['Date'])
except (ValueError, TypeError) as e: die('NAV Data-MF has a non-date in the Date column below row 2: %s' % e, 1)
data=data.set_index('Date').sort_index()
if data.index.has_duplicates: die('NAV Data-MF has duplicate dates', 1)
fund_names=list(data.columns); data=data.apply(pd.to_numeric,errors='coerce')
# A NAV of zero or below is not a price: treat it as missing (it would otherwise give infinite returns).
NONPOS_MF=int((data<=0).sum().sum()); data=data.where(data>0)
cat_raw=pd.read_excel(NAV, sheet_name='CATEGORY FOR MF', header=None)
cat_map={}
for _,row in cat_raw.iterrows():
    nm,ct=row.iloc[0],row.iloc[1]
    if nm is None or (isinstance(nm,float) and pd.isna(nm)): continue
    nm=str(nm).strip()
    if ct=='Category' or nm=='Instrument Name': continue
    cat_map[nm]=(str(ct).strip() if ct is not None and not(isinstance(ct,float) and pd.isna(ct)) else None)
bench=pd.read_excel(NAV, sheet_name='NAV Data-Benchmark', header=0)
missing=[c for c in ['Date', *BDISP] if c not in bench.columns]
if missing: die('NAV Data-Benchmark lacks column(s): ' + ', '.join(missing), 1)
bench['Date']=pd.to_datetime(bench['Date']); bench=bench.set_index('Date').sort_index()
bench=bench.apply(pd.to_numeric,errors='coerce')
NONPOS_BM=int((bench<=0).sum().sum()); bench=bench.where(bench>0); bench_td=bench.reindex(data.index)
td=data.index; AS_ON=td.max()
def prior(t):
    i=td.searchsorted(pd.Timestamp(t),side='right')-1
    if i<0: die('NAV Data-MF does not reach back to %s (needs 5 years of history)' % pd.Timestamp(t).date(), 1)
    return td[i]
D_3Y=prior(AS_ON-relativedelta(years=3)); D_5Y=prior(AS_ON-relativedelta(years=5))
MKT_BEGINS=td[(td>=D_5Y)&(td<=D_3Y)]                       # every market trading day (spec §4.2)
etmap={pd.Timestamp(b):pd.Timestamp(b)+relativedelta(years=3) for b in MKT_BEGINS}

# ---------- 2. Full-precision metrics ----------
# Edge data (a flat NAV, no down days, a zero first NAV, a benchmark gap) yields None, never a
# crash and never NaN/Infinity in the output: the field is then simply omitted, as the JS route does.
def compute(f):
    cat=cat_map.get(f); bc=bcol(cat); s=data[f].dropna()
    r={'bm':BDISP[bc],'elig':False,'rr':None}
    s3=s[(s.index>=D_3Y)&(s.index<=AS_ON)]
    if len(s3)>=250:
        rr_=s3.pct_change(fill_method=None).dropna(); mu=rr_.mean(); sd=rr_.std(ddof=0)*SQ
        d0,d1=s3.index[0],s3.index[-1]; days=(d1-d0).days
        CAGR=(s3.iloc[-1]/s3.iloc[0])**(365.25/days)-1 if (days>0 and s3.iloc[0]>0) else None
        sh=(mu*252-Rf)/sd if sd>EPS else None
        e=rr_-Rf_day; dn=e[e<0]; dd=dn.std(ddof=0)*SQ if len(dn)>=2 else None
        so=(mu*252-Rf)/dd if (dd and dd>EPS) else None
        b=bench_td[bc].reindex(s3.index).pct_change(fill_method=None)
        al=pd.concat([rr_,b],axis=1); al.columns=['r','b']; al=al.dropna()
        fr,bb=al['r'],al['b']; vb=((bb-bb.mean())**2).sum()
        be=((fr-fr.mean())*(bb-bb.mean())).sum()/vb if vb>EPS else None
        TE=(fr-bb).std(ddof=0)*SQ
        Bf,Bl=bench_td[bc].loc[d0],bench_td[bc].loc[d1]
        Bann=(Bl/Bf)**(365.25/days)-1 if (fin(Bf) and fin(Bl) and Bf>0 and days>0) else None
        ir=(CAGR-Bann)/TE if (fin(CAGR) and fin(Bann) and TE>EPS) else None
        dw=bb<0
        Dn=(fr[dw].mean()/bb[dw].mean()*100) if (dw.any() and bb[dw].mean()!=0) else None
        r.update(elig=True,c=(CAGR*100 if fin(CAGR) else None),be=be,sd=sd*100,so=so,sh=sh,ir=ir,
                 te=(TE*100 if fin(TE) else None),dc=Dn)
    if len(s)>0 and s.index[0]<=D_5Y:
        fv=s.index.values; fn=s.values; last=s.index[-1]; cg=[]
        for b in MKT_BEGINS:                                        # begin = every market trading day
            et=etmap[pd.Timestamp(b)]
            if et>last: continue
            bi=np.searchsorted(fv,np.datetime64(b),side='right')-1  # begin NAV: nearest prior fund NAV
            ei=np.searchsorted(fv,np.datetime64(et),side='right')-1 # end   NAV: nearest prior fund NAV
            if bi>=0 and ei>=0 and fn[bi]>0: cg.append((fn[ei]/fn[bi])**(1/3)-1)
        if cg:
            m=float(np.mean(cg))*100
            if fin(m): r['rr']=m
    return r
FULL={f:compute(f) for f in fund_names}

# ---------- 3. MASTER names from index.html ----------
def extract(text,marker,op,cl):
    # Same rule as blocklib.locate: exactly one place where the marker is followed by a literal.
    # (Page code also says `window.MASTER = window.MASTER || []` and the like; those are not literals.)
    hits=[m.start() for m in re.finditer(re.escape(marker),text) if text[m.end():m.end()+1] in ('[','{')]
    if len(hits)!=1: die('%s literal found %d times in %s (expected exactly 1)' % (marker.strip(), len(hits), IDX), 1)
    j=hits[0]+len(marker)
    if text[j:j+1]!=op: die('%s is not followed by %s' % (marker.strip(), op), 1)
    depth=0; instr=False; esc=False; q=None; k=j
    while k<len(text):
        c=text[k]
        if instr:
            if esc: esc=False
            elif c=='\\': esc=True
            elif c==q: instr=False
        else:
            if c in ('"',"'"): instr=True; q=c
            elif c==op: depth+=1
            elif c==cl:
                depth-=1
                if depth==0: return text[j:k+1]
        k+=1
    die('unbalanced %s literal in %s' % (marker.strip(), IDX), 1)
idx=open(IDX,encoding='utf-8',errors='replace').read()
master=json.loads(extract(idx,'window.MASTER = ','[',']'))
mnames=set(m['name'] for m in master)
byprev={}
for m in master:                                                  # first record wins, as in merge_risk_matrix.js
    p=m.get('prev_name')
    if p and p not in byprev: byprev[p]=m['name']
EQPC={'Mutual Fund','Index Fund','ETF','Mutual Funds'}
def strip_sc(n):
    n=re.sub(r'\s*-?Reg\([^)]*\)\s*$','',n); n=re.sub(r'\s*-?Dir(ect)?\s*Plan.*$','',n,flags=re.I)
    n=re.sub(r'\s*\((G|IDCW[^)]*)\)\s*$','',n); return n.strip()
eq_by_base=collections.defaultdict(list)
for m in master:
    if m.get('product_class') in EQPC and m.get('asset_class')=='Equity':
        eq_by_base[strip_sc(m['name'])].append(m['name'])

# ---------- 4. Join NAV name -> MASTER key ----------
# Tiers: exact name, prev_name (a Monitor rename), IDCW -> (G), unique equity base name.
def master_key(nav):
    if nav in mnames: return nav,'exact'
    if nav in byprev: return byprev[nav],'prev_name'
    cand=re.sub(r'\(IDCW[^)]*\)','(G)',nav)
    if cand in mnames: return cand,'idcw->G'
    hits=eq_by_base.get(strip_sc(nav),[])
    if len(hits)==1: return hits[0],'base'
    return None,None
KEY={}; TIER=collections.Counter()
for f in fund_names:
    k,t=master_key(f); KEY[f]=k
    if t: TIER[t]+=1
unjoined=[f for f,k in KEY.items() if k is None]

# ---------- 5. BENCH_SD median-solve + derive Alpha/Correl ----------
r2=lambda x: round(x,2) if fin(x) else None
r1=lambda x: round(x,1) if fin(x) else None
be2map=collections.defaultdict(list)
for f,r in FULL.items():
    if not r['elig']: continue
    te,sd,be=r2(r['te']),r2(r['sd']),r2(r['be'])
    if te is None or sd is None or be is None: continue
    den=1-2*be; num=te*te-sd*sd
    if den!=0 and num/den>0: be2map[r['bm']].append(math.sqrt(num/den))
SIG={k:statistics.median(v) for k,v in be2map.items()}          # full-precision median sigma_bench
BENCH_SD={k:round(v,2) for k,v in SIG.items()}                  # stored (display) 2dp
def hu(x,n): return float(Decimal(str(float(x))).quantize(Decimal('1.'+'0'*n),rounding=ROUND_HALF_UP))
def alpha(r):
    c,ir,te,be=r2(r['c']),r2(r['ir']),r2(r['te']),r2(r['be'])
    if c is None or ir is None or te is None or be is None: return None
    Rb=c-ir*te
    return r2(c-(RF_PCT+be*(Rb-RF_PCT)))
def correl(r):
    be,sd=r2(r['be']),r2(r['sd'])
    if be is None or not sd or r['bm'] not in SIG: return None
    v=min(0.999, be*SIG[r['bm']]/sd)
    return hu(v,3) if fin(v) else None                            # full sigma, half-up

# ---------- 6. Emit ----------
RM={}; collisions=[]; omitted=collections.Counter()
for f in fund_names:
    k=KEY[f]
    if k is None: continue
    r=FULL[f]; rec={}
    if r['elig']:
        for key,v in (('c',r2(r['c'])),('be',r2(r['be'])),('sd',r2(r['sd'])),('so',r2(r['so'])),
                      ('sh',r2(r['sh'])),('ir',r2(r['ir'])),('dc',r1(r['dc'])),
                      ('al',alpha(r)),('co',correl(r))):
            if v is None: omitted[key]+=1
            else: rec[key]=v
    rec['bm']=r['bm']
    if r['rr'] is not None: rec['rr']=r2(r['rr'])
    if k in RM: collisions.append(f + ' -> ' + k)                 # reported; the later fund wins, as before
    RM[k]=rec
hdr=f"/* Centricity_Risk_Matrix.js  —  3Y Rolling + Risk & Risk-Adjusted Ratios (as on {AS_ON.strftime('%d-%b-%Y')})\n   Source: NAV Data workbook -> risk ratios; keyed by exact MASTER fund name. Generated by build_risk_matrix.py. */\n"
body="window.RISK_MATRIX = "+json.dumps(RM,ensure_ascii=False,separators=(',',':'),allow_nan=False)+";\n"
dd=("window.DATA_DATES = window.DATA_DATES || {};\n"
    f"window.DATA_DATES.riskMatrix = '{ASLABEL}';\n")
bsd="window.RISK_MATRIX_BENCH_SD = "+json.dumps(BENCH_SD,ensure_ascii=False,allow_nan=False)+";\n"
text=hdr+body+dd+bsd
# Atomic write: a temp file beside the target, then rename over it.
fd,tmp=tempfile.mkstemp(prefix='.'+out_p.name+'.',suffix='.tmp',dir=str(out_p.parent))
try:
    with os.fdopen(fd,'w',encoding='utf-8',newline='\n') as fh: fh.write(text)
    os.replace(tmp,str(out_p))
except BaseException:
    try: os.unlink(tmp)
    except OSError: pass
    raise

print(f"AS_ON={AS_ON.date()} D_3Y={D_3Y.date()} D_5Y={D_5Y.date()}  label='{ASLABEL}'")
if AS_ON.strftime('%-d %b %Y' if os.name!='nt' else '%#d %b %Y')!=ASLABEL:
    print(f"  note: label '{ASLABEL}' differs from the last NAV date {AS_ON.date()}")
print(f"NAV funds={len(fund_names)}  joined={len(RM)}  unjoined={len(unjoined)}")
print(f"non-positive values treated as missing: NAV cells={NONPOS_MF}  benchmark cells={NONPOS_BM}")
print("join tiers: " + "  ".join(f"{t}={TIER[t]}" for t in ('exact','prev_name','idcw->G','base')))
if unjoined: print("  UNJOINED:",unjoined[:20])
print(f"collisions={len(collisions)}" + (("  " + " | ".join(collisions[:5])) if collisions else ""))
print("fields omitted as non-finite/undefined: " + (", ".join(f"{k}={v}" for k,v in sorted(omitted.items())) or "none"))
print("BENCH_SD:",BENCH_SD)
print(f"records with metrics={sum(1 for v in RM.values() if 'c' in v)}  with rr={sum(1 for v in RM.values() if 'rr' in v)}")
print("wrote",str(out_p),"bytes",len(text))
