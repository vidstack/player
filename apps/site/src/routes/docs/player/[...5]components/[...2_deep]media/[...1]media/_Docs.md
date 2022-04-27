---
description: This is the top-most component in the library used to group media elements and control the flow of media state.
---

## Usage

All media elements exist inside the `<vds-media>` component. It's main jobs are to host the
media controller, and expose media state through HTML attributes and CSS properties for styling
purposes.

The media controller is central to the player architecture, hence why it's hosted by `<vds-media>`
which is the top-most component. The controller acts as a message bus between the media provider
and UI. The controller's responsibilities include:

- Providing the media store context down to all child consumers (i.e., UI components) so they can
  subscribe to media state changes.
- Listening for media request events so it can try and satisfy them (e.g., accepting a play
  request and satisfying it by calling play on the media provider).
- Listening to media events and updating state in the media store.

<slot name="usage" />
