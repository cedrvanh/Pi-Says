# Pi Memory Game

> A Raspberry Pi compatible version of the popular game Simon Memory Game

A modern remake of the popular electronical childs game: Simon
The board creates a series of tones and lights and you have to repeat the sequence. The game becomes progressively longer and more complex.
If you don't succeed in matching the pattern, the game is over.
Play through your web browser or Raspberry Pi and compete for a spot on the leaderboard.

## Web Application

You can play the game in your browser by going to the [website](https://cedrvanh.github.io/Pi-Memory-Game).
You can login with the credentials of a Test User or just play as a guest.

### Test User
```
USER = test@example.be
PASS = secret
```

## Raspberry Pi

If you want to play this on your Raspberry Pi you will need a few components
- 4x LEDS
- 4x Colored Buttons
- Breadboard (Optional)
- Resistors
- Wiring cables

Run the pi folder on your Pi with Python3 by running
```
python3 app_pi_says.py
```

## Built with

* Javascript (ES6+)
* Firebase (Firestore & Authentication)
* SASS
* Webpack

## Author
* Cedric Vanhaegenberg [Github](https://github.com/cedrvanh)

Made for the course Web of Things for the Artevelde University College Ghent