Revise and improve the existing “Two Universes. One Moment.” interactive birthday website.

Do not rebuild from scratch. Keep the current dark starry background, glassmorphism style, blue-white Apple-like tone, realtime clocks, aurora/snow/fog/particle atmosphere, language toggle, audio button, chapter progress dots, and the overall section structure.

The current version looks clean but still feels too static and simple. Please make it more premium, interactive, cinematic, and emotionally immersive.

Main goals of this revision:

1. Add a password entry screen before the main website.
2. Improve Chapter 2 so the two planets actually merge / synchronize beautifully.
3. Fix Chapter 3 because the 12 memory cards are currently shifted too far left. They must be centered and float gently inside the section.
4. Update Chapter 4 timeline dates and labels.
5. Add more interactions to Chapter 5 Promise Constellation.
6. Add more interactions and feedback to Chapter 6 Wish Machine.
7. Upgrade Chapter 7 birthday cake with a bigger cake, melting candle, and “make a wish / blow candle” interaction.
8. Make the Chapter 8 gift box transition more magical.
9. Add an interaction before revealing the letter in Chapter 9.
10. Make the final hidden photo / ending feel more interactive.
11. Fix or clarify the audio behavior so the user can actually hear ambient piano after interaction.
12. Add a background motion toggle to reduce heavy effects if the computer is slow.

IMPORTANT:
Use Vietnamese as the default visible language. Keep English available through the existing language toggle.
Keep typography Vietnamese-safe. Do not break Vietnamese accents.
Keep performance balanced for normal desktop/laptop.
On mobile, replace hover with tap.

────────────────────────
GLOBAL NEW FEATURE — PASSWORD GATE
────────────────────────

Before entering the main website, add a full-screen password gate.

This password gate must appear before all chapters.

Visual style:

* Same dark universe background as the rest of the site
* Glassmorphism login card in the center
* Soft aurora glow behind the card
* Snow particles and tiny stars
* A small floating glass heart or tiny locked planet above the card
* Premium Apple-like spacing
* Gentle ambient animation

Text:
Main title:
“Mời ck iu nhập password”

Subtitle:
“Chỉ ck iu mới mở được vũ trụ nhỏ này.”

Password:
971413

Use a 6-digit PIN input:

* Six separate rounded glass boxes
* Auto-focus next box after typing
* Allow Backspace
* Allow paste of 6 digits
* Only numeric input
* Add a small custom number pad on mobile if possible

Button:
“Mở vũ trụ”

Correct password behavior:

* When password is 971413, show a soft success animation:

  * The 6 boxes glow cyan
  * A small heart pulse appears
  * The glass card dissolves into particles
  * The camera pushes forward into the universe
  * Then enter Chapter 1

Wrong password behavior:

* Shake the card gently
* Red/pink glow briefly
* Text appears:
  “Chưa đúng rồi ck iu, thử lại nha.”

Security / flow:

* Do not show the main page content until the password is entered correctly.
* Use sessionStorage so that if the user refreshes in the same session, they do not need to re-enter immediately.
* Add a small hint line only if wrong password is entered 3 times:
  “Hint: ngày tụi mình bắt đầu + điều đặc biệt của tụi mình.”
  Do not display the actual password as a hint.

Audio unlock:
Because browsers often block autoplay, start or unlock the ambient piano audio only after the user successfully enters the password or clicks the audio button.
The audio button should clearly show:

* Muted state
* Playing state
* Loading / unavailable state

If no actual music file is attached, create a very soft WebAudio ambient piano/synth placeholder or show:
“Ambient piano placeholder — add audio file here”
But do not show a fake playing state if there is no sound.

────────────────────────
GLOBAL BACKGROUND MOTION TOGGLE
────────────────────────

Add a small button near the top-right controls:
“Motion”
or an icon with tooltip:
“Tắt / mở chuyển động nền”

When OFF:

* Reduce star movement
* Reduce snow/particle count
* Stop heavy parallax
* Stop floating background fog animation
* Keep the page visually beautiful but lighter

When ON:

* Restore current animated background

Also keep the existing audio toggle and language toggle.

