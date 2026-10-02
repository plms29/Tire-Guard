/* ==========================================================================
   Song ngữ. Bản tiếng Việt là nội dung gốc nằm trong HTML — lần chạy đầu
   tiên nó được cất lại, nên ở đây chỉ cần khai báo bản tiếng Anh.
   ========================================================================== */

export const EN = {
  'tab.model': '3D model', 'tab.problem': 'Problem', 'tab.spec': 'Specs',
  'tab.how': 'How it works', 'tab.compare': 'Comparison', 'tab.revenue': 'Revenue',
  'tab.roadmap': 'Roadmap', 'tab.fleet': 'Fleet · API', 'tab.esg': 'Open data · ESG', 'tab.sources': 'Sources',

  'view.overview': 'Whole wheel', 'view.exploded': 'Exploded',
  'view.capOverview': 'The device sits flush inside the rear wheel arch, hugging the 30°–75° centrifugal spray angle. Drag to rotate, scroll to zoom, press “Flood” to watch the cut-off cycle.',
  'view.capExploded': 'Five assemblies, thirty millimetres deep. Each sub-part leaves its cluster on its own beat — shell, honeycomb cartridge, flexible electrode, collection tray, mounting brackets.',


  'loading': 'BUILDING 3D MODEL…',

  'hero.eyebrow': 'Electrostatic wheel arch · VF 8 · 245/45 R20',
  'hero.title': 'Tire dust caught <em>before</em> it reaches the road.',
  'hero.sub': 'The device sits flush inside the rear wheel arch, hugging the 30°–75° centrifugal spray angle. Drag to inspect each layer.',

  'ch.0.n': 'CHAPTER 01', 'ch.0.t': 'Particles are born',
  'ch.0.d': 'Friction between tread and road tears off TRWP particles, thrown tangentially into the 30°–75° arc.',
  'ch.1.n': 'CHAPTER 02', 'ch.1.t': 'Hidden in the arch',
  'ch.1.d': 'The 30 mm unit sits deep inside the wheel-arch liner rather than hanging outside — far less exposed to potholes, flying stones and high kerbs.',
  'ch.2.n': 'CHAPTER 03', 'ch.2.t': 'Thirty millimetres, five layers',
  'ch.2.d': '10 mm carbon shell, 15 mm honeycomb cartridge, 260 mm flexible electrode, collection tray and mounting brackets.',
  'ch.3.n': 'CHAPTER 04', 'ch.3.t': 'Electrostatic capture',
  'ch.3.d': 'The 3–5 kV DC field bends each particle’s path; the Coulomb force pins it to the honeycomb wall, from where it drifts down into the tray.',
  'ch.4.n': 'CHAPTER 05', 'ch.4.t': 'Safe when flooded',
  'ch.4.d': 'Water bridges the two exposed electrodes and the IP68 circuit cuts the field in under 2 milliseconds.',
  'ch.5.n': 'CHAPTER 06', 'ch.5.t': 'Swap the cartridge, close the loop',
  'ch.5.d': 'The system warns when a cartridge is nearly full; swap it every 12,000–15,000 km alongside scheduled maintenance. The rubber dust is sold on to recyclers.',

  'hud.title': 'Particle flow simulation',
  'hud.scope': 'capture rate within the 30°–75° window',
  'hud.captured': 'Captured', 'hud.escaped': 'Passed through', 'hud.voltage': 'Voltage',
  'hud.on': 'FIELD: ON', 'hud.off': 'FIELD OFF · PASSIVE TRAP', 'hud.cut': 'FLOOD · CUT &lt; 2 ms · PASSIVE',
  'hud.note': 'Illustrative simulation of the principle, calibrated to the R&amp;D targets of 60–75% (active) and ≈ 40% (passive). Not a CFD result or a field measurement.',
  'hud.power': 'Power', 'hud.mode': 'Mode',
  'hud.dry': 'DRY CHECK · 2–3 s', 'hud.ramp': 'SOFT-START · LEAK &lt; 2 mA',
  'hud.modeActive': 'Active', 'hud.modePassive': 'Passive', 'hud.modeRamp': 'Restarting',

  'dock.field': 'Field', 'dock.flood': 'Flood', 'dock.labels': 'Dimensions',
  'dock.spin': 'Auto-rotate', 'dock.reset': 'Reset view',

  'hs.0': 'Carbon ABS shell · <u>10 mm thick</u>',
  'hs.1': 'Honeycomb core · <u>15 mm · 3 mm cells</u>',
  'hs.2': 'Flexible electrode · <u>260 mm wide</u>',
  'hs.3': 'Collection tray · <u>260×40×20 mm</u>',
  'hs.4': 'Suspension clearance · <u>50 mm</u>',
  'hs.5': 'Hex cell · <u>3 mm · 0.5 mm wall</u>',
  'hs.6': 'Exposed electrodes · <u>8 mm · IP68</u>',
  'hs.7': 'Cartridge slide rail · <u>5 mm deep</u>',

  'zoom.hint': 'Scroll to zoom — the device separates layer by layer',

  'anno.tag': 'Dimensions',
  'anno.0.t': 'Carbon ABS shell', 'anno.0.d': '10 mm thick, radius 415 → 445 mm',
  'anno.1.t': 'Honeycomb core',   'anno.1.d': '15 mm thick, 3 mm hex cells, 0.5 mm walls',
  'anno.2.t': 'Flexible electrode', 'anno.2.d': '260 mm wide, copper-clad, controller on board',
  'anno.3.t': 'Collection tray',  'anno.3.d': '260 × 40 × 20 mm, at the 30° low point',
  'anno.4.t': 'Suspension clearance', 'anno.4.d': '50 mm, enough for full compression',

  's1.tag': '01 — The problem',
  's1.h': 'Electric cars dropped the tailpipe. They did not drop the tire.',
  's1.p1': 'EVs are heavier because of the battery and accelerate harder, so their tires wear faster. None of that leaves through an exhaust pipe, so it appears in no emissions test — and no law penalises it. In Southeast Asia every heavy downpour flushes that dust straight into the river system.',
  's1.st0': 'Extra non-exhaust fine particles an EV produces compared with a petrol car of the same size, because of battery weight.',
  's1.st1': 'Share of EVs in total car sales in Vietnam — moving faster than tire-pollution control.',
  's1.st2': 'What 6PPD becomes when it meets ozone. Rain washes it into waterways, where it can be lethal to some fish species.',
  's1.p2': 'Existing collectors are a good starting point, but none can be assumed to fit every vehicle: tire and wheel-arch geometry, suspension clearance and airflow all differ. And adapting them to the frequent flooding and potholed roads of Southeast Asia is still an unsolved problem.',

  's2.tag': '02 — Design parameters',
  's2.h': 'Parameterised around the VF 8’s 245/45 R20 tire.',
  's2.lede': 'There is no one-size-fits-all box. Each model is recalculated from four groups of variables: tire and wheel-arch geometry, suspension travel, the airflow inside the wheelhouse (CFD), and the OEM’s own mounting points. The table below is the reference configuration for the VinFast VF 8.',
  's2.g0': '① Tire &amp; wheel-arch geometry', 's2.g1': '② Suspension dynamics', 's2.g2': '③ Wheelhouse CFD', 's2.g3': '④ OEM-standard mounting',
  's2.th0': 'Parameter', 's2.th1': 'Symbol', 's2.th2': 'Value', 's2.th3': 'Engineering constraint',
  's2.gh0': 'Geometry &amp; fitting', 's2.gh1': 'Electrical &amp; safety', 's2.gh2': 'Collection',
  's2.r0': 'Tire outer radius',              's2.n0': 'Standard 245/45 R20 tire.',
  's2.r1': 'Trap arc radius',                's2.n1': 'Follows the inner curve of the wheel-arch liner.',
  's2.r2': 'Suspension travel clearance',    's2.n2': 'To be re-checked at full load with the suspension fully compressed.',
  's2.r3': 'Collection arc',                 's2.n3': 'Measured from the wheel’s horizontal centreline, chosen from CFD — where the centrifugal particle plume is densest.',
  's2.r4': 'Trap width',                     's2.n4': '15 mm wider than the tread to catch particles thrown at an angle.',
  's2.r5': 'Overall thickness',              's2.n5': '10 mm shell + 15 mm honeycomb core + air gap. Aims to keep Cd ≈ 0.20 unchanged.',
  's2.r6': 'Arc length',                     's2.n6': '45° sweep hugging the plastic liner.',
  's2.r7': 'Honeycomb cell',                 's2.n7': '0.5 mm walls; air passes through, and the lattice doubles as a mechanical trap when the field is off.',
  's2.r8': 'Cartridge swap time',            's2.n8': 'The tray slides out on rails and clips to the OEM’s existing plastic fasteners — no drilling, no cutting.',
  's2.r9': 'Trapping voltage',               's2.n9': 'Kept below the corona-discharge threshold to limit ozone — the agent that turns 6PPD into 6PPD-quinone.',
  's2.r10': 'Power draw',                    's2.n10': 'Taken from the vehicle’s 12 V auxiliary supply, never the traction battery.',
  's2.r11': 'Electrode edge radius',         's2.n11': 'Rounded so the local field stays below the corona threshold.',
  's2.r12': 'Flood sensor',                  's2.n12': 'Capacitive sensors on the lower edge and both side walls; HV cut in under 2 ms.',
  's2.r13': 'Residual discharge',            's2.n13': 'An active discharge circuit drains the electrodes through a safety resistor.',
  's2.r14': 'Soft-start leakage threshold',  's2.n14': 'Above it, the ramp stops and the electrodes are discharged to 0 V again.',
  's2.r15': 'Cartridge capacity',            's2.n15': 'Holds ≈ 100 g of compacted dust.',
  's2.r16': 'Swap interval',                 's2.n16': 'Matches the vehicle’s scheduled maintenance.',
  's2.r17': 'Target efficiency',             's2.n17': 'For the centrifugal particle plume from the tire. An R&amp;D target that needs prototype validation.',
  's2.note': 'Every value is a design target for the VF 8 configuration and needs prototype validation. Electrical safety, IP68 and ECE R10 electromagnetic compatibility all require testing.',
  's2.chh': 'Capture efficiency by vehicle speed',
  's2.chp': 'The team’s R&amp;D target curves. In active mode efficiency rises with speed because particles leave faster and fly straight into the 30°–75° arc; when flooded, the unit relies on mechanical trapping only.',
  's2.tbl': 'Show as a table',
  's2.chnote': 'These curves are design targets and team estimates, not on-vehicle measurements. The benchmark line is an estimate for the configuration described in CN115320726B. The simulation on the 3D tab is calibrated to this band: ≈ 69% active, ≈ 40% passive.',
  's2.figh': 'Installation drawings',
  's2.fig0': 'Figure 1 — The 30°–75° interception arc, 50 mm suspension clearance and 30 mm module on the VF 8 (245/45 R20 tire).',
  's2.fig1': 'Figure 2 — Patent-style drawing: (1) wheel-arch liner, (2) TireGuard collection cartridge, (3) tire surface; 30 mm cartridge cross-section.',

  's3.tag': '03 — How it works',
  's3.h': 'Three parts, under 3 W from the 12 V supply.',
  's3.c0n': 'PART 01', 's3.c0t': 'Wheel-arch carrier',
  's3.c0d': 'Carbon-reinforced ABS shell, 415 mm inner radius, 445 mm outer, sweeping a 45° arc. Clips match the OEM’s original plastic fastener positions; two 5 mm grooves act as rails for the cartridge.',
  's3.c1n': 'PART 02', 's3.c1t': 'Honeycomb trap core',
  's3.c1d': '15 mm thick, 3 mm hexagonal cells, 0.5 mm walls. A 3–5 kV DC field pins particles to the walls by the Coulomb force; with the power off, the honeycomb itself becomes a mechanical trap. The 250 cm³ cartridge slides out in about 30 seconds.',
  's3.c2n': 'PART 03', 's3.c2t': 'Tray &amp; cut-off circuit',
  's3.c2d': 'A 260×40×20 mm tray sits at the 30° low point where heavy dust settles. Controller and HV converter are potted in solid epoxy, targeting IP68; a capacitive sensor reports flooding so the HV is cut in under 2 ms.',
  's3.flowh': 'The collection process',
  's3.fh': 'Five steps when the car drives through water',
  's3.fp': 'A collector that keeps high voltage on while submerged is an electrical-leakage risk. TireGuard breaks the response into five timed steps.',
  's3.f0t': 'Detect water',   's3.f0d': 'Capacitive sensors on the lower edge and side walls pick up the change in dielectric constant.',
  's3.f1t': 'Cut the HV',     's3.f1d': 'The microcontroller opens a solid-state switch, disconnecting the 3–5 kV supply from the electrodes.',
  's3.f2t': 'Discharge',      's3.f2d': 'An active circuit drains the remaining charge on the electrodes through a resistor to 0 V.',
  's3.f3t': 'Passive trap',   's3.f3d': 'While water is present, the honeycomb traps mechanically — targeting about 40% of particles. Electronics are epoxy-potted, targeting IP68.',
  's3.f3e': 'while flooded',
  's3.f4t': 'Soft-start',     's3.f4d': 'After 2–3 s continuously dry, voltage ramps 0 → 1 → 2.5 → 4 kV over 0.5–1 s. If leakage exceeds 2 mA it stops and discharges again.',
  's3.fbtn': 'Watch this cycle in the 3D model →',
  's3.rh': 'Why start with the two rear wheels',
  's3.r0n': 'CURRENT STAGE', 's3.r0t': 'Rear wheels, a fleet kit',
  's3.r0d': 'Front wheels steer up to roughly ±40° while the suspension moves, so the wheelhouse space keeps changing. Rear wheels hold their angle, and hard EV acceleration shifts load onto the rear axle, wearing rear tires faster. Fitting the rear pair first cuts complexity and cost for the trial stage.',
  's3.r1n': 'WITH A CARMAKER ON BOARD', 's3.r1t': 'All four wheels, moulded into the liner',
  's3.r1d': 'The front units are moulded straight into the wheel-arch liner on the assembly line, using a flexible trap membrane that follows the steering angle and a four-channel controller, without touching the steering system.',
  's3.eqh': 'Why 30°–75°, and why not hang it outside',
  's3.eqp': 'Particles leave the tread tangentially at an initial velocity v₍x0₎, then follow a parabolic path once they enter the uniform field. Placing the trap across exactly this angular band means meeting each particle where its path bends hardest — while burying the entire high-voltage system deep inside the plastic liner, away from stones, potholes and floodwater.',
  's3.e0': 'Particle path in a uniform field',
  's3.e1': 'Equation of motion',
  's3.e2': 'Gauss’s law for the trapping field',
  's3.e3': 'Retention condition over a pothole',
  's3.eqnote': 'F<sub>e</sub> = qE is the Coulomb force, F<sub>g</sub> + F<sub>b</sub> is gravity minus buoyancy, F<sub>d</sub> is Stokes drag with the Cunningham correction for PM2.5. The simulation on this page solves that system in a reduced, real-time form.',

  's4.tag': '04 — Competitive landscape',
  's4.h': 'The approaches that exist, and the gap they leave.',
  's4.th0': 'Approach', 's4.th1': 'Representative', 's4.th2': 'Strength', 's4.th3': 'Weakness in Southeast Asia',
  's4.r0': 'Low-wear tires',
  's4.s0': 'Reduces particles at source with no extra hardware on the vehicle.',
  's4.w0': 'Requires new materials and a redesign per EV model, and friction is still a safety requirement.',
  's4.r1': 'Externally mounted electrostatic trap',
  's4.s1': 'Uses airflow and an electric field to catch particles beside the wheel.',
  's4.w1': 'An external support arm is exposed to impacts on rough roads; keeping high voltage on through floodwater raises leakage concerns.',
  's4.r4': 'Two collectors per wheel', 's4.rep4': 'Ningbo University (China)',
  's4.s4': 'Integrates two collection channels into the wheel arch.',
  's4.w4': 'Eight units per car — more cost to install, test and maintain across a fleet.',
  's4.r2': 'Collection after release', 's4.rep2': 'Street sweepers, drain filters',
  's4.s2': 'Handles many kinds of road waste at once.',
  's4.w2': 'Only works once particles have reached the road. Heavy rain carries 6PPD into drains, rivers and canals first.',
  's4.rep3': 'Electrostatic trap inside the wheel arch, one unit per wheel',
  's4.s3': '30 mm flush in the liner; HV cut in under 2 ms when flooded, then mechanical trapping; 4 units per car instead of 8.',
  's4.w3': 'No road-validated prototype yet. Needs IP68 and ECE R10 testing, and a carmaker partner for the front wheels.',
  's4.uh': 'Three differences',
  's4.u0t': 'Less exposed to the road', 's4.u0d': 'Compared with a configuration on an external support, TireGuard is 30 mm thin and sits deep in the liner — away from most potholes, flying stones and high kerbs.',
  's4.u1t': 'Flood-responsive', 's4.u1d': 'Detects water, cuts the field in under 2 ms, traps mechanically while submerged, then soft-starts once dry.',
  's4.u2t': 'Fewer units per car', 's4.u2d': 'One unit per wheel, four in total instead of eight — simpler to fit, to service and to cost out for a fleet.',
  's4.note': 'Removing the external support and adding a flood cut-off is a design-around relative to WO2021152331A1. Whether it can be protected independently needs assessment by an IP professional.',

  's5.tag': '05 — Business model',
  's5.h': 'Sell a fleet kit first, integrate at the factory later.',
  's5.p0n': 'PHASE 1 · FLEET KIT (MVP)', 's5.p0t': '2 rear wheels · USD 150 per car',
  's5.p1n': 'PHASE 2 · OEM INTEGRATION', 's5.p1t': '4 wheels · USD 250–300 per car',
  's5.k0': 'Price per wheel', 's5.k1': 'Hardware per car', 's5.k2': 'Replacement cartridge', 's5.k2u': 'wheel/swap',
  's5.k3': 'Cartridges per car per year*', 's5.k4': 'Wheels', 's5.k4v': '4, front and rear', 's5.k5': 'Fitting', 's5.k5v': 'Moulded into the liner',
  's5.p0d': 'Sold to fleets such as Xanh SM, Grab and Be. Rear wheels only, avoiding the steering angle and keeping the investment low.',
  's5.p1d': 'With a carmaker partner, the flexible trap membrane is moulded into the wheel-arch liner on the assembly line; tooling costs are spread over high volume.',
  's5.note0': '* Assumes one swap a year, i.e. 12,000–15,000 km. Ride-hailing cars drive further and swap more often — see the calculator below.',
  's5.ch': 'Four revenue streams',
  's5.c0t': 'Hardware', 's5.c0d': 'Selling and fitting kits to fleets; later, OEM component contracts.',
  's5.c1t': 'Replacement cartridges', 's5.c1d': 'Recurring revenue that scales with kilometres, delivered through the maintenance-garage network.',
  's5.c2t': 'Rubber dust', 's5.c2d': 'Captured SBR/BR dust is sold to recyclers, for example as an asphalt additive.',
  's5.c3t': 'Data &amp; ESG reporting', 's5.c3d': 'A fleet-management API and ESG reporting package — see the Fleet and Open data tabs. Pricing: left blank for now.',
  's5.calch': 'Fleet cost calculator',
  's5.cal0': 'Vehicles', 's5.cal1': 'Km per vehicle per year', 's5.cal2': 'Kit · 2 wheels', 's5.cal3': 'OEM · 4 wheels',
  's5.note': 'All figures are team assumptions and unaudited. The team estimates a fleet recovers the USD 150 per car hardware in about 26 months through 0.25–0.5% lower green-loan rates, plastic credits and rubber-dust sales — each of which still has to be confirmed with banks and recyclers.',

  's6.tag': '06 — Implementation',
  's6.h': 'Seventeen months from prototype to fleet.',
  's6.l0n': 'MONTHS 1–4', 's6.l0t': 'Rear-wheel prototype',
  's6.l0': 'Refine the two-cartridge prototype and propose a trial of about 50 vehicles to VinFast. Check mounting stability, suspension clearance, capture efficiency, and the wet cut-off and restart cycle.',
  's6.l1n': 'MONTHS 4–12', 's6.l1t': 'Four wheels &amp; monitoring tools',
  's6.l1': 'Develop front-wheel units that follow steering and suspension, integrating into the liner with the carmaker. Test pothole impacts and repeated flooding. Build the website and app showing cartridge fill, collected mass and validated efficiency.',
  's6.l2n': 'MONTHS 12–17', 's6.l2t': 'Fleet pilot',
  's6.l2': 'By month 15, aim to fit about 100 VinFast vehicles operated by Xanh SM, subject to agreement. Assess performance, maintenance needs and reliability in passenger service; market with validated results.',
  's6.l3n': 'AFTER MONTH 17', 's6.l3t': 'Scale',
  's6.l3': 'Add vehicle models by recalculating dimensions and mounts; expand across Southeast Asia, then compare against European collectors.',
  's6.vh': 'Validation at every stage',
  's6.v0': 'Sample the dust in the cartridges and run Py-GC/MS at an ISO/IEC 17025 laboratory to quantify tire microplastics and 6PPD.',
  's6.v1': 'IP68, electrical-safety and ECE R10 EMC testing before running on passenger vehicles.',
  's6.v2': 'Measure clearance at full load with the suspension fully compressed, on real potholed roads.',
  's6.v3': 'Only independently validated figures go into the app and ESG reports.',

  'f.tag': '07 — Fleet management · API',
  'f.h': 'Every car reports when its cartridge is nearly full.',
  'f.lede': 'The TireGuard controller sends cartridge fill, kilometres since the last swap, voltage, leakage current and flood events to the server through the vehicle’s telematics unit. Fleets read that data through an API, get alerts when maintenance is due, and call the nearest service centre when a cartridge cannot be swapped on the road.',
  'f.banner': 'A mock API running entirely in your browser. The twelve vehicles below are generated data, not real vehicles or a real fleet. Real figures replace them once the pilot runs.',
  'f.listh': 'Vehicles in the demo fleet',
  'f.fall': 'All', 'f.falert': 'Needs action', 'f.fok': 'Normal',
  'f.rh': 'Alert rules',
  'f.r0t': 'Nearly full', 'f.r0d': 'Cartridge ≥ 80% or ≥ 12,000 km since the last swap → prompt to book alongside scheduled maintenance.',
  'f.r1t': 'Full', 'f.r1d': 'Cartridge ≥ 95% → swap now; if that is impossible on the road, call the nearest service centre.',
  'f.r2t': 'Passive trap', 'f.r2d': 'Flooded or recently flooded → field already cut, watch the soft-start.',
  'f.r3t': 'Leakage fault', 'f.r3d': 'Repeated leakage &gt; 2 mA during soft-start → HV locked out, a technician must inspect.',
  'f.ah': 'Partner API',
  'f.ap': 'REST + JSON, authenticated with the fleet’s API key. Click an endpoint to send a request to the mock API and see the response.',
  'f.wh': 'Webhooks',

  'e.tag': '08 — Open data · ESG',
  'e.h': 'Collection data made public, with the owner’s consent.',
  'e.lede': 'Cartridge data lets a fleet prove its pollution-control effort. With the fleet’s permission, anonymised and aggregated data is opened to environmental research institutes to assess and rate ESG performance, and to regulators as monitoring data on non-exhaust pollution.',
  'e.n0t': 'Vehicle', 'e.n0d': 'cartridge, sensors, km', 'e.n1d': 'validate · anonymise · aggregate',
  'e.o0t': 'Fleet', 'e.o0d': 'internal ESG reporting', 'e.o1t': 'Research institutes', 'e.o1d': 'assessment, ESG rating',
  'e.o2t': 'Regulators', 'e.o2d': 'figures by district',
  'e.ch': 'Three levels of consent',
  'e.cp': 'The fleet chooses what to share and can withdraw at any time. Pick a level below to see who sees what.',
  'e.sh': 'Fleet ESG scorecard',
  'e.demo': 'Fill with demo data',
  'e.sp': 'Left blank because there is no pilot data yet. Switch on “Fill with demo data” to see what the scorecard looks like once figures arrive.',
  'e.mh': 'How the ESG grade is calculated (proposal)',
  'e.mnote': 'The weights are the team’s initial proposal and will be calibrated with a partner research institute. No grade is given with fewer than 3 months of validated data.',
  'e.gh': 'Figures for regulators',
  'e.gp': 'Aggregated by district, and a cell is published only with 10 or more vehicles so it cannot be traced back to one car.',
  'e.ph': 'Data partners',
  'e.p0': 'Environmental research institute', 'e.p1': 'University', 'e.p2': 'Environmental regulator', 'e.p3': 'ISO/IEC 17025 laboratory',
  'e.pempty': 'Left blank — updated once an agreement is in place',
  'e.rh': 'Data principles',
  'e.r0': 'Shared only with the fleet’s written consent, which can be withdrawn at any time. Designed around Vietnam’s Decree 13/2023/ND-CP on personal data protection.',
  'e.r1': 'Plates, VINs, GPS traces and driver identities never leave the fleet. Outsiders only see district-level, monthly aggregates.',
  'e.r2': 'Every figure states its source: estimated from sensors, or weighed and analysed in a laboratory.',
  'e.r3': 'Aggregate datasets are published under CC BY 4.0 and updated monthly.',

  's7.tag': '09 — Sources',
  's7.h': 'Where the numbers on this page come from.',
  's7.0': 'Non-exhaust Particulate Emissions from Road Transport. Heavier EVs may emit 3–8% more non-exhaust fine particles than comparable petrol cars.',
  's7.1': 'EVs account for roughly 40% of car sales in Vietnam, 20% in Thailand and 15% in Indonesia.',
  's7.2': '6PPD reacts with ozone to form 6PPD-quinone, which rain washes into waterways and which can be lethal to some fish species.',
  's7.6': 'Tire particles under 2.5 µm stay airborne longer and travel far beyond the roads where they are generated.',
  's7.7': 'Fine tire particles reached deep lung regions and caused acute inflammation in mice.',
  's7.8': 'PM2.5 exposure is linked to increased cardiovascular risk.',
  's7.9': '600,000 US products: those with ESG-related claims grew 28% cumulatively (2017 – June 2022) versus 20% for the rest.',
  's7.10': 'Consumers state they would pay a 9.7% premium on average for sustainable goods; 54% of the Vietnam sample would pay up to 10% more.',
  's7.11': 'More than 17 million rides with the “Eco-Friendly” preference enabled in Thailand and Singapore.',
  's7.12': 'A design precedent: showing estimated CO₂ savings per trip and explaining how they are calculated.',
  's7.5': 'The study tracing coho salmon die-offs to 6PPD-quinone.',

  'foot.tag': 'Electrostatic wheel arch — trapping tire microplastics at source, built for Southeast Asian infrastructure.',
  'foot.note': 'MODELLED FROM CAD PARAMETERS · NOT A MANUFACTURING DRAWING',
};

