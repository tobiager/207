"""Genera /data/matches.json con 207 partidos placeholder realistas (125 goles).
Los hitos (debut, finales, Mundiales, Copas ganadas) usan datos reales conocidos;
el resto son placeholders verosímiles a verificar antes de publicar."""
import json, random, datetime, sys

random.seed(207)

# (date, opponent, result, goals, competition, isFinal, won, note)
ANCHORS = [
    ("2005-08-17", "Hungría", "2-1", 0, "Amistoso", False, True, "Debut. Expulsado a los 47 segundos."),
    ("2006-03-01", "Croacia", "2-3", 1, "Amistoso", False, False, "Primer gol con la Selección."),
    ("2006-06-16", "Serbia y Montenegro", "6-0", 1, "Mundial", False, True, "Primer gol en un Mundial."),
    ("2007-07-15", "Brasil", "0-3", 0, "Copa América", True, False, "Final Copa América 2007."),
    ("2012-02-29", "Suiza", "3-1", 3, "Amistoso", False, True, "Hat-trick en Berna."),
    ("2012-06-09", "Brasil", "4-3", 3, "Amistoso", False, True, "Hat-trick a Brasil."),
    ("2014-07-13", "Alemania", "0-1", 0, "Mundial", True, False, "Final del Mundial 2014. Maracaná."),
    ("2015-07-04", "Chile", "0-0 (1-4 p)", 0, "Copa América", True, False, "Final Copa América 2015."),
    ("2016-06-26", "Chile", "0-0 (2-4 p)", 0, "Copa América", True, False, "Final Copa América Centenario. La renuncia."),
    ("2017-10-10", "Ecuador", "3-1", 3, "Eliminatorias", False, True, "Hat-trick en Quito. Clasificación a Rusia."),
    ("2021-06-14", "Chile", "1-1", 1, "Copa América", False, False, None),
    ("2021-06-18", "Uruguay", "1-0", 0, "Copa América", False, True, None),
    ("2021-06-21", "Paraguay", "1-0", 0, "Copa América", False, True, None),
    ("2021-06-28", "Bolivia", "4-1", 2, "Copa América", False, True, None),
    ("2021-07-03", "Ecuador", "3-0", 1, "Copa América", False, True, None),
    ("2021-07-06", "Colombia", "1-1 (3-2 p)", 0, "Copa América", False, True, "Semifinal. Mirá que te como, hermano."),
    ("2021-07-10", "Brasil", "1-0", 0, "Copa América", True, True, "Campeón de América en el Maracaná."),
    ("2021-09-09", "Bolivia", "3-0", 3, "Eliminatorias", False, True, "Hat-trick. Supera a Pelé."),
    ("2022-06-01", "Italia", "3-0", 0, "Finalissima", True, True, "Finalissima en Wembley."),
    ("2022-06-05", "Estonia", "5-0", 5, "Amistoso", False, True, "Cinco goles."),
    ("2022-11-22", "Arabia Saudita", "1-2", 1, "Mundial", False, False, None),
    ("2022-11-26", "México", "2-0", 1, "Mundial", False, True, None),
    ("2022-11-30", "Polonia", "2-0", 0, "Mundial", False, True, None),
    ("2022-12-03", "Australia", "2-1", 1, "Mundial", False, True, "Partido 1000 de su carrera."),
    ("2022-12-09", "Países Bajos", "2-2 (4-3 p)", 1, "Mundial", False, True, None),
    ("2022-12-13", "Croacia", "3-0", 1, "Mundial", False, True, None),
    ("2022-12-18", "Francia", "3-3 (4-2 p)", 2, "Mundial", True, True, "Campeón del Mundo. Lusail."),
    ("2024-06-20", "Canadá", "2-0", 0, "Copa América", False, True, None),
    ("2024-06-25", "Chile", "1-0", 0, "Copa América", False, True, None),
    ("2024-07-04", "Ecuador", "1-1 (4-2 p)", 0, "Copa América", False, True, None),
    ("2024-07-09", "Canadá", "2-0", 1, "Copa América", False, True, None),
    ("2024-07-14", "Colombia", "1-0", 0, "Copa América", True, True, "Bicampeón de América. Miami."),
    ("2026-06-22", "Austria", "2-0", 2, "Mundial", False, True, "Doblete en fase de grupos."),
    ("2026-07-07", "Egipto", "3-2", 1, "Mundial", False, True, "Remontada épica. A cuartos."),
    ("2026-07-19", "España", "0-1", 0, "Mundial", True, False, "Final del Mundial 2026. La última final."),
]

PER_YEAR = {2005:5,2006:8,2007:14,2008:8,2009:10,2010:10,2011:13,2012:9,2013:7,2014:14,2015:11,
            2016:11,2017:7,2018:5,2019:10,2020:4,2021:16,2022:14,2023:8,2024:10,2025:4,2026:9}
