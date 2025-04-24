# Brokkoli Card

**This fork of the brokkoli-card depends on this Plant component:
https://github.com/Olen/homeassistant-plant**

The card can be set up from the GUI (requires version 3.0.0)

![image](https://github.com/Olen/lovelace-brokkoli-card/assets/203184/a31ad564-9458-41b4-9c1f-9da13f84f2ae)

## YAML-config
You can also select what bars you want to show for each card

```yaml
type: custom:brokkoli-card
entity: plant.my_plant
show_bars:
- illuminance
- humidity
- moisture
- conductivity
- temperature
- dli
battery_sensor: sensor.demo_battery
```

* Battery sensor

You can optionally add a battery sensor to be displayed in the card.

![image](https://user-images.githubusercontent.com/203184/190199923-6060efbf-7306-49e5-bbc4-26dc922d3180.png)

The sensor will change color based on the state of the battery:
* &gt;= 40%: Green
* 20 - 39%: Orange
* < 20%: Red

# BREAKING CHANGES COMING UP

>**Warning**
>
> **This card is about to be completely rewritten.  The next version will *not* be compatible with the original plant integration in HA or with this release.**

## Breaking Changes

This card will, from version 2.0.0, only work with version 2.0.0 or higher of https://github.com/Olen/homeassistant-plant/.  Please read the README from that repository carefully before upgrading.

## Requires
1. [Lovelace card tools](https://github.com/thomasloven/lovelace-card-tools)
2. [Custom plant integration](https://github.com/Olen/homeassistant-plant/)


## Features in v1.0.0

* Will use attributes from the plant _entity_ to display thresholds.
* Displays nice bars for moisture, conductivity, temperature, illumination

![v1.0.0](https://github.com/remkolems/lovelace-flower-card/blob/master/lovelace-flower-card_popup.png)


## Features coming in v2.0.0

* Will use attributes from the plant _device_ to display thresholds.
* Displays nice bars for moisture, conductivity, temperature, illumination, _humidity_ and _daily light integral_
* Configuration of the card to select which bars to display
* Make sure you install version 2.0.0 or higher of https://github.com/Olen/homeassistant-plant/. 

![v2.0.0](https://user-images.githubusercontent.com/203184/182670259-9abd27c3-8641-444f-9002-4ffc0a80c016.png)

