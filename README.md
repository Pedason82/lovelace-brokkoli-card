# Brokkoli Card

**This Brokkoli Card requires the following Plant component:
https://github.com/dingausmwald/homeassistant-brokkoli**

The cards can be set up using the graphical user interface (requires version 3.0.0 or higher).

## Table of Contents

- [Brokkoli Card](#brokkoli-card) - Main card for individual plants
- [Brokkoli Area Card](#brokkoli-area-card) - Card for displaying plants in an area
- [Brokkoli List Card](#brokkoli-list-card) - Card for a tabular overview of all plants
- [Installation](#installation)
- [Dependencies](#dependencies)

## Brokkoli Card

The main card for individual plants with detailed information and graphics.

![image](https://github.com/user-attachments/assets/ba7094b6-6f68-4d7e-872e-832efedc6039) ![image](https://github.com/user-attachments/assets/cf0fea96-dbf1-4398-889f-dd6f128d820e) ![image](https://github.com/user-attachments/assets/29d8175c-ab82-45f7-8330-de497c108a1d) ![image](https://github.com/user-attachments/assets/8fb61d48-dec5-460e-9ef2-2f019fd4dbdd) ![image](https://github.com/user-attachments/assets/13423871-dd1e-41a2-83de-fa6cb2f8a5c7)

### YAML Configuration

```yaml
type: custom:brokkoli-card
entity: plant.my_plant            # Required: The plant entity
battery_sensor: sensor.demo_battery   # Optional: Battery sensor for the card

# Which bars should be displayed (optional, default values if not defined)
show_bars:
  - moisture
  - temperature
  - conductivity
  - brightness
  - humidity
  - dli
  - fertility
  - health

# Which bars should be displayed in full width (optional)
full_width_bars:
  - health

# Which elements should be displayed directly on the card (optional, in this order)
# Default values if not defined: header, attributes, options
show_elements:
  - header
  - attributes
  - options
  - timeline
  - consumption

# Which elements are available in the options menu (optional)
# Default values if not defined: attributes, timeline, consumption, history, details
option_elements:
  - attributes
  - timeline
  - consumption
  - history
  - details

# Which options are expanded by default (optional)
default_expanded_options:
  - timeline
  - history

# Display type: "full" or "compact" (optional, default: "full")
display_type: full

# Listen to selection events from other cards (optional)
listen_to: my_identifier

# Grouping for history (optional)
history_groups:
  - moisture
  - temperature
  - conductivity

# Position of the history line: "left" or "right" (optional, default: "left")
history_line_position: left
```

### Available Elements

* `header` - Header area with plant image and basic information
* `attributes` - Attribute bars (moisture, temperature, etc.)
* `options` - Options menu with buttons
* `timeline` - Timeline area with graph
* `consumption` - Consumption area
* `history` - History area
* `details` - Detailed plant information

## Brokkoli Area Card

Displays plants as interactive elements in an area. Plants can be positioned via drag & drop and show colored rings for different sensors.

![image](https://github.com/user-attachments/assets/f8a0572f-ab5b-495d-9ba8-2de1f72727fe)


### YAML Configuration

```yaml
type: custom:brokkoli-area-card
title: My Plant Area     # Optional: Card title

# Define which plants should be displayed (at least one of these options must be specified)
area: living_room                 # Optional: Area from which plants are displayed
entity: plant.my_plant           # Optional: Single plant to display
entities:                        # Optional: List of plants to display
  - plant.plant1
  - plant.plant2

# Unique ID for the card when it needs to communicate with other cards
identifier: my_area         # Optional: Unique identifier for this card

# Which sensors should be displayed as rings around the plants
# Default: health, moisture, temperature
show_rings:
  - health
  - moisture
  - temperature
  - brightness

# Which sensors should be displayed as labels in the center (optional)
show_labels:
  - moisture
  - temperature

# Heatmap configuration (optional)
heatmap: moisture                 # Sensor for the heatmap (e.g., moisture, temperature)
heatmap_color: "#00ff00"          # Custom color for the heatmap
heatmap_secondary_color: "white"  # Secondary color for the heatmap
heatmap_opacity: 0.8              # Opacity for the heatmap (0.0 - 1.0)

# Whether the legend should be displayed (optional, default: true)
legend: true
```

The Brokkoli Area Card allows you to:
- Position plants using drag & drop
- Move multiple plants simultaneously
- Visualize sensor states as colored rings
- Display a heatmap for a selected sensor
- Group and arrange plants
- Display details or interact with other Brokkoli cards when clicking on a plant

## Brokkoli List Card

Displays a tabular overview of all plants. Enables sorting, filtering, and multiple selection.

![image](https://github.com/user-attachments/assets/4d743a10-e6a1-4f5e-b68b-5fbdb68e8fb9)

### YAML Configuration

```yaml
type: custom:brokkoli-list-card
title: Plant Overview          # Optional: Card title
area: living_room              # Optional: Filters plants in a specific area

# Unique ID for the card when it needs to communicate with other cards
identifier: my_list           # Optional: Unique identifier for this card

# Configure search function (optional)
search:
  enabled: true                   # Enable/disable search function
  placeholder: Search for plants...  # Placeholder text for the search field

# Configure multiple selection (optional)
multiselect:
  enabled: true                   # Enable/disable multiple selection
  showbydefault: false            # Activate multiple selection mode by default

# Configure filter function (optional)
filter:
  enabled: true                   # Enable/disable filter function
  showbydefault: false            # Activate filter mode by default
  filters:                        # Predefined filters (optional)
    entity_type: ['plant', 'cycle']  # Filter by entity type
    area: ['living_room', 'kitchen']    # Filter by areas

# Configuration for "Add New Plant" (optional)
add_plant:
  enabled: true                   # Show button to add a plant
  position: bottom                # Button position: "top" or "bottom"

# Which columns should be displayed (true = show, false = hide)
show_columns:
  friendly_name: true             # Plant name
  state: true                     # Status
  area: true                      # Area
  moisture: true                  # Moisture
  temperature: true               # Temperature
  brightness: false               # Brightness
  conductivity: false             # Conductivity
  fertility: false                # Fertility
  humidity: false                 # Humidity
  ph: false                       # pH value
  health: true                    # Health
  battery: false                  # Battery
  growth_phase: false             # Growth phase
  pot_size: false                 # Pot size

  images: false                   # Images
  notes: false                    # Notes
  cycle: false                    # Cycle
  variant: false                  # Variant
  # And many more options...
```

## Installation

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

### ATM Dashboard Resources for list and area card have to be added manually!! Just add another ressource and copy the existing brokkoli-card resource and change to brokkoli-list-card and *-area-card

### Via HACS
* Add this repository as a "Custom repository" with type "Lovelace"
  * Click on HACS in your Home Assistant
  * Click on Frontend
  * Click on the 3 dots in the upper right corner and select "Custom Repositories"
  * Add the URL to this GitHub repository (https://github.com/dingausmwald/lovelace-brokkoli-card) and the category "Lovelace"
* Click on "Install" in the new "Brokkoli Card" card in HACS
* Wait until the installation is complete
* You don't need to restart Home Assistant, but you probably need to refresh the frontend and/or use "Shift-Reload" to update the browser cache.

### Manual Installation
1. Download the files `brokkoli-card.js`, `brokkoli-area-card.js`, and `brokkoli-list-card.js` and add them somewhere in your `<config>/www/` folder in HA
 
2. Click on your profile picture in the lower left corner -> Enable advanced mode.
 
3. Go to Configuration -> Lovelace Dashboards -> Resources -> press the + (bottom right corner of the screen) and add the following information:

```yaml
  Url: /local/<path to>/brokkoli-card.js
  Resource type: JavaScript Module
```
Repeat this for `brokkoli-area-card.js` and `brokkoli-list-card.js`.

4. After that, press *Create* to add the new resource.

5. You don't need to restart Home Assistant, but you probably need to refresh the frontend and/or use "Shift-Reload" to update the browser cache.

## Dependencies
1. Custom Plant Integration (https://github.com/dingausmwald/homeassistant-brokkoli)

## Communication Between Cards

All three cards can communicate with each other when configured with matching identifiers:

1. Set an `identifier` in the Brokkoli Area Card or Brokkoli List Card
2. Set `listen_to` in the Brokkoli Card to the same value
3. When you now select a plant in the Area or List Card, the Brokkoli Card will automatically update