────────────────────────
CHAPTER 2 — PLANET SYNCHRONIZATION UPGRADE
────────────────────────

Current issue:
The two planets look too separate and the sync effect is not strong enough. They need to visually synchronize and merge.

Keep the two planets:

* Vietnam / Hồ Chí Minh planet: warm amber/orange glow, moon/city-night mood
* Czech Republic / Ostrava planet: cool blue winter/snow glow

Before clicking:

* Planets orbit very slowly around their own small invisible axis
* Each planet has a soft glass halo
* Thin orbit rings around each planet
* The two planets should have a faint dotted line between them, like a long-distance signal

Button:
“Đồng bộ thời gian”

On click:
Create a cinematic 4-step animation:

Step 1 — Signal lock:

* A thin cyan line connects both planets
* Small particles travel from Vietnam to Ostrava and back
* Text appears briefly:
  “Đang đồng bộ hai bầu trời…”

Step 2 — Gravity pull:

* The two planets slowly move closer to the center
* Their orbit rings stretch and overlap
* The middle heart icon becomes brighter
* Add subtle camera zoom-in

Step 3 — Aurora merge:

* A glassy aurora ribbon wraps around both planets
* Warm orange and cool blue light blend into cyan/white
* The planets do not disappear completely, but they become part of the same shared orbit
* Add circular energy wave expanding from the center

Step 4 — Synchronized state:

* Show the two planets close together with a shared glowing orbital ring
* Add a central crystal heart between them
* Show final text:
  “Khác bầu trời.
  Nhưng vẫn cùng một hiện tại.”

Make this final synchronized state persist after clicking.

Add a small secondary interaction:
If the user hovers/taps the connected orbit after sync:

* The orbit pulses
* Show:
  “8,988 km, nhưng vẫn cùng một nhịp.”

────────────────────────
CHAPTER 3 — FLOATING MEMORIES LAYOUT FIX + ANIMATION
────────────────────────

Current issue:
The 12 memory cards are shifted too far left and look like a static grid.

Fix layout:

* The entire Chapter 3 content must be horizontally centered in the viewport.
* The 12 cards must stay inside a centered container.
* Do not leave a huge empty right side.
* Use max-width: 1200px or similar.
* Use margin-left/right auto.
* The title must be centered.
* The card group must be centered below the title.

Card layout:
Create a floating 3D memory cloud, not a flat grid.

Desktop:

* Arrange 12 vertical cards in a loose 3D constellation/grid:

  * 4 cards top row
  * 4 cards middle row
  * 4 cards bottom row
  * But with slight x/y offsets, depth, and rotation
* The entire group must remain visually centered.
* Cards should have different transform values:

  * rotateX between -4deg and 4deg
  * rotateY between -6deg and 6deg
  * translateY floating animation between -8px and 8px
* Each card floats slowly with a unique animation duration, e.g. 5s to 9s.
* Add subtle parallax with mouse movement.
* Add light sweep on hover.
* Add glass glow on hover.

Mobile:

* Use a centered vertical carousel or 2-column layout.
* No left-shift.
* Tap opens memory bubble.

Card interaction:
On hover/tap:

* The selected card comes forward
* Other cards dim slightly
* Card scale 1.04
* A glass memory bubble opens near the card
* Add caption text

Keep 12 placeholders:
IMG01_PLACEHOLDER to IMG12_PLACEHOLDER

Make each placeholder easy to replace later.

Add small instruction text:
“Chạm để mở một kỷ niệm”

Do not put the cards at the far left. Center this section strictly.

────────────────────────
CHAPTER 4 — UPDATE TIMELINE DATA
────────────────────────

Replace the current Chapter 4 timeline content with these exact milestones:

1.

Date: 20.03.2025
Title: Ngày đầu tụi mình làm quen

2.

Date: 02.05.2025
Title: Ngày tụi mình bắt đầu nói chuyện thật nhiều

3.

Date: 27.06.2025
Title: Ngày đầu gặp nhau

4.

Date: 28.06.2025
Title: Ngày tỏ tình

5.

Date: 05.10.2025
Title: Lần đầu đón một ngày đặc biệt qua màn hình
Subtitle: Kỷ niệm 100 ngày

6.

