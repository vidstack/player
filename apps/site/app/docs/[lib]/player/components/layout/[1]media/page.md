---
description: This is the top-most component in the library used to group media elements and control the flow of media state.
---

## Usage

All media elements exist inside the `$tag:vds-media` component. It's main jobs are to host the
media controller, and expose media state through HTML attributes and CSS properties for styling
purposes.

The media controller is central to the player architecture as it acts as a message bus
between the media provider and UI components. It's responsibilities include:

- Providing the media store context down to all child consumers (i.e., UI components) so they can
  subscribe to media state changes.
- Listening for media request events so it can try and satisfy them (e.g., accepting a play
  request and satisfying it by calling play on the media provider).
- Listening to media events and updating state in the media store.

{% code_snippet name="usage" copy=true  /%}
