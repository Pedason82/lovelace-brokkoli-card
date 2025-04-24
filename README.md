# Brokkoli Card

**Diese Brokkoli-Card benötigt folgende Plant-Komponente:
https://github.com/dingausmwald/homeassistant-brokkoli**

Die Karten können über die grafische Benutzeroberfläche eingerichtet werden (erfordert Version 3.0.0 oder höher).

## Inhaltsverzeichnis

- [Brokkoli Card](#brokkoli-card) - Hauptkarte für einzelne Pflanzen
- [Brokkoli Area Card](#brokkoli-area-card) - Karte zur Anzeige von Pflanzen in einem Bereich
- [Brokkoli List Card](#brokkoli-list-card) - Karte zur tabellarischen Übersicht aller Pflanzen
- [Installation](#installation)
- [Abhängigkeiten](#abhängigkeiten)

## Brokkoli Card

Die Hauptkarte für einzelne Pflanzen mit detaillierten Informationen und Grafiken.

### YAML-Konfiguration

```yaml
type: custom:brokkoli-card
entity: plant.my_plant            # Pflicht: Die Pflanzen-Entity
battery_sensor: sensor.demo_battery   # Optional: Batterie-Sensor für die Karte

# Welche Balken angezeigt werden sollen (optional, Standardwerte wenn nicht definiert)
show_bars:
  - moisture
  - temperature
  - conductivity
  - brightness
  - humidity
  - dli
  - fertility
  - health

# Welche Balken in voller Breite angezeigt werden (optional)
full_width_bars:
  - health

# Welche Elemente direkt auf der Karte angezeigt werden (optional, in dieser Reihenfolge)
# Standardwerte, wenn nicht definiert: header, attributes, options
show_elements:
  - header
  - attributes
  - options
  - timeline
  - consumption

# Welche Elemente im Optionsmenü verfügbar sind (optional)
# Standardwerte, wenn nicht definiert: attributes, timeline, consumption, history, details
option_elements:
  - attributes
  - timeline
  - consumption
  - history
  - details

# Welche Optionen standardmäßig geöffnet sind (optional)
default_expanded_options:
  - timeline
  - history

# Anzeige-Typ: "full" oder "compact" (optional, Standard: "full")
display_type: full

# Hören auf Auswahl-Events von anderen Karten (optional)
listen_to: my_identifier

# Gruppierung für den Verlauf (History) (optional)
history_groups:
  - moisture
  - temperature
  - conductivity

# Position der Verlaufslinie: "left" oder "right" (optional, Standard: "left")
history_line_position: left
```

### Verfügbare Elemente

* `header` - Kopfbereich mit Pflanzenbild und Grundinformationen
* `attributes` - Attributbalken (Feuchtigkeit, Temperatur usw.)
* `options` - Optionsmenü mit Schaltflächen
* `timeline` - Zeitachsenbereich mit Grafik
* `consumption` - Verbrauchsbereich
* `history` - Verlaufsbereich
* `details` - Detaillierte Pflanzeninformationen

## Brokkoli Area Card

Zeigt Pflanzen als interaktive Elemente in einem Bereich an. Die Pflanzen können per Drag & Drop positioniert werden und zeigen farbige Ringe für verschiedene Sensoren.

### YAML-Konfiguration

```yaml
type: custom:brokkoli-area-card
title: Mein Pflanzenbereich     # Optional: Titel der Karte

# Definieren, welche Pflanzen angezeigt werden sollen (mindestens eine dieser Optionen muss angegeben werden)
area: wohnzimmer                 # Optional: Bereich, aus dem Pflanzen angezeigt werden
entity: plant.my_plant           # Optional: Einzelne Pflanze zur Anzeige
entities:                        # Optional: Liste von Pflanzen zur Anzeige
  - plant.plant1
  - plant.plant2

# Eindeutige ID für die Karte, wenn sie mit anderen Karten kommunizieren soll
identifier: mein_bereich         # Optional: Eindeutiger Identifier für diese Karte

# Welche Sensoren als Ringe um die Pflanzen angezeigt werden sollen
# Standard: health, moisture, temperature
show_rings:
  - health
  - moisture
  - temperature
  - brightness

# Welche Sensoren als Labels in der Mitte angezeigt werden sollen (optional)
show_labels:
  - moisture
  - temperature

# Heatmap-Konfiguration (optional)
heatmap: moisture                 # Sensor für die Heatmap (z.B. moisture, temperature)
heatmap_color: "#00ff00"          # Benutzerdefinierte Farbe für die Heatmap
heatmap_secondary_color: "white"  # Sekundäre Farbe für die Heatmap
heatmap_opacity: 0.8              # Deckkraft für die Heatmap (0.0 - 1.0)

# Ob die Legende angezeigt werden soll (optional, Standard: true)
legend: true
```

Die Brokkoli Area Card ermöglicht es:
- Pflanzen mit Drag & Drop zu positionieren
- Mehrere Pflanzen gleichzeitig zu bewegen
- Sensorzustände als farbige Ringe zu visualisieren
- Eine Heatmap für einen ausgewählten Sensor anzuzeigen
- Pflanzen zu gruppieren und anzuordnen
- Beim Klick auf eine Pflanze Details anzuzeigen oder mit anderen Brokkoli-Karten zu interagieren

## Brokkoli List Card

Zeigt eine tabellarische Übersicht aller Pflanzen an. Ermöglicht Sortieren, Filtern und Mehrfachauswahl.

### YAML-Konfiguration

```yaml
type: custom:brokkoli-list-card
title: Pflanzenübersicht          # Optional: Titel der Karte
area: wohnzimmer                  # Optional: Filtert nach Pflanzen in einem bestimmten Bereich

# Eindeutige ID für die Karte, wenn sie mit anderen Karten kommunizieren soll
identifier: meine_liste           # Optional: Eindeutiger Identifier für diese Karte

# Suchfunktion konfigurieren (optional)
search:
  enabled: true                   # Such-Funktion aktivieren/deaktivieren
  placeholder: Suche nach Pflanzen...  # Platzhaltertext für das Suchfeld

# Mehrfachauswahl konfigurieren (optional)
multiselect:
  enabled: true                   # Mehrfachauswahl aktivieren/deaktivieren
  showbydefault: false            # Mehrfachauswahlmodus standardmäßig aktivieren

# Filterfunktion konfigurieren (optional)
filter:
  enabled: true                   # Filter-Funktion aktivieren/deaktivieren
  showbydefault: false            # Filtermodus standardmäßig aktivieren
  filters:                        # Vordefinierte Filter (optional)
    entity_type: ['plant', 'cycle']  # Filtern nach Entity-Typ
    area: ['wohnzimmer', 'küche']    # Filtern nach Bereichen

# Konfiguration für "Neue Pflanze hinzufügen" (optional)
add_plant:
  enabled: true                   # Button zum Hinzufügen einer Pflanze anzeigen
  position: bottom                # Position des Buttons: "top" oder "bottom"

# Welche Spalten angezeigt werden sollen (true = anzeigen, false = ausblenden)
show_columns:
  friendly_name: true             # Pflanzenname
  state: true                     # Status
  area: true                      # Bereich
  moisture: true                  # Feuchtigkeit
  temperature: true               # Temperatur
  brightness: false               # Helligkeit
  conductivity: false             # Leitfähigkeit
  fertility: false                # Fruchtbarkeit
  humidity: false                 # Luftfeuchtigkeit
  ph: false                       # pH-Wert
  health: true                    # Gesundheit
  battery: false                  # Batterie
  growth_phase: false             # Wachstumsphase
  pot_size: false                 # Topfgröße

  images: false                   # Bilder
  notes: false                    # Notizen
  cycle: false                    # Zyklus
  variant: false                  # Variante
  # Und viele weitere Optionen...
```

## Installation

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

### Via HACS
* Füge dieses Repository als "Custom repository" mit Typ "Lovelace" hinzu
  * Klicke auf HACS in deinem Home Assistant
  * Klicke auf Frontend
  * Klicke auf die 3 Punkte in der oberen rechten Ecke und wähle "Custom Repositories"
  * Füge die URL zu diesem GitHub-Repository (https://github.com/dingausmwald/lovelace-brokkoli-card) und die Kategorie "Lovelace" hinzu
* Klicke auf "Installieren" in der neuen "Brokkoli Card" Karte in HACS
* Warte, bis die Installation abgeschlossen ist
* Du musst Home Assistant nicht neu starten, aber wahrscheinlich musst du das Frontend aktualisieren und/oder "Shift-Reload" verwenden, um den Browser-Cache zu aktualisieren.

### Manuelle Installation
1. Lade die Dateien `brokkoli-card.js`, `brokkoli-area-card.js` und `brokkoli-list-card.js` herunter und füge sie irgendwo in deinem `<config>/www/` Ordner in HA hinzu
 
2. Klicke auf dein Profilbild in der unteren linken Ecke -> Aktiviere den erweiterten Modus.
 
3. Gehe zu Konfiguration -> Lovelace Dashboards -> Ressourcen -> drücke das + (untere rechte Ecke des Bildschirms) und füge die folgenden Informationen hinzu:

```yaml
  Url: /local/<Pfad zu>/brokkoli-card.js
  Resource type: JavaScript Module
```
Wiederhole dies für `brokkoli-area-card.js` und `brokkoli-list-card.js`.

4. Drücke danach auf *Erstellen*, um die neue Ressource hinzuzufügen.

5. Du musst Home Assistant nicht neu starten, aber wahrscheinlich musst du das Frontend aktualisieren und/oder "Shift-Reload" verwenden, um den Browser-Cache zu aktualisieren.

## Abhängigkeiten
1. Custom Plant Integration (https://github.com/dingausmwald/homeassistant-brokkoli)

## Kommunikation zwischen den Karten

Alle drei Karten können miteinander kommunizieren, wenn sie mit passenden Identifiern konfiguriert sind:

1. Setze einen `identifier` in der Brokkoli Area Card oder Brokkoli List Card
2. Setze `listen_to` in der Brokkoli Card auf den gleichen Wert
3. Wenn du nun eine Pflanze in der Area oder List Card auswählst, wird die Brokkoli Card automatisch aktualisiert

## Haftungsausschluss
Diese Karte basiert auf https://github.com/thomasloven/lovelace-brokkoli-card und enthält Änderungen aus verschiedenen Forks. Ab Version 3.0.0 wurde die Karte weitgehend neu geschrieben, wobei nur das Design und Layout der ursprünglichen Karte beibehalten wurde.