Date: 07.09.2025
Title: Khi yêu xa thật sự bắt đầu

7.

Date: 09.07.2026
Title: Khi ck iu trở thành vùng an toàn của zk iu

8.

Date: 09.07.2026
Title: Sinh nhật của ck iu

Improve timeline interaction:

* Each node should be clickable.
* When clicked, expand a glass capsule with date, title, small icon, and editable note.
* Add a glowing line that progressively lights up as the user scrolls.
* Add small particle bursts when a node opens.
* Use icons:

  1. sparkle/star
  2. chat bubble
  3. location pin / heart
  4. heart
  5. cake / screen
  6. plane
  7. safe home / shield heart
  8. birthday cake

────────────────────────
CHAPTER 5 — PROMISE CONSTELLATION INTERACTION UPGRADE
────────────────────────

Current Chapter 5 is visually okay but feels too static.

Enhance interactions:

* Keep 50 stars total and 14 Promise Stars.
* Make normal stars twinkle subtly.
* Make Promise Stars pulse slowly.
* Add animated connecting lines between Promise Stars.
* Add small “data pulse” particles traveling along the connecting lines.
* Add camera/parallax movement on mouse move.

Interaction:
When user clicks a Promise Star:

* Zoom slightly into that star
* Dim the rest of the constellation
* Open a glass Promise Card
* The clicked star emits a ripple wave
* The promise card should show:

  * Promise number
  * Vietnamese promise
  * English promise in smaller text
  * A small “Đã mở lời hứa” state after opening

Progress:
Add a small progress counter:
“0/14 lời hứa đã mở”

Every time a promise is opened, update counter:
“1/14 lời hứa đã mở”

When all 14 are opened:

* Trigger constellation completion animation
* Lines connect into a subtle heart shape
* Show:
  “Ck iu đã mở hết 14 lời hứa.”
  “Giờ thì tụi mình giữ chúng cùng nhau nha.”

Secret star:
Keep one tiny hidden star.
Make it more discoverable but still subtle:

* Very faint glow near the bottom center or lower right
* On hover/tap it flickers
* When clicked show:
  “Ngôi sao này nhỏ hơn vì zk iu giấu kỹ hơn.”

────────────────────────
CHAPTER 6 — WISH MACHINE INTERACTION UPGRADE
────────────────────────

Current Chapter 6 looks okay but needs stronger interaction.

Enhance the Wish Machine:

* Make the glass capsule feel more like a machine.
* Add small vertical energy bars below it that charge up.
* Add subtle steam/fog puffs.
* Add tiny spark particles inside the capsule.
* Add soft humming glow around the machine.

Button:
“Tạo một tương lai”

On click:
Create this sequence:

1. Button becomes disabled for 1.5 seconds
2. Energy bars fill one by one
3. Capsule glows brighter
4. Capsule shakes softly, not aggressively
5. A small “future capsule” opens
6. One random future wish appears
7. Add soft sparkle/confetti burst
8. Add button text:
   “Tạo tương lai khác”

Make sure only one future wish appears at a time.
Do not stack multiple wishes.

Add counter:
“Điều ước tương lai #03/10”
Randomize but avoid repeating the same wish until all 10 have appeared.

Add a secondary small interaction:
If user holds the capsule for 3 seconds:
Show:
“Có những tương lai nhỏ, nhưng đủ làm zk iu cố gắng thêm một chút.”

────────────────────────
CHAPTER 7 — BIRTHDAY CAKE + BLOW CANDLE INTERACTION
────────────────────────

Current Chapter 7 is too simple. Upgrade it significantly.

Create a larger birthday cake scene.

Visual:

* Big 3D-like glass / soft pastel birthday cake in center
* Bigger than current cake
* Cake should feel cute but premium, not childish
* Use blue-white aurora lighting with subtle purple/cyan highlights
* Add one main candle or several candles, but at least one main candle must be interactive
* Candle flame should flicker
* Wax should slowly melt down over time with a subtle animation
* Add falling confetti and snow mixed together

Text:
“Chúc mừng sinh nhật ck iu.”
Date:
09.07.2026

Add interaction:
Button:
“Ước rồi thổi nến”