GOALS_YEAR = {2005:0,2006:2,2007:6,2008:2,2009:3,2010:2,2011:4,2012:12,2013:6,2014:8,2015:4,2016:8,
              2017:4,2018:4,2019:5,2020:1,2021:9,2022:18,2023:8,2024:6,2025:5,2026:8}
assert sum(PER_YEAR.values()) == 207, sum(PER_YEAR.values())
assert sum(GOALS_YEAR.values()) == 125

# Torneos en cada año (para el relleno). Mundial y Copa sólo donde corresponde.
WC_YEARS = {2006, 2010, 2014, 2018, 2022, 2026}
CA_YEARS = {2007, 2011, 2015, 2016, 2019, 2021, 2024}
ELIM_YEARS = {2007,2008,2009,2011,2012,2013,2015,2016,2017,2020,2021,2022,2023,2024,2025}
CONMEBOL = ["Uruguay","Brasil","Chile","Paraguay","Perú","Colombia","Ecuador","Venezuela","Bolivia"]
FRIENDLY = ["México","Italia","España","Portugal","Alemania","Francia","Inglaterra","Nigeria","Japón",
            "Estados Unidos","Costa Rica","Honduras","Escocia","Noruega","Rusia","Suecia","Croacia",
            "Bosnia","Eslovenia","Singapur","Haití","Emiratos Árabes","Australia","Indonesia","Panamá",
            "Curazao","El Salvador","Guatemala","Jamaica","Marruecos","Irlanda","Hong Kong"]
WC_OPP = {2006:["Costa de Marfil","Países Bajos","México","Alemania"],
          2010:["Nigeria","Corea del Sur","Grecia","México","Alemania"],
          2014:["Bosnia","Irán","Nigeria","Suiza","Bélgica","Países Bajos"],
          2018:["Islandia","Croacia","Nigeria","Francia"],
          2026:["Argelia","Jordania","Cabo Verde","Suiza","Inglaterra"]}
CA_OPP = {2007:["Estados Unidos","Colombia","Paraguay","Perú","México"],
          2011:["Bolivia","Colombia","Costa Rica","Uruguay"],
          2015:["Paraguay","Uruguay","Jamaica","Colombia","Paraguay"],
          2016:["Panamá","Bolivia","Venezuela","Estados Unidos"],
          2019:["Colombia","Paraguay","Qatar","Venezuela","Brasil","Chile"]}

WINDOWS = {("Mundial",2006):("2006-06-10","2006-07-01"),("Mundial",2010):("2010-06-12","2010-07-03"),
           ("Mundial",2014):("2014-06-15","2014-07-09"),("Mundial",2018):("2018-06-16","2018-06-30"),
           ("Copa América",2007):("2007-06-28","2007-07-11"),("Copa América",2011):("2011-07-01","2011-07-16"),
           ("Copa América",2015):("2015-06-13","2015-07-01"),("Copa América",2016):("2016-06-06","2016-06-21"),
           ("Copa América",2019):("2019-06-15","2019-07-06")}

def window_dates(key, n, used):
    lo, hi = (datetime.date.fromisoformat(x) for x in WINDOWS[key])
    span = (hi - lo).days
    out = []
    for i in range(n):
        d = lo + datetime.timedelta(days=round(i * span / max(1, n - 1)))
        while d.isoformat() in used: d += datetime.timedelta(days=1)
        used.add(d.isoformat()); out.append(d.isoformat())
    return out

def rand_date(year, used):
    lo = datetime.date(year, 8, 18) if year == 2005 else datetime.date(year, 1, 20)
    hi = datetime.date(year, 7, 18) if year == 2026 else datetime.date(year, 11, 25)
    while True:
        d = lo + datetime.timedelta(days=random.randint(0, (hi - lo).days))
        if d.isoformat() not in used:
            used.add(d.isoformat())
            return d.isoformat()

def result_for(goals, comp):
    gf = max(goals, random.choice([0,1,1,2,2,2,3,4]) if goals == 0 else goals + random.choice([0,0,1,1,2]))
    ga = random.choice([0,0,0,1,1,2])
    if comp in ("Mundial", "Copa América"):
        ga = min(ga, max(0, gf - 1))  # en torneos, el relleno siempre gana
        if gf == 0: gf, ga = 1, 0
    elif random.random() < 0.12 and gf <= 2:
        ga = gf + 1  # alguna derrota
    return f"{gf}-{ga}", gf > ga

