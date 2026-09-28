# Phenology, GDD Models, and Free Data Sources for a Michigan Hatch Calendar

Research date: 2026-09-28. Scope: biological/climatic cues for aquatic-insect emergence and salmonid/sucker spawning in Michigan rivers, plus the free gridded-weather, GDD, and water-data APIs that could drive a small-grid growing-degree-day (GDD) engine. Live API probes were run from this machine on 2026-09-28 and are labeled as such.

---

## KQ1. Published degree-day / thermal models for aquatic insect emergence (Hexagenia, Ephemerella, Baetis, Brachycentrus, Pteronarcys) and how well air-temperature GDD proxies track water-driven emergence

### Takeaway
There is no published, calibrated air-temperature GDD model for any Michigan hatch; the peer-reviewed literature uses *water* temperature, with lower developmental thresholds around 10°C for Hexagenia (1,806–2,030 DD above 10°C to emergence, Manitoba lake study) and species-specific linear-above-threshold development models (Sweeney/Vannote/Newbold) for stream mayflies. Angler-reported water-temperature triggers (Hendrickson 50–55°F, Grannom ~50°F, Baetis mid-40s°F, Hex 62–65°F on the Au Sable) are the best operational thresholds; an air-GDD engine is a proxy that must be locally calibrated because groundwater-fed Michigan rivers are thermally buffered from air.

### Cited Findings