When clicked:

* Show a short message:
  “Ck iu nhắm mắt 3 giây để ước nha.”
* Start 3-second countdown:
  3
  2
  1
* Then show:
  “Thổi nến nào”

If microphone access is possible:

* Optional: ask for microphone permission and detect a loud breath/blow sound.
* If microphone is denied or not available, use click/tap interaction:
  Button:
  “Thổi nến”

When candle is blown:

* Flame bends, flickers, and fades out
* Small smoke curl rises
* Wax glow fades
* Confetti burst appears
* Aurora brightens briefly
* Show:
  “Điều ước của ck iu đã được gửi vào vũ trụ.”
  Then smaller:
  “Zk iu mong điều đó sẽ thành sự thật.”

Do not require microphone. Always provide a clickable fallback.

────────────────────────
CHAPTER 8 — DIGITAL GIFT BOX TRANSITION UPGRADE
────────────────────────

Current gift box opens into video but transition is not magical enough.

Upgrade animation:
Before open:

* Box floats gently
* Ribbon glows faintly
* Add small particles orbiting the box
* Instruction:
  “Giữ để mở hộp quà”

Interaction:

* User must hold for 2 seconds or click-and-hold
* Show circular hold progress around the box
* When hold completes:

  1. Ribbon loosens and unwraps
  2. Ribbon falls down with soft physics
  3. Lid lifts upward and rotates
  4. Bright light emerges from inside
  5. Particles, tiny hearts, snowflakes, and small glowing letters fly out
  6. The whole screen briefly blooms white-blue
  7. Then reveal the vertical video player

Video placeholder:
BIRTHDAY_VIDEO_PLACEHOLDER

Add:

* Play button
* Replaceable video area
* Caption:
  “Món quà thật sự của anh nằm trong vũ trụ nhỏ này.”

Button:
“Mở video sinh nhật”

After video is opened:

* Add a small “continue” hint to move to letter:
  “Sau khi xem xong, ck iu mở tiếp lá thư nha.”

────────────────────────
CHAPTER 9 — LETTER REVEAL INTERACTION + TEXT UPDATE
────────────────────────

Current letter is immediately visible. Change it so the user must interact first.

Before revealing the letter:
Show a closed glass envelope floating in the center.

Visual:

* Glass envelope with tiny heart seal
* Aurora glow behind
* Snow/fog particles
* Soft pulse animation
* A small handwritten-style label:
  “Có một lá thư dành cho ck iu”

Button:
“Mở thư của zk iu”

Interaction:
When clicked:

* Heart seal melts into particles
* Envelope opens
* Glass letter slides upward
* Text appears with subtle typing/fade animation
* Add soft paper/glass sound effect placeholder

Update Vietnamese letter text and change the relationship pronouns:
Replace “anh/em” style with “ck iu/zk iu” style wherever natural.
Use this exact Vietnamese letter:

Title:
“Gửi ck iu”

Letter:

“Darling,

Chúc mừng sinh nhật ck iu.

Zk iu biết ck iu cũng đang chật vật trong thế giới của một người đang lớn, vậy mà ck iu vẫn dịu dàng và dành những điều tốt đẹp nhất cho zk iu.

Có những ngày yêu xa làm zk iu thấy mọi thứ dài hơn bình thường. Một ngày dài hơn. Một đêm cũng dài hơn. Một tin nhắn chờ lâu hơn. Một cuộc gọi kết thúc cũng tiếc hơn. Nhưng kỳ lạ là, chỉ cần nghĩ đến ck iu, zk iu vẫn thấy mình có một nơi rất an toàn để quay về.

Ck iu là người khiến zk iu cảm thấy được thương theo cách rất nhẹ nhàng. Không cần quá ồn ào, không cần phải hoàn hảo, chỉ cần là ck iu thôi cũng đủ làm zk iu thấy thế giới này mềm hơn một chút.

Zk iu mong tuổi mới của ck iu sẽ dịu dàng với ck iu hơn. Mong ck iu có đủ sức khỏe, đủ niềm tin, đủ bình yên, và đủ may mắn để đi qua những ngày khó khăn phía trước. Mong những điều ck iu đang cố gắng sẽ dần có kết quả. Mong ck iu luôn nhớ rằng dù tụi mình đang cách nhau 8,988 km, vẫn có một người ở đây thương ck iu rất nhiều.