matches = []
used = set(a[0] for a in ANCHORS)
for year in range(2005, 2027):
    anchors = [a for a in ANCHORS if a[0].startswith(str(year))]
    n_fill = PER_YEAR[year] - len(anchors)
    g_fill = GOALS_YEAR[year] - sum(a[3] for a in anchors)
    assert n_fill >= 0 and g_fill >= 0, (year, n_fill, g_fill)
    # repartir goles de relleno
    dist = [0] * n_fill
    for _ in range(g_fill):
        i = random.randrange(n_fill)
        if dist[i] < 3: dist[i] += 1
        else: dist[random.randrange(n_fill)] += 1
    wc = list(WC_OPP.get(year, [])); ca = list(CA_OPP.get(year, []))
    wc_dates = window_dates(("Mundial", year), len(wc), used) if ("Mundial", year) in WINDOWS else []
    ca_dates = window_dates(("Copa América", year), len(ca), used) if ("Copa América", year) in WINDOWS else []
    for a in anchors:
        matches.append(dict(date=a[0], opponent=a[1], result=a[2], goals=a[3], competition=a[4],
                            isFinal=a[5], won=a[6], note=a[7]))
    for i in range(n_fill):
        g = dist[i]
        fixed = None
        if wc:
            comp, opp = "Mundial", wc.pop(0); fixed = wc_dates.pop(0) if wc_dates else None
        elif ca:
            comp, opp = "Copa América", ca.pop(0); fixed = ca_dates.pop(0) if ca_dates else None
        elif year in ELIM_YEARS and random.random() < 0.62:
            comp, opp = "Eliminatorias", random.choice(CONMEBOL)
        else:
            comp, opp = "Amistoso", random.choice(FRIENDLY)
        res, won = result_for(g, comp)
        matches.append(dict(date=fixed or rand_date(year, used), opponent=opp, result=res, goals=g,
                            competition=comp, isFinal=False, won=won, note=None))

matches.sort(key=lambda m: m["date"])
# Mundial 2026: fechas reales del torneo (jun-jul)
order26 = ["Argelia","Austria","Jordania","Cabo Verde","Egipto","Suiza","Inglaterra"]
wc26 = sorted([m for m in matches if m["date"].startswith("2026") and m["competition"] == "Mundial" and not m["isFinal"]], key=lambda m: order26.index(m["opponent"]))
for m in wc26:
    if m["opponent"] == "Egipto": m["note"] = "Remontada épica. A cuartos."
dates26 = ["2026-06-16","2026-06-22","2026-06-27","2026-07-03","2026-07-07","2026-07-11","2026-07-15"]
for m, d in zip(wc26, dates26[-len(wc26):]):
    m["date"] = d
matches.sort(key=lambda m: m["date"])

# Resultados reales conocidos de eliminaciones y cruces (sólo resultado; goles de Messi se mantienen)
OVERRIDES = {("2006","Alemania"):("1-1 (2-4 p)",False),("2006","Países Bajos"):("0-0",False),("2006","México"):("2-1",True),
             ("2006","Costa de Marfil"):("2-1",True),("2010","Alemania"):("0-4",False),("2010","Corea del Sur"):("4-1",True),
             ("2010","Grecia"):("2-0",True),("2010","México"):("3-1",True),("2010","Nigeria"):("1-0",True),
             ("2014","Países Bajos"):("0-0 (4-2 p)",True),("2014","Bélgica"):("1-0",True),("2014","Suiza"):("1-0",True),
             ("2014","Bosnia"):("2-1",True),("2014","Irán"):("1-0",True),("2014","Nigeria"):("3-2",True),
             ("2018","Francia"):("3-4",False),("2018","Islandia"):("1-1",False),("2018","Croacia"):("0-3",False),("2018","Nigeria"):("2-1",True),
             ("2019","Brasil"):("0-2",False),("2019","Chile"):("2-1",True),("2011","Uruguay"):("1-1 (4-5 p)",False),
             ("2015","Paraguay"):("6-1",True),("2016","Estados Unidos"):("4-0",True),("2007","México"):("3-0",True)}
for m in matches:
    k = (m["date"][:4], m["opponent"])
    if k in OVERRIDES and m["competition"] in ("Mundial", "Copa América") and not m["isFinal"]:
        res, won = OVERRIDES[k]
        if int(res.split("-")[0]) >= m["goals"]:
            m["result"], m["won"] = res, won
        else:
            print("skip override", k, m["goals"], file=sys.stderr)

out = []
for i, m in enumerate(matches, 1):
    out.append({"n": i, "date": m["date"], "opponent": m["opponent"], "result": m["result"],
                "goals": m["goals"], "competition": m["competition"], "isFinal": m["isFinal"],
                "won": m["won"], "note": m["note"], "image": None})

assert len(out) == 207 and sum(m["goals"] for m in out) == 125
json.dump(out, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
# compacto por año para el diseño: string de niveles 0-3
by_year = {}
for m in out:
    y = m["date"][:4]; lvl = min(m["goals"], 3)
    by_year.setdefault(y, "")
    by_year[y] += ("F" if m["isFinal"] and m["won"] else "f" if m["isFinal"] else str(lvl))
print(json.dumps(by_year))
print(max(len(v) for v in by_year.values()))