const VI = Object.create(null);      // nội dung gốc, nạp từ HTML
let current = 'vi';
let ready = false;

function nodes() {
  return document.querySelectorAll('[data-i18n],[data-i18n-html]');
}

function snapshot() {
  nodes().forEach(el => {
    const key = el.dataset.i18n || el.dataset.i18nHtml;
    if (!(key in VI)) VI[key] = el.innerHTML;
  });
  // các chuỗi chỉ xuất hiện lúc chạy, không có trong HTML
  VI['hud.on'] = 'ĐIỆN TRƯỜNG: BẬT';
  VI['hud.off'] = 'TẮT ĐIỆN TRƯỜNG · BẪY THỤ ĐỘNG';
  VI['hud.cut'] = 'NGẬP · NGẮT &lt; 2 ms · THỤ ĐỘNG';
  VI['hud.dry'] = 'KIỂM TRA KHÔ RÁO · 2–3 s';
  VI['hud.ramp'] = 'KHỞI ĐỘNG MỀM · RÒ &lt; 2 mA';
  VI['hud.modeActive'] = 'Chủ động';
  VI['hud.modePassive'] = 'Thụ động';
  VI['hud.modeRamp'] = 'Đang khởi động';
  VI['view.capExploded'] = 'Năm cụm chi tiết, dày ba mươi milimét. Mỗi chi tiết con rời khỏi cụm của nó theo một nhịp riêng — vỏ carbon, lõi tổ ong, bản cực dẻo, máng hứng, ngàm gá.';
  ready = true;
}

/** Lấy một chuỗi theo ngôn ngữ đang bật — dùng cho nhãn sinh ra lúc chạy. */
export function t(key) {
  return (current === 'en' ? EN[key] : VI[key]) ?? VI[key] ?? key;
}

export function getLang() { return current; }

export function setLang(lang) {
  if (!ready) snapshot();
  current = lang === 'en' ? 'en' : 'vi';
  const dict = current === 'en' ? EN : VI;

  nodes().forEach(el => {
    const key = el.dataset.i18n || el.dataset.i18nHtml;
    const val = dict[key];
    if (val != null) el.innerHTML = val;
  });

  document.documentElement.lang = current;
  const btn = document.getElementById('bLang');
  if (btn) {
    btn.textContent = current === 'en' ? 'VI' : 'EN';
    btn.setAttribute('aria-label', current === 'en' ? 'Chuyển sang tiếng Việt' : 'Switch to English');
  }
  try { localStorage.setItem('tg-lang', current); } catch (_) { /* chế độ riêng tư */ }
  document.dispatchEvent(new CustomEvent('langchange', { detail: current }));
}

/** Mặc định: theo lựa chọn đã lưu, nếu chưa có thì theo ngôn ngữ trình duyệt. */
export function initLang() {
  let saved = null;
  try { saved = localStorage.getItem('tg-lang'); } catch (_) { /* bỏ qua */ }
  const guess = (navigator.language || '').toLowerCase().startsWith('vi') ? 'vi' : 'en';
  setLang(saved || guess);
}