Zk iu yêu ck iu nhất trên đời.

Happy Birthday, my safe place.

From zk iu,
Việt Trinh

Đừng quên ck iu còn một lá thư tay zk iu đã viết cho ck iu trong hộp thư nhé.”

Keep the English version available via the “Read in English” button, but it can remain close to the current English version.

Add scroll inside letter if needed, but make it elegant:

* Thin custom scrollbar
* Glass panel
* Good readability
* Do not make the text cramped

Add a hidden microphone icon near the bottom of the letter:
VOICE_MESSAGE_PLACEHOLDER
Button text:
“Nghe lời nhắn từ zk iu”

────────────────────────
CHAPTER 10 — ENDING / HIDDEN PHOTO INTERACTION UPGRADE
────────────────────────

Current ending is okay, and the hidden photo is a nice idea. Make it more interactive.

Ending:

* Keep the two stars representing Vietnam and Ostrava
* Keep heart trail and final message
* Add more aurora movement behind the final text
* Add slow snow particles and fog

Final text should remain:
“Chúc mừng sinh nhật, người zk iu yêu nhất.”
or:
“Chúc mừng sinh nhật, người em yêu nhất.”
Use Vietnamese default, but keep English toggle.

Subtitle:
“Rồi sẽ có một ngày, chúng mình cùng đứng dưới bầu trời này.”

Final date:
“28.06.2025 → ∞”

Hidden photo:
Instead of showing the hidden photo placeholder too obviously:

* Make it a tiny faint star/photo icon under the date
* When hover/tap:

  * It flickers
  * Tooltip:
    “Có gì đó đang giấu ở đây…”

When clicked:

* Open fullscreen modal
* Background darkens
* Show HIDDEN_PHOTO_PLACEHOLDER
* Add text:
  “Thêm một kỷ niệm nữa, chỉ dành cho ck iu.”

Add close button.
Add subtle sparkle around the modal.

Add one final small interaction:
After the hidden photo is opened and closed, show a tiny line:
“Vũ trụ nhỏ này sẽ vẫn ở đây, mỗi khi ck iu cần một nơi để quay lại.”

────────────────────────
AUDIO FIX / AUDIO UX
────────────────────────

The current audio UI appears in the lower-left, but there is no audible sound.

Fix the audio behavior:

* Do not rely on autoplay before user interaction.
* After correct password entry, attempt to start ambient piano audio.
* If browser blocks it, keep the audio button highlighted and show:
  “Bấm để bật nhạc nền”
* If no audio file exists, use a WebAudio-generated soft ambient pad/piano placeholder or clearly label:
  “Audio placeholder — add ambient piano file here”

Audio button states:

1. Muted:
   Icon muted, text optional “Tắt nhạc”
2. Playing:
   Animated waveform, text “Ambient piano”
3. Error / missing:
   Text “Thêm file nhạc tại đây”

Add volume control if easy:

* Small slider on hover/tap
* Default volume around 30%

Keep audio gentle. It should not be loud.

────────────────────────
QUALITY / POLISH REQUIREMENTS
────────────────────────

The current site feels slightly too flat. Add more depth using:

* More layered glass cards
* Subtle aurora gradients behind key objects
* More glow only on important interactions
* Light sweep on cards/buttons
* Soft 3D transforms
* Better centered layouts
* More purposeful motion
* Do not overload everything with random effects

Most important fixes:

1. Add password screen before all content.
2. Chapter 2 sync must feel like planets are truly merging/synchronizing.
3. Chapter 3 must be centered and floating, not left-aligned.
4. Chapter 4 must use the exact updated dates.
5. Chapter 7 must have a big interactive cake with candle/blow interaction.
6. Chapter 9 must require clicking the envelope before showing the letter.
7. Audio must be understandable and actually playable after user interaction.
8. Add Motion toggle to reduce background movement.

Keep the whole experience romantic, cinematic, personal, polished, modern, and interactive — not childish, not cluttered, not cheesy.
