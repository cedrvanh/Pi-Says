import firebase_admin
from firebase_admin import credentials, firestore
from gpiozero import LED, Button
from time import sleep
import random

# Assign colored LEDs with their GPIO BCM numbers
LED_GREEN = LED(16)
LED_RED = LED(12)
LED_YELLOW = LED(25)
LED_BLUE = LED(24)

# Assign colored buttons with their GPIO BCM numbers
BUTTON_GREEN = Button(22)
BUTTON_RED = Button(27)
BUTTON_YELLOW = Button(17)
BUTTON_BLUE = Button(26)

# Define global game variables
score = 0
sequence_pattern = []
player_pattern = []

# Get credentials from JSON 
cred = credentials.Certificate('./firebase-credentials.json')

# Initialize the app with given credentials
firebase_admin.initialize_app(cred)

# Create instance of Firestore
db = firestore.client()

# Test User ID for prototype
uid = 'wsimHTOT9PdMVvuSgaNx00oNUZq2'

# Firestore data by user
game_ref = db.collection(u'users').document(uid)

# Listener for real time data changes
def on_snapshot(doc_snapshot, changes, read_time):
    print(u'Received updates from game')
    for doc in doc_snapshot:
        update_data(doc.to_dict())

# Update global pattern variables when firestore data has been updated
def update_data(doc):
    global sequence_pattern
    global player_pattern
    sequence_pattern = doc['sequence_pattern']
    player_pattern = doc['player_pattern']

# Returns random value between 0 & 3
def get_random_number():
    return random.randint(0, 3)

# Returns color by id
def get_color(id):
    colors = {
        0: u'GREEN',
        1: u'RED',
        2: u'YELLOW',
        3: u'BLUE'
    }
    return colors.get(id, 'Invalid Color')

# Returns LED by id
def get_led(id): 
    leds = {
        0: LED_GREEN,
        1: LED_RED,
        2: LED_YELLOW,
        3: LED_BLUE
    }
    return leds.get(id, 'Invalid LED')

# Returns button by ID
def get_button(id):
    buttons = {
        0: BUTTON_GREEN,
        1: BUTTON_RED,
        2: BUTTON_YELLOW,
        3: BUTTON_BLUE
    }
    return buttons.get(id, 'Invalid Button')
    
# Blink LED 
def activate_led(id):
    led = get_led(id)
    led.on()
    sleep(1)
    led.off()

# Starts first sequence
def init_sequence():
    # If web app didn't exist, you could start the game via your Pi
    # new_sequence = get_random_number()
    # sequence_pattern.append(new_sequence)
    play_sequence(sequence_pattern)

# Plays current sequence
def play_sequence(id):
    color = get_color(id)
    activate_led(id)

# Assigns next randomly generated value to the sequence
def next_sequence():
    next_sequence = get_random_number()
    sequence_pattern.append(next_sequence)
    game_ref.update({
        u'sequence_pattern': sequence_pattern
    })
    show_sequence()

# Loops through the entirety of the current sequence
def show_sequence():
    for i in range(len(sequence_pattern)):
        play_sequence(sequence_pattern[i])
        sleep(1)

# Empties array and reset sequence
def reset_sequence():
    sequence_pattern.clear()
    game_ref.update({
        u'sequence_pattern': sequence_pattern
    })

# Empties array and reset player pattern
def reset_player():
    player_pattern.clear()
    game_ref.update({
        u'player_pattern': player_pattern
    })

# Increments score by 1
def update_score(): 
    global score
    score += 1

# If highscore has been beat, update the highscore in firestore
def save_score():
    doc = game_ref.get().to_dict()
    if score > doc[u'highscore']:
        print(u'You beat your highscore. Congratulations!')
        game_ref.update({
            u'highscore': score
        })
    else:
        print(u'You did not beat your highscore. Try again!')

# Button press event
def button_press(id): 
    button = get_button(id)
    button.when_released = lambda: activate_led(id)

# Handles game logic when user presses a button
def handle_input(id):
    button_press(id)
    player_pattern.append(id)
    play_sequence(id)
    game_ref.update({
        u'player_pattern': player_pattern
    })

    if sequence_pattern[len(player_pattern) - 1] == player_pattern[len(player_pattern) - 1]:
        if len(sequence_pattern) == len(player_pattern):
            print('Good move, next level')
            sleep(1)
            # Win condition, next round
            next_sequence()
            reset_player()
            update_score()
    else:
        print('Wrong move, lost')
        # Reset game
        lost_game()
        save_score()

# Blink all LEDs if game is lost and reset patterns
def lost_game():
    LED_GREEN.blink(1, 1, 3)
    LED_RED.blink(1, 1, 3)
    LED_YELLOW.blink(1, 1, 3)
    LED_BLUE.blink(1, 1, 3)

    reset_sequence()
    reset_player()

# Starts game through Pi
# init_sequence()

# Firestore data watcher and updates patterns
game_ref.on_snapshot(on_snapshot)

while True:
    # Execute input method a button is pressed
    # For some reason the buttons are already detected as active, so I had to use the opposite / # event to check if button has been pressed
    BUTTON_GREEN.when_released = lambda: handle_input(0)
    BUTTON_RED.when_released = lambda: handle_input(1)
    BUTTON_YELLOW.when_released = lambda: handle_input(2)
    BUTTON_BLUE.when_released = lambda: handle_input(3)
    sleep(.1)