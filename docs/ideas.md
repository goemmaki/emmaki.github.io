# Ideas

Ideas the owner wants kept for later, not yet planned. Move one into a handoff when work starts; delete it when done or dropped.

## Live online status from Home Assistant (2026-10-28)

The header clock shows Online on a fixed schedule (10:00 to 18:00, Monday to Friday, Europe/Athens). Later, it could show the owner's real status from Home Assistant, once that is set up properly.

- Never expose Home Assistant to the internet. Home Assistant pushes one online/offline value one way to a tiny public endpoint (a Cloudflare Worker, say), and the site reads only that.
- Track "at my desk" (computer active), not "at home": home presence tells anyone when the house is empty.
- Keep the schedule as the fallback when the endpoint can't be reached.

## Client descriptions on the brands wall (2026-10-28)

Hovering or focusing a name on `/brands` could show a one-sentence description of the client (what they do). The names already carry the page; this adds context without a keyword list. Keep it reachable by keyboard and touch, not hover only.

## Something in the negative space of the page covers (2026-10-28)

The cover on `/brands` (the giant page word and the owner's intro) has empty space that wants something cool in it. Decide once the other pages are done, so it can be one idea across all the covers rather than a one-off.
