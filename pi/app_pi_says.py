# from gpiozero import LED
# from time import sleep

# green = LED(18)
# red = LED(23)
# blue = LED(24)
# yellow = LED(25)


# while True:
#     green.on()
#     blue.on()
#     yellow.off()
#     red.off()
#     sleep(1)
#     red.on()
#     yellow.on()
#     blue.off()
#     green.off()
#     sleep(1)

# import firebase_admin
# from firebase_admin import credentials, firestore
from gpiozero import LED
from time import sleep
import random

LED_GREEN = LED(18)
LED_RED = LED(23)
LED_BLUE = LED(24)
LED_YELLOW = LED(25)
sequence_pattern = [0, 0, 0]
player_pattern = [2, 1]
score = 0

# Get credentials from JSON 
# cred = credentials.Certificate('./firebase-credentials.json')

# Initialize the app with given credentials
# firebase_admin.initialize_app(cred)

# Create instance of Firestore
# db = firestore.client()

def get_random_number():
    return random.randint(0, 3)

def get_color(id):
    colors = {
        0: u'GREEN',
        1: u'RED',
        2: u'YELLOW',
        3: u'BLUE'
    }
    return colors.get(id, 'Invalid Color')

def get_led(id): 
    leds = {
        0: LED_GREEN,
        1: LED_RED,
        2: LED_BLUE,
        3: LED_YELLOW
    }
    return leds.get(id, 'Invalid LED')

def activate_led(id):
    led = get_led(id)
    led.on()
    sleep(1)
    led.off()

def init_sequence():
    new_sequence = get_random_number()
    sequence_pattern.append(new_sequence)
    play_sequence(new_sequence)

def play_sequence(id):
    color = get_color(id)
    # LED ON Logic
    activate_led(id)

def next_sequence():
    next_sequence = get_random_number()
    sequence_pattern.append(next_sequence)

def show_sequence():
    for i in range(len(sequence_pattern)):
        play_sequence(sequence_pattern[i])
        sleep(1)

def update_score(): 
    score += 1

def handle_input(id):
    # Button logic
    player_pattern.append(id)
    play_sequence(id)

    if sequence_pattern[len(player_pattern) - 1] == player_pattern[len(player_pattern) - 1]:
        if len(sequence_pattern) == len(player_pattern):
            print('Good move, next level')
            # Next sequence
    else:
        print('Wrong move, lost')
        # Reset game

show_sequence()
# while True: