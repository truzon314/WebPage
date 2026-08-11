# Map Management

This powers the interactive **site-layout maps** shown on property pages — the kind where a visitor can see individual plots, click one to see its size/price/status, and zoom in for detail. It's the most technical section of the CMS; most day-to-day content doesn't need this.

## Projects and layers

- A **Project** here is a map for one property (e.g. "Sneha Villas") — it's linked to that property via the property editor's **Linked Map Layout** field ([02 — Properties & Projects](02-Properties-and-Projects.md)).
- Each project can have multiple **Layers** — e.g. one for plots, one for roads, one for parks/amenities, one for utilities. Layers stack on top of each other; the order in the **Layers** panel controls what renders on top.

## Adding a project

**+ New Project**, give it a name. Then **+ Upload GIS** to add layers to it — this accepts Shapefiles, GeoJSON, or a ZIP containing shapefile parts. This step usually requires whoever prepared the survey/plot data (an architect, surveyor, or GIS consultant) to hand over the correct file.

## Working with a layer

Click the **⚙** (gear) icon next to a layer to open its settings:

- **Style** — fill color, border color, border thickness, and border style (solid/dashed/dotted).
- **Label on map** — which attribute (e.g. "Plot.No") to display as text directly on each shape on the map. Text grows automatically as a visitor zooms in.
- **Color rules** — automatically color-code shapes by a condition (e.g. plots where `Status = Sold` render red, `Available` renders green).
- **Popup settings** — turn the click-to-see-details popup on/off, and choose which attributes appear in it.

## Editing plot data directly

Within a layer's settings, **Edit Specific Feature/Plot** lets you select one or more plots (search by name) and edit their attribute values directly — useful for correcting a mislabeled plot or updating a status without re-uploading the whole file. You can also **Add Custom Attribute** or **Delete Attribute** across every plot in a layer at once.

## Map provider

**Provider** (top toolbar) lets you switch the base map style — Google Maps, Google Satellite, or OpenStreetMap. If no Google Maps API key is configured, the map falls back to OpenStreetMap automatically.

## Sharing a map

**🔗 Share Link** generates a public link to just this project's map (optionally password-protected, with an expiry or view limit) — useful for sending a site layout to a specific client without giving them CMS access. **⚡ API & Embed** gives the raw API endpoints and an iframe embed code if a map needs to go somewhere outside the main site.

## Zooming and navigating

Use the **⛶ Zoom to Fit** button (bottom-left of the map) to snap back to a view showing every plot, any time you've panned or zoomed away while working.