**Hexagenia limbata (Hex)**
- Development studied under lab thermal regimes of 6–26°C "based on a minimum threshold of 10°C"; degree-days above 10°C accumulated by the three life-history types in Dauphin Lake, Manitoba were 1,848, 2,030 and 1,806 respectively (seven cohorts, three life-history patterns) — [Heise, Flannagan & Galloway 1987, J. N. Am. Benthol. Soc.](https://www.journals.uchicago.edu/doi/10.2307/1467310) (non-Michigan, lake population)
- "Degree day accumulation in the final year before emergence was a better predictor of emergence timing than overall degree day accumulations for the life cycle" — search summary of related Hexagenia life-history studies, [Wiley: Life histories of burrowing mayflies in a northern Canadian reservoir](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1365-2427.1994.tb01143.x) (non-Michigan)
- Subimago emergence "does not occur until water temperatures have reached 20 degrees Celsius"; nymphal stage 14–22 months, up to 30 molts; life cycle traditionally 2 years, 3–4 years in colder regions; peak emergence June–July — [Animal Diversity Web, Hexagenia limbata](https://animaldiversity.org/accounts/Hexagenia_limbata/)
- Michigan-adjacent life cycle study exists for the St. Marys River (between Superior and Huron) — [ScienceDirect: Life cycle of Hexagenia limbata in the St. Marys River](https://www.sciencedirect.com/science/article/abs/pii/S0380133084718600) (abstract not retrievable; no numbers extracted)
- Angler/entomologist observations: hex emerging from "spring fed rivers in early June with water temps in the low 50's" and from lakes "a month later with water temps in the high 60's"; one report of hexes emerging June 20 at 3 pm with air and water both 55°F; the same commenter stressed "water temps in the aggregate have more to do with larval growth/maturity and hatch cycles" than a single threshold — [Troutnut forum: Hex hatch water temperature range](https://www.troutnut.com/topic/8508/Hex-hatch-water-temperature-range)
- Au Sable-specific angling guidance: "When the Au Sable hits 62–65°F consistently, Hex activity is imminent within days"; historical Au Sable peak June 24–28; "monitor water temps on the major rivers starting June 10" — [Michigan Fly Fishing Hub, Michigan Hex Hatch](https://michiganflyfishinghub.com/michigan-hex-hatch.html) (secondary angling source)

**Ephemerella subvaria (Hendrickson)**
- "When water temperature reaches the mid 40's, sporadic Hendrickson emergence will occur... water must reach the 50-55 degree range to trigger prolific emergence"; one angler saw hatching at 46°F; time-of-day shifts with water temp (45–50°F: 3:30–4:30 pm; mid-50s: 1–3 pm; 55–60°F: 5–7 pm); hatch lasts 2–3 weeks regionally but 5–7 days at a given reach; no degree-day figures were cited by any participant — [Troutnut forum: When does a Hatch happen?](https://www.troutnut.com/topic/694/When-does-a-Hatch-happen)
- Hendrickson hatch "begins when stream temperatures reach 50–55°F, typically from late March in southern Pennsylvania and Maryland through mid-May in northern New England and the upper Midwest" — [MidCurrent, Hendrickson field guide](https://midcurrent.com/v2/the-hendrickson-hatch-a-field-guide-to-fishing-the-first-major-mayfly-of-spring/)
- Northern Michigan guide reference for the hatch — [Mangled Fly, Hendrickson Hatch Northern Michigan](https://mangledfly.com/hendrickson-hatch/)

**Stream mayfly synchrony model (Sweeney/Vannote lineage)**
- Newbold, Sweeney & Vannote (1994) modeled eight Piedmont mayfly species with "two sequential life-history stages where development rate in each stage is a linear function of streamwater temperature above a lower threshold, with developmental quiescence occurring when a maximal temperature is exceeded"; simulations "suggest that nearly all development occurs in spring and autumn during periods of roughly equivalent thermal regime at all latitudes" — [J. N. Am. Benthol. Soc. 13(1), A Model for Seasonal Synchrony in Stream Mayflies](https://www.journals.uchicago.edu/doi/10.2307/1467261) (non-Michigan; paywalled, numeric thresholds not retrieved)
- Kolpas, Funk, Jackson & Sweeney (2020) built "a three-stage stochastic individual-based model" for the baetid *Neocloeon triangulifer* driven by average daily water temperature (White Clay Creek, PA, 2007–2013); predicts 3 generations/yr; "an optimally timed quiescent period for larvae (triggered by day length) is shown to enhance synchronization of adult emergence"; warming predicted to desynchronize emergence — [Stroud Water Research Center summary; Ecological Modelling 416:108892, doi 10.1016/j.ecolmodel.2019.108892](https://stroudcenter.org/publications/phenological-modeling-parthenogenetic-mayfly-white-clay-creek/) (non-Michigan)
- Degree-day concept caveat from an MSU thesis on mayfly growth: "the degree-day concept is a useful tool in relating insect growth to thermal regime at intermediate temperatures" but "less accurate at temperatures approaching upper and lower development thresholds" — [MSU thesis (d.lib.msu.edu/etd/654)](https://d.lib.msu.edu/etd/654/OBJ/download)

**Baetis (Blue-Winged Olive)**
- Lab rearing of *Baetis tricaudatus* under escalating regimes (6–26, 12–26, 18–26, 24–26°C) showed maturation time decreasing with warmer regimes — [Springer, Hydrobiologia (BF02373067)](https://link.springer.com/article/10.1007/BF02373067) (non-Michigan)
- Angler threshold: "when the water temperature begins to rise into the mid-forties (45°F), look for hatching to begin" — [Gunnison Insects, Baetis tricaudatus](https://www.gunnisoninsects.org/ephemeroptera/baetis_tricaudatus.html) (Colorado)

**Brachycentrus (Grannom / American Grannom)**
- "Brachycentrus species will hatch when the water stays around 50 degrees for a few days" — [Orvis News, The American Grannom](https://news.orvis.com/fly-fishing/american-grannom-genus-brachycentrus-springtime-gem)
- A degree-day/development study exists for the western *B. occidentalis* under irrigation withdrawals — [Springer, Hydrobiologia 2011](https://link.springer.com/article/10.1007/s10750-011-0875-1) (non-Michigan; thresholds not extracted)

**Pteronarcys (Giant/Salmonfly stoneflies)**
- Idaho river-network study of *P. californica*: "peak emergence never occurred if water temperatures were below 8.4 °C"; August temperature from the NorWeST model explained basin-scale emergence timing (R² = 0.67); authors did not build a degree-day model — [Frontiers in Ecology & Evolution 2023](https://www.frontiersin.org/journals/ecology-and-evolution/articles/10.3389/fevo.2023.804143/full) (non-Michigan)
- Henry's Fork (Idaho) study: emergence "2.8 days earlier with each degree of warming during the weeks preceding emergence", with smaller adults in warmer springs — [ResearchGate: Effect of springtime water temperature on emergence of Pteronarcys californica](https://www.researchgate.net/publication/229532226_Effect_of_springtime_water_temperature_on_the_time_of_emergence_and_size_of_Pteronarcys_californica_in_the_Henry's_Fork_catchment_Idaho_USA) (non-Michigan; from search summary)
- 2025 paper: "Climate change across the air-water interface affects giant salmonfly emergence timing and adult lifespan" — [PubMed 42155418](https://pubmed.ncbi.nlm.nih.gov/42155418/) (non-Michigan; abstract not retrieved)
- Michigan's species *P. dorsata*: univoltine in a warm Virginia stream ("higher water temperatures of longer duration... allowed this species to complete its life cycle in 1 year rather than the 2 to 4 years previously reported") — [Canadian J. Zoology 1983](https://cdnsciencepub.com/doi/abs/10.1139/z83-261); Michigan key — [Aquatic Insects of Michigan, Pteronarcyidae](https://www.aquaticinsects.org/Keys/Plecoptera/id_pom_pteronarcyidae.html)

**Air vs water temperature (proxy validity)**
- Finn et al. 2022 quantified emergence timing and synchronicity along a water-temperature gradient "to assess the sensitivity of these phenological traits to heat accumulation from mid-winter through spring emergence periods" and found "complex species-specific responses" — [Diversity and Distributions, doi 10.1111/ddi.13472](https://onlinelibrary.wiley.com/doi/10.1111/ddi.13472) (montane basin, non-Michigan)
- Mohseni, Stefan & Erickson (1998) nonlinear weekly air→water regression achieved NSC > 0.7 at 573 of 584 USGS stations (98%), RMSE 1.64 ± 0.46°C — [ResearchGate: Estimating Stream Temperature from Air Temperature](https://www.researchgate.net/publication/245300737_Estimating_Stream_Temperature_from_Air_Temperature_Implications_for_Future_Water_Quality)
- "Ground-water inflows, stream shading, and wind sheltering limit the influence of air temperature on stream temperature thereby reducing the slope of the relationship, but do not typically affect the strength of correlation"; weekly/monthly time scales correlate best — [ResearchGate: The Relationship Between Air Temperature and Stream Temperature](https://www.researchgate.net/publication/253295075_The_Relationship_Between_Air_Temperature_and_Stream_Temperature)
- Paired air–water annual amplitude ratios/phase shifts identify "air-coupled", "deep groundwater (buffered from air)", or "shallow groundwater (buffered and phase shifted)" streams — [J. Hydrology 2020](https://www.sciencedirect.com/science/article/abs/pii/S0022169420303899)
- MSU Extension notes it is working with partners on Au Sable thermal resiliency (groundwater-dominated system) — [MSU: Au Sable River resiliency](https://www.canr.msu.edu/news/msu-partners-working-to-improve-au-sable-river-resiliency)

### Inferences
- The scientific consensus base temperature for aquatic insect development is species-specific but clusters near 10°C (50°F) for Hexagenia and in the low single digits °C for spring-emerging stream mayflies (Newbold/Sweeney model uses a per-species lower threshold, not a universal one). A base-50°F air GDD is therefore a reasonable *first-order* proxy for Hex; for April–May hatches (Hendrickson, Grannom, Baetis) a lower base (32–42°F) will accumulate signal earlier and likely track water warming better.
- Because Michigan trout rivers (Au Sable, Manistee, Pere Marquette) are groundwater-buffered, air-GDD-to-emergence relationships will have a flatter slope and a lag relative to air-coupled rivers; per-river calibration offsets are mandatory, and USGS water-temperature gauges (KQ4) should be used to fit those offsets.
- The strongest published quantitative anchors usable now are: Hex ≈ 1,800–2,000 DD above 10°C water (final-year accumulation matters most) and emergence only after water ≥ 20°C; salmonfly no emergence below 8.4°C; Hendrickson 10–13°C water.

### Gaps
- No peer-reviewed degree-day threshold for *Ephemerella subvaria*, *Brachycentrus* spp., *Pteronarcys dorsata*, or Michigan *Baetis* was found; the numbers above are angler observations.
- Numeric lower/upper thresholds from Newbold et al. 1994 and Kolpas et al. 2020 were not retrievable (paywalled abstracts).
- No study was found that directly regresses Michigan hatch dates on air-temperature GDD; the proxy validity remains inferred from air–water temperature literature.

---

## KQ2. Phenological proxies (lilac, dogwood, apple blossom, tag alder/popple leaf-out) and whether they hold scientifically

### Takeaway
Plant-bloom "hatch indicators" are folk phenology, but they rest on a real mechanism: both plant events and insect emergence are driven by accumulated heat, and USA-NPN's Spring Index lilac/honeysuckle models are themselves temperature-accumulation models run on 4 km PRISM/2.5 km URMA grids, so a lilac-bloom layer is available as a free, gridded, scientifically-modeled proxy.

### Cited Findings
- Fly fishers have noticed hatches "appear at the same time that particular plants bloom"; the Blue Quill "usually appears at the time the forsythia is ready to bloom, around April 12 in central Pennsylvania"; "on warm springs the hatch appears earlier—and so does the flower"; "when the domestic rhododendron first blooms the Brown Drake usually appears" — [Kaweah Fly Fishers, Match the Hatch to the Flower](http://www.kaweahflyfishers.org/match-the-hatch-to-the-flower/) (anecdotal)
- A New England writer pairs Hendricksons with honeysuckle leaf-out ("when the Hendrickson mayflies first appear, the honeysuckle shrubs along the riverbanks are beginning to leaf out"), dark blue sedge with maple color shift, pumpkin caddis (*Pycnopsyche*) with first autumn maple color, while admitting uncertainty "whether or not such pairings of flora and fauna are consistent from one locale to another" — [Northern Woodlands, The Hatch (Thomas Ames Jr.)](https://northernwoodlands.org/articles/article/the-hatch)
- Great Lakes sucker-run folk rule: "As soon as the popple leaves were as big as a quarter, the suckers would be running" (tribal source notes this timing "changed 15 years ago") — [IJC, Tracking the Sucker Run](https://ijc.org/en/tracking-sucker-run-how-great-lakes-fish-sustains-food-webs)
- USA-NPN Spring Index (lilac/honeysuckle first leaf, first bloom): "Primary inputs to the model are temperature and weather events, beginning January 1 of each year"; 4 km maps from PRISM, with NCEP URMA alternative 2016–present; historical coverage 1981–2025 (first leaf/bloom) and extended records 1880–2013; validation dashboard compares predictions to Nature's Notebook lilac observations — [USA-NPN Spring Index maps](http://www.usanpn.org/data/maps/spring)
- Cloned lilac/honeysuckle monitoring began in the late 1950s (western US) and early 1960s (eastern US) specifically to supplement weather observations in agricultural forecasts — [Scientific Data 2015, lilac and honeysuckle phenology 1956–2014](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4520215/)
- Turf/ornamental industry uses plant phenological indicators to time pest emergence (the same principle) — [Advanced Turf Solutions](https://www.advancedturf.com/resources/predict-pest-emergence-with-phenological-indicators/)

### Inferences
- Plant indicators are valid to the extent both organisms integrate the same heat sum; they break down where the insect's habitat is thermally decoupled from the air (groundwater-fed rivers, lakes for Hex). Expect lilac/apple to track Hendrickson/Grannom (air-coupled spring) far better than Hex (needs 20°C water in a buffered river).
- Practical implementation: display NPN Spring Index "first bloom" status per grid cell as a secondary "indicator" cue next to GDD, rather than as the primary model.

### Gaps
- No search result documented specific Michigan pairings for "tag alder leaf-out", "dogwood", or "apple blossom" with named hatches; these remain oral tradition without a written source found here.
- No study quantifies the error (days) of plant-indicator predictions for aquatic insect hatches.

---

## KQ3. Water-temperature triggers and run-timing cues for Michigan steelhead, Chinook, coho, pink, Atlantic salmon, brown and brook trout, white/longnose suckers

### Takeaway
Water temperature is the documented primary cue for Michigan steelhead movement (movement probability rises above a threshold; Pere Marquette peak activity above 7°C, ladder passage above 9°C, flow adds little in the published model), spring steelhead spawn at roughly 40–43°F, salmon enter rivers as water cools into the 60s°F (Sept–Nov), brown/brook trout spawn Sept–Nov at ~6–9°C, and suckers run at ~43–45°F (~7°C) from mid-March (south) to early May (north).

### Cited Findings

**Steelhead**
- Workman, Hayes & Coon (2002), 28 radio-tagged steelhead on the Pere Marquette plus 5,876–10,083 camera-recorded fishway passages/yr on the St. Joseph (1993–1999): "the probability of movement increased with increasing water temperatures above a movement-threshold water temperature"; "the power function resulted in the closest fit"; stream flow "did not add substantially to the model's ability to describe the migratory behavior" — [Transactions AFS 131:463 (OUP)](https://academic.oup.com/tafs/article/131/3/463/7891291)
- Snell, Coon & Hayes (GLFC 2001, Pere Marquette): all steelhead captured at ≥3°C and 65% at ≥7°C (2000); in 2001 all above 2.5°C and 72% at ≥7°C; first tagged fish ascended the Custer ladder 10 April 2001 at 9.5°C; "most fish... moved upstream through the ladder when water temperature was above 9°C, and remained stable or was on the increase"; "fish appeared to be triggered to migrate when water temperature was steady or increasing, with the peak of activity occurring when water temperatures exceeded 7°C"; spring mean discharge 914 cfs historic — [GLFC project completion report (PDF)](https://www.glfc.org/pubs/pdfs/research/reports/Snell_Coon.pdf)
- Michigan DNR: "Lake steelhead enter their spawning streams from late October to early May... spawning does not occur until spring. The fall-run fish are typically the first to spawn, often in March, followed by the spring run fish in April"; eggs hatch in 4–7 weeks depending on temperature — [Michigan DNR, Steelhead](https://www.michigan.gov/dnr/education/michigan-species/fish-species/steelhead)
- Angling-press thresholds: fall-run fish can spawn at 34–39°F; "spring steelhead spawn heavily in the 40°F to 43°F range"; 36–44°F "optimal, depending on strain" — [Great Lakes Angler, Finding Veins of Silver (Matt Straw)](https://www.glangler.com/blogs/articles/finding-veins-of-silver-optimum-conditions-for-steelhead-matt-straw) (secondary)
- "Lengthening days and rising water temperatures activate fish that have been holding in rivers all winter and draw fresh runs" — [Swing the Fly, Great Lakes Run Timing](https://swingthefly.com/great-lakes-run-timing/) (secondary)

**Chinook and coho**
- MSU Extension quoting DNR fisheries biologists: water temperatures in the 60s°F trigger salmon to come upstream; end of a dry spell (rain/flow) puts fish on the move — [MSU Extension, End of dry spell could put salmon on the move](https://www.canr.msu.edu/news/end_of_dry_spell_could_put_salmon_on_the_move) (search summary; page body not retrievable)
- Michigan DNR: "Depending on the tributary, coho spawning runs occur from early September to November"; fish stage in Platte Bay before running — [Michigan DNR, Coho](https://www.michigan.gov/dnr/education/michigan-species/fish-species/coho-salmon)
- Chinook "preferring somewhat cooler water temperatures than coho" — [Michigan DNR, Chinook](https://www.michigan.gov/dnr/education/michigan-species/fish-species/chinook-salmon)
- Secondary guides: Chinook enter as early as late August, peak late Sept–mid Oct, into November; coho first fish mid-September, peak mid–late October; "optimum migration temperature of 57–61°F" — [Michigan Fishing Guide, Fall Salmon Run](https://www.michiganfishing.guide/guides/fall-salmon-run-michigan/) (unverified secondary)

**Pink salmon**
- "Pink salmon spawning runs begin in the summer in the Great Lakes when they ascend the small streams and rivers of their origin"; eggs hatch late Dec–late Feb depending on water temperature — [Michigan DNR, Pink salmon](https://www.michigan.gov/dnr/education/michigan-species/fish-species/pink-salmon)
- Runs largest in odd years, Aug–Sept, Lake Huron/Superior tributaries — [Yooper Webcam MI fishing database, Pink salmon](https://yooperwebcam.com/fishing-database-mi/pink-salmon/) (secondary); preferred temperature 5.6–14.6°C, optimum 10.1°C — [Wikipedia, Pink salmon](https://en.wikipedia.org/wiki/Pink_salmon)

**Atlantic salmon**
- "Fall returns of spawning fish occur at each location, primarily in Oct."; the St. Marys "run typically begins in mid-summer and runs until November when spawning commences"; iteroparous — [Michigan DNR, Atlantic salmon](https://www.michigan.gov/dnr/education/michigan-species/fish-species/atlantic-salmon)
- DNR Fisheries Report 17 reviews Atlantic salmon attributes; St. Marys reaches 8°C late May/early June (smoltification cue) — [Michigan DNR Fisheries Report FR017 (PDF)](https://www.michigandnr.com/publications/pdfs/DNRFishLibrary/FisheriesReports/FR017.pdf)

**Brown and brook trout**
- Brown trout "spawn in tributary streams in September and October"; prefer 50–65°F; lake-run fish stage at stream outlets late summer — [Michigan DNR, Brown trout](https://www.michigan.gov/dnr/education/michigan-species/fish-species/brown-trout)
- Brook trout "spawning generally occurs in the months of October and November"; incubation 3–4 months depending on water temperature — [Michigan DNR, Brook trout](https://www.michigan.gov/dnr/education/michigan-species/fish-species/brook-trout)
- Brown trout spawn Oct–Dec at 6.0–8.9°C (Spearfish Creek, SD) — [SCIRP 2020](https://www.scirp.org/journal/paperinformation?paperid=99543) (non-Michigan); highest redd counts at 9°C in a southeastern US tailwater study — [Holbrook & Bettoli 2006 (PDF)](https://usgs-cru-individual-data.s3.amazonaws.com/pbettoli/tech_publications/Holbrook%20and%20Bettoli%202006_Final%20Report_Brown%20Trout%20Reproduction-1.pdf) (non-Michigan)
- Migration begins when temperatures drop to ~12°C "and the photoperiod... and water levels are right"; spawning at 7–9°C — [Guide Recommended, When do Brown Trout Spawn](https://guiderecommended.com/when-do-brown-trout-spawn/) (secondary)

**White and longnose suckers**
- Michigan Sea Grant (West Michigan creek-monitoring program): white and longnose suckers "are responding to a temperature cue of 43.3°F" to initiate runs; temperature and flow both cues — [Michigan Sea Grant blog, March 20 2025](https://www.michiganseagrant.org/blog/2025/03/20/spring-brings-spawning-fish-into-west-michigan-streams-and-you-can-help-to-monitor-spawning-runs-in-local-creeks/) (from search summary; page returned 403 on fetch)
- Suckers "start spawning in early April when the water reaches 7 degrees C (45 degrees F)" — [Wisconsin Sea Grant, Quiet time with the fish](https://www.seagrant.wisc.edu/blog/quiet-time-with-the-fish-spring-is-the-time-for-fish-watching/)
- White sucker runs "may begin in mid-March in southern Michigan, or as late as early May in the north"; longnose runs usually later (mid-April to early May) — search summary citing [Michigan DNR, Common carp and suckers](https://www.michigan.gov/dnr/education/michigan-species/fish-species/carp-suckers) and [IJC](https://ijc.org/en/tracking-sucker-run-how-great-lakes-fish-sustains-food-webs); DNR page confirms suckers "begin their upriver spawning runs, often before the ice is off of inland lakes"
- Great Lakes tributary study: "spring flow and temperature may be important determinants of egg survival to larval outmigration" — [Childress et al. 2016, Ecology of Freshwater Fish](https://onlinelibrary.wiley.com/doi/10.1111/eff.12220)
- Shedd Aquarium runs a multi-tributary sucker migration study — [Shedd Research](https://www.sheddaquarium.org/care-and-conservation/shedd-research/investigating-great-lakes-sucker-migrations) (page 403 on fetch)

### Inferences
- For a fish-run module, model steelhead as a probability curve of upstream movement vs. water temperature (power function above ~3°C, steep above 7–9°C, rising or stable temperature), with rain/discharge used only as a secondary "fresh fish" modifier per the published finding that flow added little.
- Fall salmon timing is best modeled as a *cooling* threshold (water falling into the low 60s°F) plus rain events, i.e., inverse of spring GDD accumulation; a "cooling degree-day" or first-date-below-threshold approach from USGS water temperature is more defensible than air GDD.
- Sucker runs are the best early-spring sentinel: a 7°C water threshold in late March–April, typically preceding Hendricksons (10–13°C).

### Gaps
- Numeric movement-threshold values from Workman et al. 2002 (the model's fitted threshold for each river) were not retrievable from the abstract; the GLFC report gives observational thresholds only.
- No Michigan DNR document was found giving explicit Chinook/coho spawning-temperature ranges; the 57–61°F figure is from an unverified secondary guide.
- No published run-timing model tied to photoperiod for Michigan salmonids was located.

---

## KQ4. Inventory of free GDD calculators, gridded temperature datasets and APIs (resolution, base temps, licensing, limits, history + forecast)

### Takeaway
For a small-grid Michigan GDD engine with history and forecast, the free, commercially usable stack is: USA-NPN AGDD (2.5 km NCEP URMA/NDFD, base 32/50°F, Jan 1 start, 6-day forecast, CC BY 4.0; custom-base point queries exist but the endpoint is not publicly reachable from this network), gridMET (4 km, 1979–yesterday, CC0), NClimGrid-Daily (5 km, 1951–present, 2–3 day lag, NOAA public), Daymet (1 km, 1980–previous full year), Open-Meteo (HRRR 3 km archive since 2018 plus 16-day forecasts, CC BY 4.0, but commercial sites need a paid plan), and api.weather.gov (2.5 km NDFD forecast, free). PRISM's daily 4 km data are freely redistributable with attribution per the terms page, but its order page warns commercial use requires prior arrangement, so flag it.

### Cited Findings

**MSU Enviroweather (enviroweather.msu.edu)**
- Network of Michigan weather stations; GDD (base 50°F) tool and Temperature/Rainfall/Degree-day summary pages exist — [Enviroweather GDD tool](https://enviroweather.msu.edu/weathermodels/growingdegreedays); [weather summary](https://enviroweather.msu.edu/weathermodels/weathersummary)
- Degree-day maps show accumulated base-50 GDD "across Michigan from March 1 to the present"; maps use NOAA/NWS URMA gridded data "with a spatial resolution of approximately 1.5 miles" and PRISM 1981–2010 normals — [MSU Extension, New growing degree-day maps on Enviro-weather](https://www.canr.msu.edu/news/new_growing_degree_day_maps_on_enviro_weather) and [Improved degree-day maps](https://www.canr.msu.edu/news/improved_degree_day_maps_on_enviroweather)
- Data access is via station pages and "data on demand" downloads — [MSU Extension, Accessing growing degree days with Enviro-weather](https://www.canr.msu.edu/news/accessing_growing_degree_days_with_enviro_weather)
- Live probe 2026-09-28: `https://enviroweather.msu.edu/api/` returns HTTP 200 but only a JavaScript app shell ("This webpage requires javascript to run"); `/api/stations` and `/ewx/api/stations` return 404. No public API documentation or terms page was found.

**MSU GDD Tracker (turf)**
- gddtracker.msu.edu covers MI, IN, IL, OH; "database updates each evening with the previous days data and a new five day forecast"; multiple turf models; crabgrass model uses base 32°F; zip-code based — [GDD Tracker 4.0](https://gddtracker.msu.edu/) and [About](https://gddtracker.msu.edu/about)

**USA National Phenology Network AGDD**
- Daily AGDD maps, January 1 start, base 32°F and 50°F; daily update; "each day of the current year, plus six days into the future, at a 2.5 km resolution"; built from NOAA NCEP RTMA/URMA and NDFD; PRISM-based 4 km versions used for 30-year normals/anomalies; GeoTIFF/NetCDF/ArcGrid via Geoserver — [USA-NPN AGDD products](https://www.usanpn.org/data/maps/AGDD); [USA-NPN report on AGDD & SI-x (PDF)](https://www.usanpn.org/files/reports/usa-npn_agdd-and-six.pdf)
- Geoserver layers: `gdd:agdd` (32°F), `gdd:agdd_50f`, `gdd:30yr_avg_agdd`, `gdd:agdd_anomaly`; WMS `https://geoserver.usanpn.org/geoserver/gdd/wms?service=WMS&request=GetMap&layers=gdd:agdd&time=YYYY-M-D&bbox=...&srs=EPSG:4269&format=image/png`; WCS `.../gdd/wcs?service=WCS&version=2.0.1&request=GetCoverage&CoverageId=gdd:agdd_50f&subset=http://www.opengis.net/def/axis/OGC/0/time("YYYY-MM-DDT00:00:00.000Z")&format=image/geotiff`; daily sum = ((tmin+tmax)/2) − base, negatives zeroed; temporal range 2016-01-01 to 6-day forecast — [NPN Geoserver documentation](https://docs.google.com/document/d/1jDqeh8k30t0vEBAJu2ODiipaofLZ2PFgsaNzhhzz3xg/pub)
- Geoservices (custom base) routes from the open-source swagger: `/v1/agdd/simple/pointTimeSeries` (params `climateProvider` = NCEP|PRISM, `temperatureUnit`, `startDate`, `endDate`, `base` "for example 12", `latitude`, `longitude`, optional `agddThreshold`), `/v1/agdd/double-sine/pointTimeSeries` (adds `upperThreshold`), `/v1/agdd/simple/map`, `/v1/agdd/simple/pointTimeSeries/30YearAvg`, `/v1/climate/pointTimeSeries` (`climateVariable` = tmin|tmax|tavg|precip), plus `/agdd/area/statistics` and Spring Index `/si-x/...`; "NCEP available from 2016 on, PRISM available from 1981 through previous year" — [usa-npn/npn-geo-services swagger.yaml](https://raw.githubusercontent.com/usa-npn/npn-geo-services/master/api/swagger/swagger.yaml); R wrapper documents `npn_get_custom_agdd_raster()` with `method='double-sine'`, `base_temp`, `upper_threshold`, `climate_data_source` — [rnpn geospatial vignette](https://cran.r-project.org/web/packages/rnpn/vignettes/VI_geospatial.html); detailed spec in [USGS OFR 2017-1003](https://pubs.usgs.gov/of/2017/1003/ofr20171003.pdf)
- Live probe 2026-09-28: `https://data.usanpn.org/geoservices/v1/agdd/simple/pointTimeSeries?...` returned 404 and `https://data.usanpn.org:3006/v1/...` timed out from this network; the Geoserver WMS/WCS host is the documented public path.
- License: data "openly and universally available to all users, under a Creative Commons – Attribution 4.0 International (CC BY 4.0) license, enabling users to share and adapt the data for any purpose"; raster acknowledgment "Data were provided by the USA National Phenology Network" — [USA-NPN data use policy](http://www.usanpn.org/about/terms)

**NOAA NWS gridded analyses (NDFD / RTMA / URMA)**
- NDFD grids at 2.5 km since 28 Aug 2012 — [NWS notice (PDF)](https://www.weather.gov/media/notification/pdfs/pns12ndfd_exp_2.5km_grids.pdf); RTMA/URMA "horizontal grid-spacing of 2.5 km for all domains except Alaska (3 km)"; RTMA hourly, URMA hourly "with a six hour time delay to capture late arriving data" — [NCEP EMC RTMA/URMA](https://emc.ncep.noaa.gov/emc/pages/numerical_forecast_systems/rtma.php); open GRIB2 on AWS — [Registry of Open Data, NOAA RTMA/URMA](https://registry.opendata.aws/noaa-rtma/)
- api.weather.gov: `/points/{lat},{lon}` → `/gridpoints/{office}/{gridX},{gridY}/forecast`; ~2.5 km grid; 7-day forecast (12-hour and hourly); User-Agent header required; undisclosed "generous" rate limit; observations via `/stations/.../observations` delayed up to 20 min; "All of the information presented via the API is intended to be open data, free to use for any purpose"; GeoJSON default — [NWS API documentation](https://www.weather.gov/documentation/services-web-api)

**NOAA NClimGrid-Daily**
- 1/24° (~5 km) CONUS, Tmax/Tmin/Tavg/Prcp, 1 Jan 1951–present; preliminary values arrive "two to three days after the observation date", finalized around the 4th of the following month; NetCDF monthly bundles; HTTPS `https://www.ncei.noaa.gov/data/nclimgrid-daily/`, THREDDS `https://www.ncei.noaa.gov/thredds/catalog/nclimgrid-daily/catalog.html`; single-point values "inherently uncertain" — [NCEI nClimGrid-Daily](https://www.ncei.noaa.gov/products/land-based-station/nclimgrid-daily); also on AWS — [Registry of Open Data](https://registry.opendata.aws/noaa-nclimgrid/)

**NOAA Climate Data Online (station data)**
- `https://www.ncei.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&datatypeid=TMAX,TMIN&stationid=...&startdate=&enddate=`; token required; "five requests per second and 10,000 requests per day"; max 1,000 records/request, one-year span for daily data — [CDO Web Services v2](https://www.ncei.noaa.gov/cdo-web/webservices/v2)

**PRISM (Oregon State)**
- Terms page: "All data (gridded, polygon, tabular, graphical) retrieved from this website... may be freely reproduced and distributed" with attribution "PRISM Group, Oregon State University, https://prism.oregonstate.edu, accessed [date]"; no explicit commercial clause on that page — [PRISM terms of use](https://prism.oregonstate.edu/terms/)
- Order page for high-resolution data: "commercial use is strictly prohibited unless you have made special arrangements in advance" — [PRISM orders](https://prism.oregonstate.edu/orders/); ClimateEngine states PRISM is "available without restriction on use or distribution" with attribution — [ClimateEngine PRISM Daily 4km](https://www.climateengine.org/datasets/climatehydrology/prism_daily_4000/)
- Live probe 2026-09-28: `https://services.nacse.org/prism/data/get/us/4km/tmax/20260601` returns HTTP 200 with `prism_tmax_us_25m_20260601.zip` (daily 4 km grid, ~800 m "25m" arc-second naming), confirming the web service is up.

**Daymet (ORNL DAAC)**
- 1 km × 1 km daily tmax/tmin/prcp/srad/vp/swe/dayl, North America 1980–present (latest full calendar year), GHCN-Daily inputs; Daymet V4 R1 — [Daymet overview](https://daymet.ornl.gov/overview)
- Single Pixel API: `https://daymet.ornl.gov/single-pixel/api/data?lat=44.66&lon=-84.71&vars=tmax,tmin&start=YYYY-MM-DD&end=YYYY-MM-DD`; citation required (DOI 10.3334/ORNLDAAC/2361); no rate limits published — [Daymet web services](https://daymet.ornl.gov/web_services)
- Live probe 2026-09-28: the query above returned data through 2025-12-31 (e.g., 2025 yday 365 tmax −6.48°C, tmin −11.18°C) and cited "Version 4 R1... https://doi.org/10.3334/ORNLDAAC/2129"; 2026 not yet available, i.e., no current-season data.

**gridMET (Univ. of California Merced / Climatology Lab)**
- ~4 km (1/24°) CONUS, 1979–present; tmmx/tmmn; last 60 days preliminary; uses PRISM plus CFSv2 for the most recent day; NetCDF, THREDDS/OPeNDAP, ClimateEngine, USGS GDP zarr; license "Creative Commons CC0" public domain, commercial use permitted — [gridMET](https://www.climatologylab.org/gridmet.html)
- Live probe 2026-09-28: `http://thredds.northwestknowledge.net:8080/thredds/catalog/MET/tmmx/catalog.html` returned HTTP 200.

**Open-Meteo**
- Historical Weather API (`https://archive-api.open-meteo.com/v1/archive?latitude=&longitude=&start_date=&end_date=&daily=temperature_2m_max,temperature_2m_min`): ERA5 0.25° (~25 km, 1940–), ERA5-Land 0.1° (~11 km, 1950–), ECMWF IFS 9 km (2017–); ERA5 updates daily with ~5-day delay — [Historical Weather API docs](https://open-meteo.com/en/docs/historical-weather-api)
- Historical Forecast API (`historical-forecast-api.open-meteo.com`): archived high-resolution forecasts; HRRR 3 km back to January 2018, IFS HRES to Jan 2017, most models ~2022+ — [Historical Forecast API docs](https://open-meteo.com/en/docs/historical-forecast-api)
- Forecast API: US models GFS, HRRR (3 km), NBM, NAM, ECMWF IFS; up to 16 days forecast; `past_days` up to 92; `temperature_unit=fahrenheit`; 90 m DEM statistical downscaling — [Forecast API docs](https://open-meteo.com/en/docs)
- Terms: non-commercial free use "less than 10'000 API calls per day, 5'000 per hour and 600 per minute"; commercial = "websites/apps with subscriptions or advertisements, integration into commercial products"; data CC BY 4.0; paid tiers 1M / 5M / >50M calls per month (prices not on page; Stripe checkout) — [Open-Meteo terms](https://open-meteo.com/en/terms); [pricing](https://open-meteo.com/en/pricing) (free tier also capped at 300,000 calls/month)

**NASA POWER**
- `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M_MAX,T2M_MIN&community=AG&longitude=-84.71&latitude=44.66&start=YYYYMMDD&end=YYYYMMDD&format=JSON`; 0.5° grid; daily from 1981 to near-real-time; max 20 parameters per request; repeated identical requests may be blocked — [NASA POWER daily API docs](https://power.larc.nasa.gov/docs/services/api/temporal/daily/)

**Cornell NEWA**
- Degree-day calculator using physical station data with selectable base temperature and formula — [NEWA Degree Day Calculator](https://newa.cornell.edu/degree-day-calculator); as of 2015, 329 stations in 16 states, Michigan not listed — [NEWA 2017 review (Cornell eCommons)](https://ecommons.cornell.edu/server/api/core/bitstreams/87ca4fd8-9186-4b0e-bc03-6ea6714e0e54/content)

**Midwestern Regional Climate Center cli-MATE**
- Free account required; GDD, modified GDD, stress DD, freezing DD "customizable for non-standard degree day bases and start dates"; web portal, no API documented — [MRCC Ag Climate Dashboard tools](https://www.mrcc.purdue.edu/ag-climate-dashboard-tools); [Navigating cli-MATE (PDF)](https://mrcc.purdue.edu/CLIMATE/productGuide.pdf)

**GLISA / GLERL**
- GLISA's Great Lakes Adaptation Data Suite integrates NCEI, GLOS, GLERL, NCEP and USGS datasets — [GLISA GLADS](https://glisa.umich.edu/glads-interface/); GLERL CoastWatch GLSEA daily satellite lake-surface temperature, yearly downloads at `https://coastwatch.glerl.noaa.gov/statistic/` — [GLSEA](https://coastwatch.glerl.noaa.gov/satellite-data-products/great-lakes-surface-environmental-analysis-glsea/)

**Wisconsin AgWeather** (neighboring reference implementation of a multi-base degree-day calculator) — [UW AgWeather Degree Day Calculator](https://agweather.cals.wisc.edu/thermal-models/degree-days)

### Inferences
- Only three sources offer *current-season* daily grids at ≤5 km with permissive terms: USA-NPN (2.5 km, precomputed base 32/50 and six-day forecast, CC BY), gridMET (4 km, ~1-day lag, CC0) and NClimGrid-Daily (5 km, 2–3-day lag, NOAA). Daymet is 1 km but lags a full year, so it is a calibration/normals dataset, not an operational feed.
- Custom bases (42/45°F) and upper cutoffs (86°F) require computing GDD yourself from tmin/tmax grids (gridMET or NClimGrid) or using NPN's double-sine geoservice if it can be reached; NPN Geoserver only serves base 32 and 50.
- Forecast extension beyond NPN's 6 days: api.weather.gov (7 days, 2.5 km, free) or Open-Meteo (16 days, HRRR/NBM, paid for an ad/subscription site).
- PRISM licensing is ambiguous (terms page permissive, order page restrictive); prefer gridMET (which is PRISM-derived but CC0) for commercial deployment, or obtain written permission from PRISM.

### Gaps
- No public documentation or terms for an Enviroweather API were found; contact MSU Enviroweather to confirm station-data access rights for a commercial site.
- NPN geoservices custom-AGDD endpoint could not be reached (404/timeout) to confirm live availability or rate limits.
- Open-Meteo paid tier prices were not shown on the pricing page.
- No published rate limits for USA-NPN Geoserver, Daymet, or gridMET THREDDS.

---

## KQ5. Water temperature and discharge data sources for Michigan rivers (USGS NWIS/OGC API, Water Quality Portal, GLERL, EGLE/DNR, citizen loggers)

### Takeaway
USGS provides real-time water temperature (parameter 00010) at 63 active Michigan stream sites (live query 2026-09-28) including nine on the Au Sable system, six on the Manistee, five on the Muskegon, plus St. Joseph at Niles and Grand at Grand Rapids; the Pere Marquette, Boardman and Two Hearted currently report discharge/stage only. Both the legacy `waterservices.usgs.gov` and the new OGC `api.waterdata.usgs.gov/ogcapi` endpoints work; discrete data are in the Water Quality Portal; DNR/angler logger networks exist but have no public API.

### Cited Findings

**USGS APIs**
- Legacy instantaneous values: `https://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=mi&parameterCd=00010&siteStatus=active&siteType=ST` — live probe 2026-09-28 returned 63 active Michigan stream sites with water temperature. Legacy daily values `https://waterservices.usgs.gov/nwis/dv/?format=json&sites=04136500&parameterCd=00010,00060&startDT=...&endDT=...` returned HTTP 200. USGS says the legacy Water Services API "remains available... though the newer OGC-compliant endpoints are recommended for new development" — [USGS Water Data APIs](https://api.waterdata.usgs.gov/docs/)
- New OGC API: collections `latest-continuous`, `continuous`, `latest-daily`, `daily`, `monitoring-locations`, `parameter-codes`, etc. (live listing of `https://api.waterdata.usgs.gov/ogcapi/v0/collections`); API key optional but "gives you access to higher rate limits" via `/signup/` — [USGS Water Data APIs](https://api.waterdata.usgs.gov/docs/)
- Working example (live 2026-09-28): `https://api.waterdata.usgs.gov/ogcapi/v1/collections/daily/items?f=json&monitoring_location_id=USGS-04136500&parameter_code=00010&time=2026-06-20/2026-06-30` returned daily max/min/mean (statistic_id 00001/00002/00003) in degC with approval_status "Provisional", e.g., Au Sable at Mio 2026-06-22 max 18.5°C, mean 17.3°C; CSV available with `f=csv`; site metadata `.../collections/monitoring-locations/items?f=json&state_code=26&site_type_code=ST`.
- Water Quality Portal (discrete samples; NWIS + EPA WQX + USDA STEWARDS): `https://waterqualitydata.us/data/Result/search?statecode=US%3A26&characteristicName=Temperature%2C%20water&siteType=Stream&startDateLo=MM-DD-YYYY&mimeType=csv&zip=yes`; Station and summary services likewise; no explicit rate limits — [WQP web services documentation](https://www.waterqualitydata.us/webservices_documentation/)

**Michigan USGS sites reporting water temperature (00010), live query 2026-09-28 (site no. | name)**
- Au Sable system: 04135700 South Branch Au Sable nr Luzerne; 04135800 North Branch Au Sable at Kelloggs Br nr Lovells; 04136000 Au Sable nr Red Oak; 04136500 Au Sable at Mio; 04136900 nr McKinley; 04137005 nr Curtisville; 04137020 nr South Branch; 04137025 nr Glennie; 04137030 nr Sidtown; 04137500 nr Au Sable — [USGS 04136500 Au Sable at Mio](https://waterdata.usgs.gov/monitoring-location/USGS-04136500/)
- Manistee system: 04123500 Manistee nr Grayling; 04124000 nr Sherman; 04124200 nr Mesick; 04125460 Pine River at High School Bridge nr Hoxeyville; 04125550 Manistee nr Wellston; 04126195 Little Manistee at Nine Mile Bridge nr Freesoil
- Muskegon system: 04121650 Big Rapids; 04121660 nr Stanwood; 04121680 nr Oxbow; 04121944 Little Muskegon nr Oak Grove; 04121970 nr Croton
- St. Joseph basin: 04101500 St. Joseph at Niles; 04101590 Dowagiac Creek nr Dowagiac; 04097345 Portage River at Three Rivers; 040970647 Little Portage Cr at Mendon; 0409754132 Spring Creek nr Centreville; 041015313 Osborn Drain nr Glenwood; 04096590 Hog Creek at Hodunk
- Grand/Kalamazoo/others: 04118564 Grand River at Grand Rapids; 04108660 Kalamazoo at New Richmond; 04108862 Pigeon River nr Olive Center; 041035285 Dickinson Creek nr Ceresco; 04142000 Rifle River nr Sterling (last value 2024-10-08); 04154612 Wolf Creek nr Vestaburg; 04157005 Saginaw River at Saginaw
- Upper Peninsula: 04001000 Washington Creek at Windigo; 04032150 Presque Isle River nr Connorville; 040325155 Mineral River nr Silver City; 04041500 Sturgeon River nr Alston; 04043016 Pilgrim River nr Dodgeville; 04043097 Falls River nr L'Anse; 04043140 Gomanche Creek nr L'Anse; 04043165 Slate River nr Skanee; 04043170 Ravine River nr Skanee; 04043238 Salmon Trout River nr Big Bay; 04043244 East Branch Salmon Trout nr Dodge City; 04044755 Miners River nr Munising (stale, last 2026-06-11); 04057800 and 04057801 Middle Branch Escanaba at Humboldt; 04059000 Escanaba River at Cornell
- Southeast Michigan: 04161820 Clinton River at Sterling Heights; 04165500 Clinton at Mt. Clemens; 04162010 Red Run nr Warren; 04166100 River Rouge at Southfield; 04166450 Bell Branch at Redford; 04166500 Rouge at Detroit; 04167625 Lower Rouge at Wayne; 04168400 Lower Rouge at Dearborn; 04174500 Huron at Ann Arbor (last value 2013); 04176500 River Raisin nr Monroe (last 2024-10-01); 04166700 and 04167150 (stale 2017)
- Not in the water-temperature list (discharge/stage only): Pere Marquette at Scottville 04122500 and at M-37 nr Baldwin 04122300 — [USGS 04122500](https://waterdata.usgs.gov/monitoring-location/USGS-04122500/); [USGS 04122300](https://waterdata.usgs.gov/monitoring-location/USGS-04122300/); Boardman and Two Hearted did not appear in the temperature query. State overview — [USGS Michigan water conditions](https://waterdata.usgs.gov/state/michigan/)
- Michigan Gateway lists 30 live USGS river/flood gauges including Au Sable, Manistee, Pere Marquette — [Michigan Gateway gauges](https://michigangateway.thesuntimesnews.com/gauges)

**Michigan DNR / EGLE / academic / citizen data**
- DNR Fisheries Division Status and Trends Program (since 2002) maintains fixed index stream sites; temperature loggers deployed ~April and retrieved ~October; data for formal use require contacting Fisheries Division; Stream Fish Population Trend Viewer at `http://www.mcgi.state.mi.us/fishpop/#` — search summary citing [DNR Fisheries Research Report 2037 (PDF)](https://www2.dnr.state.mi.us/publications/pdfs/ifr/ifrlibra/Research/reports/2037rr.pdf) and [Stream Fish Population Trend Viewer](https://ifr-shiny-webapp.apps.aws.web.umich.edu/SFPTV/arcgis_mutliple.html)
- DNR Fisheries Report 47: North Branch Au Sable water temperature analyzed at nine stations in 2021–2022, 61,390 observations — [FR047 (PDF)](https://www.michigandnr.com/PUBLICATIONS/pdfs/DNRFishLibrary/FisheriesReports/FR047.pdf)
- DNR open-data GIS portal (fish category) — [gis-midnr.opendata.arcgis.com](https://gis-midnr.opendata.arcgis.com/search?categories=fish)
- Anglers of the Au Sable "is working with Lake Superior State University to expand its water data collection" and links LSSU data; the group posts a rule to avoid fishing Mio–Alcona when morning water at Mio Dam is ≥70°F — [Anglers of the Au Sable River Update](https://ausableanglers.org/river-update/)
- Michigan Sea Grant runs a volunteer program monitoring spawning runs in West Michigan creeks — [Michigan Sea Grant blog 2025](https://www.michiganseagrant.org/blog/2025/03/20/spring-brings-spawning-fish-into-west-michigan-streams-and-you-can-help-to-monitor-spawning-runs-in-local-creeks/)
- Great Lakes surface temperature (for lake-run staging context): GLSEA daily from AVHRR/VIIRS via GLERL CoastWatch — [GLSEA](https://coastwatch.glerl.noaa.gov/satellite-data-products/great-lakes-surface-environmental-analysis-glsea/); GLERL data index — [GLERL data](https://www.glerl.noaa.gov/data/)

### Inferences
- The Au Sable and Manistee are unusually well instrumented (temperature at 9 and 6 sites respectively), making them ideal calibration rivers for fitting air-GDD → water-temperature/emergence offsets; the Pere Marquette will need a proxy (nearest thermally similar gauge, e.g., Little Manistee 04126195, or Mohseni-style air→water regression).
- Use USGS `daily` collection (max/min/mean water temp) to compute *water* degree-days directly for gauged reaches and to validate air-GDD cells; use `latest-continuous` for "current water temp" display.
- Because the legacy NWIS services still respond but USGS recommends OGC endpoints, build on `api.waterdata.usgs.gov/ogcapi/v1` with an API key.

### Gaps
- No public API or download page for Michigan DNR temperature-logger data, Huron Pines, or Trout Unlimited logger networks was found; Anglers of the Au Sable/LSSU data link was not resolvable from the page HTML.
- Michigan EGLE (MiCorps) stream temperature data were not located in this search.
- No Michigan gauge with water temperature was found on the Boardman, Two Hearted, or Pere Marquette.

---

## KQ6. Recommended architecture: dataset, resolution, start date, base temperature, species thresholds, per-river offsets

### Takeaway
Sources support a two-layer engine: (1) an air-GDD layer computed per 2.5–5 km cell from a daily tmin/tmax grid (gridMET or NClimGrid-Daily for history; NPN 2.5 km or NWS gridpoints for the next 6–7 days), accumulated from January 1 (NPN convention) or March 1 (Enviroweather convention) using simple averaging with base 50°F for Hex/summer hatches and base 32–42°F for early-spring hatches; and (2) a water-temperature layer from USGS gauges that supplies absolute triggers (Hendrickson 50–55°F, Hex ≥ 62–68°F, salmonfly ≥ 8.4°C, steelhead > 7–9°C, suckers ~7°C) and per-river calibration offsets.

### Cited Findings
- USA-NPN's operational convention: January 1 start, base 32°F and 50°F, simple average method ((tmin+tmax)/2 − base, negatives zeroed), 2.5 km NCEP grid, 6-day forecast — [NPN Geoserver documentation](https://docs.google.com/document/d/1jDqeh8k30t0vEBAJu2ODiipaofLZ2PFgsaNzhhzz3xg/pub); [USA-NPN AGDD](https://www.usanpn.org/data/maps/AGDD)
- MSU Enviroweather's Michigan convention: base 50°F accumulated from March 1 on a ~1.5-mile URMA grid — [MSU Extension, New GDD maps](https://www.canr.msu.edu/news/new_growing_degree_day_maps_on_enviro_weather)
- Turf models use base 32°F to "indirectly measure soil temperatures" (an analog for using a low base as a proxy for a buffered medium) — [MSU GDD Tracker](https://gddtracker.msu.edu/)
- Aquatic-insect thresholds: Hexagenia base 10°C (50°F) with 1,806–2,030 DD to emergence and 20°C emergence floor — [Heise et al. 1987](https://www.journals.uchicago.edu/doi/10.2307/1467310); [Animal Diversity Web](https://animaldiversity.org/accounts/Hexagenia_limbata/); Sweeney/Vannote-type models use a per-species lower threshold with development linear above it and quiescence above a maximum — [Newbold et al. 1994](https://www.journals.uchicago.edu/doi/10.2307/1467261); degree-days become unreliable near thresholds — [MSU thesis](https://d.lib.msu.edu/etd/654/OBJ/download)
- Photoperiod: day-length-triggered larval quiescence improves emergence synchrony in the Neocloeon model — [Kolpas et al. 2020](https://stroudcenter.org/publications/phenological-modeling-parthenogenetic-mayfly-white-clay-creek/); steelhead cue includes "lengthening days" — [Swing the Fly](https://swingthefly.com/great-lakes-run-timing/)
- Groundwater reduces the slope of the air→water relationship; weekly air→water regressions achieve ~1.6°C RMSE nationally — [Mohseni et al.](https://www.researchgate.net/publication/245300737_Estimating_Stream_Temperature_from_Air_Temperature_Implications_for_Future_Water_Quality); [air–stream relationship review](https://www.researchgate.net/publication/253295075_The_Relationship_Between_Air_Temperature_and_Stream_Temperature)
- Dataset properties supporting the choice: gridMET 4 km CC0 near-real-time — [gridMET](https://www.climatologylab.org/gridmet.html); NClimGrid-Daily 5 km, 2–3 day lag — [NCEI](https://www.ncei.noaa.gov/products/land-based-station/nclimgrid-daily); Daymet 1 km lags to previous year — live Daymet probe above and [Daymet overview](https://daymet.ornl.gov/overview); NWS 2.5 km 7-day forecasts free — [NWS API](https://www.weather.gov/documentation/services-web-api)
- hatchR (US Forest Service) is an open toolset that predicts fish hatch/emergence from spawning date plus stream temperature — a reusable pattern for water-temperature-driven phenology — [USFS hatchR](https://research.fs.usda.gov/rmrs/articles/hatchr-toolset-predict-fish-development)

### Inferences
- Recommended pipeline: nightly pull gridMET tmmx/tmmn (or NClimGrid-Daily) for a Michigan bounding box → compute per-cell daily GDD at three bases (32, 42, 50°F; optional 86°F cutoff) from Jan 1 → append NPN AGDD (base 32/50) or api.weather.gov daily highs/lows for the 6–7-day forecast → for each hatch, store a calibrated AGDD window per river (fit from 5–10 years of local hatch reports vs. cell AGDD) rather than a single statewide number → override/confirm with live USGS water temperature where a gauge exists.
- Base temperature choice: use 50°F for Hex, Brown Drake, Isonychia and summer caddis (matches 10°C literature threshold); use 32°F or 42°F for Hendrickson, Grannom, early Baetis and stoneflies, since they emerge at 45–55°F water when base-50 air GDD has barely begun accumulating in northern Michigan.
- Per-river offsets should be expressed in AGDD (not days) and grouped by thermal regime (groundwater-dominated: Au Sable mainstem/North Branch, Manistee upper, Pere Marquette; runoff-influenced: lower Muskegon, Grand, St. Joseph).
- Resolution: 2.5–5 km is sufficient because emergence varies more by river reach (thermal regime, dam tailwaters) than by sub-kilometer air-temperature gradients; 1 km Daymet adds nothing operationally because it lags a year.

### Gaps
- No source provides validated AGDD thresholds for any Michigan hatch; the team must build a training set (hatch reports + gauge temps + cell GDD) to calibrate.
- No source quantifies how many seasons of data are needed for a stable per-river offset.

---

## KQ7. Existing hatch-prediction tools and their methods

### Takeaway
Current consumer hatch tools (IdentaFly, FlyFishFinder, Buggin, RiverReports, Current, TroutFishing.app) combine static seasonal hatch charts with live USGS flow/temperature and weather, not published GDD models; none documents a degree-day method, and expert commentary (Troutnut) treats charts as approximate. There is a clear opening for a transparent GDD + water-temperature engine.

### Cited Findings
- IdentaFly offers "GPS hatch forecasts by location... real-time USGS river conditions, and AI photo recognition" — [IdentaFly](https://my.identafly.app/); hatch page notes forecasts with water-temperature data — [IdentaFly hatch](https://my.identafly.app/hatch)
- FlyFishFinder provides "real-time USGS gauge intelligence, Prime condition alerts" alongside river hatch charts (Au Sable page and Michigan chart) — [FlyFishFinder hatches](https://flyfishfinder.com/pages/fly-hatches/); [Au Sable hatch chart](https://flyfishfinder.com/pages/hatches/au-sable-river/)
- Buggin: "Forecasts are generated from real-time river data, weather signals, and seasonal hatch activity to estimate how fish are likely feeding" — [Buggin](https://www.bugginfishing.com/)
- RiverReports Au Sable page: flows and Hex hatch narrative — [RiverReports Au Sable](https://www.riverreports.com/river-intel/rivers/au-sable-river-michigan-fly-fishing); Current — [Au Sable conditions](https://currentfishing.com/locations/au_sable); TroutFishing.app — [Au Sable forecast](https://troutfishing.app/rivers/michigan/au-sable)
- Troutnut: "hatch charts are a general reference at best and meaningless at worst" given latitude, altitude, local conditions — [Troutnut forum](https://www.troutnut.com/topic/694/When-does-a-Hatch-happen); time-of-day prediction is "even more tentative than time-of-year" — [Troutnut, Hatch Time of Day](https://www.troutnut.com/article/34/61/hatch-time-of-day); "there may be a relationship between growing degree-day requirements and the timing of aquatic insect hatches" is raised as a hypothesis in [Troutnut, Predicting a hatch](https://www.troutnut.com/topic/1319/Predicting-a-hatch)
- Wisconsin hatch guide describes a consistent sequence of hatches as rivers warm "from its winter lows in the mid-30's to its summer highs in the 60's" — [Cutthroat Anglers (CO) water temperature and hatches](https://fishcolorado.com/blogs/cutthroat-anglers-blog/water-temperatures-and-bug-hatches-cutthroat-anglers)
- Michigan shop/guide hatch charts (static calendars): [Ron's Fly Shop](https://www.ronsflyshop.com/fishing/hatches); [Old Au Sable](https://www.oldausable.com/the-hatches); [Mangled Fly Hendrickson](https://mangledfly.com/hendrickson-hatch/)
- hatchR (USFS) predicts fish hatch/emergence from spawning date and stream temperature (scientific, open) — [USFS hatchR](https://research.fs.usda.gov/rmrs/articles/hatchr-toolset-predict-fish-development)

### Inferences
- Competitive differentiation would come from publishing the model (base temps, AGDD windows, gauge used) and showing "AGDD to date vs. hatch window" per river, which no listed app does.

### Gaps
- No product named "Hatch Magic" or an Orvis GDD-based tool was found; Orvis hatch content located was editorial (Hendrickson, Grannom articles), not a calculator.
- None of the apps publishes methodology; claims above are from their marketing pages.
