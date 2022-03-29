## Usage

All media elements exist inside the `<vds-media>` component. It's main jobs are to host the
media controller, and expose media state through attributes and CSS properties for styling purposes.

The media controller is central to the player architecture, hence why it's hosted by `<vds-media>`
which is the top-most component. The controller acts as a message bus between the media provider
and UI. The main responsibilities include:

- Providing the media context that is used to pass media state down to components. This
  context is injected into and managed by the media provider.

- Listening for media request events and satisfying them by calling the appropriate props/methods on
  the current media provider.

<slot name="usage" />
