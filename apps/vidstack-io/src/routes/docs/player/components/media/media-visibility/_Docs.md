## Usage

The `<vds-media-visibility>` component can be used to manage the playback/volume state of a provider
as page/viewport visibility changes. The
[Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
and [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) are
used to detect visibility changes, including minimizing the browser window, device sleep,
changing tabs, or scrolling the provider in and out of view.

<slot name="usage" />

Each provider must be a child of `<vds-media-visibility>`, so they can register with the component and
be managed together:

<slot name="usage-multiple" />

## Viewport Visibility

You can perform actions on a provider as media enters or exits the browser's
[visual viewport](https://developer.mozilla.org/en-US/docs/Glossary/Viewport) like so:

<slot name="viewport-actions" />

- In the example above, we're playing media as it enters the viewport and pausing it as it leaves.
  Currently, other actions include muting `mute` and unmuting `unmute`.
- The `intersection-threshold` <AttrWord /> indicates what percentage of the player must be in the viewport to
  be considered visible (e.g., `1` = `100%`, `0.5` = `50%`, etc.).
- You can add a slight delay to when the _entry_ action is performed by using
  the `viewport-enter-delay` <AttrWord />. Setting a delay helps avoid jittery state changes as
  the user scrolls (i.e., rapidly playing/pausing media).

### Viewport Change Event

You can listen to the `vds-media-visibility-change` event to be notified of any changes
to viewport visibility of the provider like so:

<slot name="viewport-visibility-change" />

## Page Visibility

:::tip
The [Page Lifecycle API](https://developers.google.com/web/updates/2018/07/page-lifecycle-api)
article by Phillip Walton is an excellent primer for working with the `<vds-media-sync>`
page visibility API.
:::

Similarly to the actions you can take on viewport visibility changes, you can perform them on a
provider as page visibility changes like so:

<slot name="page-actions" />

- In the example above, we're playing media as it enters the page and pausing it as it exits.
  Currently, other actions include muting `mute` and unmuting `unmute`.
- You can add a slight delay to when the _entry_ action is performed by using
  the `page-enter-delay` <AttrWord />. Setting a delay creates a smoother experience by
  avoiding jittery state changes as the user changes browser tabs.
- The `page-change-type` <AttrWord /> refers to the type of `hidden` state that will trigger the entry
  and exit actions. It can be set to `state` or `visibility`. We'll explain the difference in the
  next section.

### Page State vs. Visibility

Page state and visibility can be confusing as they're vague terms. Page state here refers
to the [page lifecycle state](https://developers.google.com/web/updates/2018/07/page-lifecycle-api#overview_of_page_lifecycle_states_and_events),
and page visibility refers to the [document's visibility](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState).

The page state can be one of the following values:

- **active:** A page is in the active state if it is visible and has input focus.
- **passive:** A page is in the passive state if it is visible and does not have input focus.
- **hidden:** A page is in the hidden state if it is not visible.

:::info
Important to note we only account for a subset of page states. We may track more states in the
future if required.
:::

In addition, page visibility can be one of the following values:

- **visible:** The page content may be at least partially visible. In practice, this means that
  the page is the foreground tab of a non-minimized window.
- **hidden:** The page content is not visible to the user. In practice, this means that the
  document is either a background tab, part of a minimized window, or the OS screen lock is
  active.

You'll _generally_ want to use `state` as it refers to completely visible or not. Page state
also helps differentiate between `active` and `passive` states based on input focus. In contrast,
`visibility` refers to partially visible or not.

In summary, use `visibility` if you want media to keep playing as the user jumps between
applications and keeps the page tab active; or, use `state` if you'd like to pause if the user
moves away from the page in any way.

### Page Change Event

You can listen to the same `vds-media-visibility-change` event to be notified of any page visibility
changes of the provider like so:

<slot name="page-visibility-change" />
