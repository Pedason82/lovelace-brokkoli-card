import { css } from 'lit';

export const style = css`
  /* Base Card Styles */
  ha-card {
    display: flex;
    flex-direction: column;
    position: relative;
    box-sizing: border-box;
    max-height: 100%;
  }

  .card-margin-top {
    margin-top: 32px;
  }

  /* Header Styles */
  .header,
  .header-compact {
    position: relative;
  }

  .header {
    padding-top: 8px;
    height: 100px;
  }

  .header-compact {
    padding-top: 4px;
    height: 55px;
  }

  /* Header Image */
  .header > img,
  .header-compact > img {
    border-radius: 50%;
    object-fit: cover;
    float: left;
    box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2));
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
  }

  .header > img {
    width: 100px;
    height: 100px;
    margin: -16px 16px 0;
  }

  .header-compact > img {
    width: 50px;
    height: 50px;
    margin: 0 8px;
  }

  .header > img.fade,
  .header-compact > img.fade {
    opacity: 0;
  }

  /* Header Text */
  #name {
    font-weight: bold;
    text-transform: capitalize;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header > #name {
    width: fit-content;
    max-width: calc(100% - 150px);
    margin: 16px 0 0 132px;
  }

  .header-compact > #name {
    width: calc(100% - 74px);
    margin-top: 8px;
  }

  #name ha-icon {
    color: rgb(240, 163, 163);
  }

  #species {
    text-transform: capitalize;
    color: #8c96a5;
    display: block;
  }

  .header > #species {
    margin: 4px 0 0 132px;
  }

  .header-compact > #species {
    line-height: 85%;
    font-size: 0.8em;
    margin: 0 4px 0 0;
    opacity: 0.4;
  }

  #battery {
    float: right;
    margin: -15px 16px 0 0;
  }

  /* Status Container */
  #status-container {
    display: flex;
    gap: 16px;
    margin: 4px 0 0 132px;
  }

  #status-container span {
    color: #8c96a5;
    display: flex;
    align-items: center;
  }

  #status-container ha-icon,
  #metrics-container ha-icon {
    margin-right: 4px;
  }

  /* Divider */
  .divider {
    height: 1px;
    background-color: #727272;
    opacity: 0.25;
    margin: 0 8px;
  }

  /* Attributes Section */
  .attributes {
    display: flex;
    white-space: nowrap;
    padding: 8px;
  }

  .attribute {
    white-space: nowrap;
    display: flex;
    align-items: center;
    width: 50%;
  }

  .attribute ha-icon {
    margin: 0 10px 0 5px;
  }

  .attributes.width-100 {
    padding: 2px;
  }

  .attribute.width-100 {
    width: 100%;
    margin: 0 5px 3px 0;
  }

  .attribute.width-100 .header {
    display: none;
  }

  /* Meter Styles */
  .meter {
    height: 8px;
    background-color: var(--primary-background-color);
    border-radius: 2px;
    display: inline-grid;
    overflow: hidden;
  }

  .meter > span {
    grid-row: 1;
    grid-column: 1;
    height: 100%;
  }

  .meter.red {
    flex-grow: 1;
    margin-right: 5px;
    max-width: 5%;
  }

  .meter.green {
    flex-grow: 10;
    margin-right: 5px;
    max-width: 40%;
  }

  .attribute.tooltip.width-100 .meter.green {
    max-width: 90%;
  }

  .meter > .good {
    background-color: rgba(43, 194, 83, 1);
  }

  .meter > .bad {
    background-color: rgba(240, 163, 163);
  }

  .meter > .unavailable {
    background-color: rgba(158, 158, 158, 1);
  }

  /* Tooltip Styles */
  .tooltip {
    position: relative;
  }

  .tooltip .tip {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    padding: 6px 10px;
    top: 3.3em;
    left: 50%;
    transform: translateX(-50%) translateY(-180%);
    background: grey;
    color: white;
    white-space: nowrap;
    z-index: 2;
    border-radius: 2px;
    transition: opacity 0.2s cubic-bezier(0.64, 0.09, 0.08, 1), transform 0.2s cubic-bezier(0.64, 0.09, 0.08, 1);
  }

  .battery.tooltip .tip {
    top: 2em;
  }

  .tooltip:hover .tip,
  .tooltip:active .tip {
    display: block;
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-200%);
  }

  /* Timeline Styles */
  .timeline-container {
    margin: 8px 16px 0;
    padding: 16px 16px 0;
    background: var(--card-background-color, #fff);
    box-shadow: var(--ha-card-box-shadow, none);
  }

  .timeline {
    position: relative;
    width: 100%;
    height: 120px;
    margin: 4px 0;
  }

  /* Timeline Labels */
  .timeline-labels {
    position: relative;
    height: 20px;
    margin-bottom: 8px;
  }

  .timeline-label {
    position: absolute;
    transform: translateX(-50%);
    font-size: 0.8em;
    color: var(--primary-text-color);
    white-space: nowrap;
    transition: all 0.2s ease-in-out;
    line-height: 1.2em;
    bottom: 0;
  }

  .timeline-label.offset-up {
    transform: translateX(-50%) translateY(-100%);
  }

  .timeline-label.offset-up-2 {
    transform: translateX(-50%) translateY(-200%);
  }

  .timeline-label.offset-down {
    transform: translateX(-50%) translateY(0);
  }

  /* Timeline Events */
  .timeline-events {
    position: relative;
    height: 30px;
    background: var(--secondary-background-color);
    overflow: visible;
  }

  .timeline-event {
    position: absolute;
    height: 100%;
    top: 0;
    min-width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8em;
    color: var(--text-primary-color);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .timeline-event:hover {
    filter: brightness(1.1);
  }

  /* Timeline Status */
  .timeline-status {
    position: absolute;
    height: 4px;
    background: transparent;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }

  .timeline-status-indicator {
    position: absolute;
    height: 100%;
    bottom: 0;
  }

  .timeline-status-problem {
    background-color: var(--error-color, #db4437);
  }

  .timeline-status-unknown {
    background-color: var(--disabled-text-color, #bdbdbd);
  }

  /* Timeline Markers */
  .timeline-markers {
    position: relative;
    height: 20px;
    margin-top: 8px;
  }

  .timeline-marker {
    position: absolute;
    transform: translateX(-50%);
    font-size: 0.7em;
    color: var(--secondary-text-color);
    white-space: nowrap;
    transition: all 0.2s ease-in-out;
    line-height: 1.2em;
    top: 0;
  }

  .timeline-marker.offset-up {
    transform: translateX(-50%) translateY(0);
  }

  .timeline-marker.offset-down {
    transform: translateX(-50%) translateY(100%);
  }

  .timeline-marker.offset-down-2 {
    transform: translateX(-50%) translateY(200%);
  }

  /* Gallery Styles */
  .gallery-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
  }

  .gallery-content {
    position: relative;
    width: 95%;
    height: 95%;
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    overflow: hidden;
    max-height: 95vh;
  }

  /* Gallery Header */
  .gallery-header {
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    color: white;
    z-index: 2;
    position: relative;
  }

  .gallery-date {
    font-size: 0.85em;
    white-space: pre-line;
    line-height: 1.4;
    text-align: left;
    background: rgba(0, 0, 0, 0.5);
    padding: 8px 12px;
    border-radius: 4px;
    max-width: 60%;
    position: absolute;
    left: 16px;
    right: 140px;
    z-index: 1;
    font-weight: normal;
  }

  .gallery-date .phase,
  .gallery-date .day,
  .gallery-date .total {
    font-weight: bold;
  }

  .gallery-header-buttons {
    display: flex;
    gap: 4px;
    align-items: center;
    position: relative;
    z-index: 2;
    margin-left: auto;
  }

  /* Gallery Image Container */
  .gallery-image-container {
    flex: 1 1 auto;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin: 0;
    padding: 0 24px;
    min-height: 0;
  }

  .gallery-image-container a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .gallery-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
    cursor: zoom-in;
  }

  .gallery-image.fade {
    opacity: 0;
  }

  /* Gallery Navigation */
  .gallery-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    padding: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    --mdc-icon-button-size: 48px;
    --mdc-icon-size: 36px;
    color: white;
    z-index: 2;
  }

  .gallery-nav:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .gallery-nav.prev {
    left: 8px;
  }

  .gallery-nav.next {
    right: 8px;
  }

  .gallery-nav ha-icon {
    width: 36px;
    height: 36px;
    color: white;
  }

  /* Gallery Thumbnails */
  .gallery-thumbnails {
    flex: 0 0 140px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.3);
    z-index: 2;
  }

  .thumbnails-scroll {
    display: flex;
    overflow-x: auto;
    gap: 16px;
    padding: 4px;
    height: 124px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.5) transparent;
  }

  .thumbnail-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .thumbnail-group-label {
    color: white;
    font-size: 0.9em;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 2px;
  }

  .thumbnail-group-images {
    display: flex;
    gap: 8px;
    height: 92px;
  }

  .thumbnail-container {
    position: relative;
    flex: 0 0 auto;
    height: 80px;
    aspect-ratio: 1;
    padding: 2px;
    border: 2px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .thumbnail-day {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 0.8em;
    padding: 1px 6px;
    border-radius: 3px;
    white-space: nowrap;
  }

  .thumbnail-container:hover {
    border-color: rgba(255, 255, 255, 0.5);
  }

  .thumbnail-container.active {
    border-color: var(--primary-color, #03a9f4);
  }

  .thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 2px;
  }

  /* Thumbnail Scrollbar */
  .thumbnails-scroll::-webkit-scrollbar {
    height: 6px;
  }

  .thumbnails-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .thumbnails-scroll::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
  }

  /* Flyout Menu */
  .flyout-container {
    position: relative;
    display: flex;
    align-items: center;
    transition: transform 0.2s ease-in-out;
  }

  /* Transform states for first container */
  .flyout-container:first-child {
    transform: translateX(0);
  }

  .flyout-container:first-child.delete-open,
  .flyout-container:first-child.main-open {
    transform: translateX(-31px);
  }

  .flyout-container:first-child.delete-open.main-open {
    transform: translateX(-62px);
  }

  /* Transform states for second container */
  .flyout-container:nth-child(2).delete-open,
  .flyout-container:nth-child(2).main-open {
    transform: translateX(-31px);
  }

  .flyout-container:nth-child(2).delete-open.main-open {
    transform: translateX(-62px);
  }

  /* General transform states */
  .flyout-container.delete-open,
  .flyout-container.main-open {
    transform: translateX(-31px);
  }

  .flyout-container.delete-open.main-open {
    transform: translateX(-62px);
  }

  .flyout-menu {
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%) translateX(6px);
    background: var(--card-background-color);
    border-radius: 4px;
    padding: 2px;
    display: flex;
    gap: 2px;
    box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14));
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease-in-out;
  }

  .flyout-container.open .flyout-menu {
    transform: translateY(-50%) translateX(0);
    opacity: 1;
    visibility: visible;
  }

  .flyout-option {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .flyout-option ha-icon-button {
    --mdc-icon-button-size: 32px;
    --mdc-icon-size: 18px;
    color: var(--primary-text-color);
  }

  /* Button Styles */
  .add-button,
  .delete-button,
  .main-button,
  .confirm-delete,
  .confirm-main {
    --mdc-icon-button-size: 32px;
    --mdc-icon-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .add-button {
    transition: transform 0.2s ease-in-out;
  }

  .flyout-container.open .add-button {
    transform: rotate(45deg);
  }

  .delete-button:hover,
  .main-button:hover,
  .confirm-delete:hover,
  .confirm-main:hover {
    opacity: 0.8;
  }

  .confirm-delete {
    color: var(--error-color, #db4437);
  }

  .confirm-main {
    color: var(--primary-color, #03a9f4);
  }

  /* No Images Message */
  .no-images-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    color: var(--secondary-text-color);
    gap: 16px;
  }

  .no-images-message ha-icon {
    --mdc-icon-size: 64px;
    opacity: 0.5;
  }

  /* Responsive Styles */
  @media (max-width: 600px) {
    .header > .unit {
      display: none;
    }
    .gallery-date {
      right: 120px;
    }
  }

  @media (max-width: 400px) {
    .gallery-date {
      right: 100px;
    }
  }
`;
